/**
 * 飞行物理系统
 * 负责：升力/重力/推力/阻力计算、起飞降落流程、速度限制
 *
 * 集成方式：脚本加载后自动 hook 到 GameEngine，替换 updateGameplay 中的物理部分
 */

class PhysicsSystem {
  constructor() {
    // ---- 物理常量 ----
    this.gravity = 9.81;           // m/s^2
    this.airDensity = 1.225;       // kg/m^3（海平面标准大气）
    this.wingArea = 50;            // m^2（通用战斗机翼面积）
    this.mass = 15000;             // kg（通用战斗机质量）

    // ---- 气动系数 ----
    this.CL0 = 0.3;               // 零迎角升力系数
    this.CL_alpha = 5.0;          // 升力线斜率（每弧度）
    this.CD0 = 0.025;             // 零升阻力系数
    this.k = 0.04;                // 诱导阻力因子

    // ---- 起飞参数 ----
    this.vrRatio = 0.3;           // 抬轮速度 = maxSpeed * vrRatio
    this.rotationAccel = 8;       // 抬头时初始垂直加速度 (m/s^2)

    // ---- 降落参数 ----
    this.bounceDecay = 0.35;      // 弹跳速度衰减系数
    this.maxBounces = 3;          // 最大弹跳次数
    this.groundFriction = 0.15;   // 地面滚动摩擦系数
    this.brakeFriction = 0.5;     // 刹车摩擦系数

    // ---- 高度限制 ----
    this.maxAltitude = 20000;     // 最大飞行高度（米）

    // ---- 内部状态 ----
    this._verticalSpeed = 0;      // 垂直速度 m/s（正=上升）
    this._bounceCount = 0;        // 当前弹跳计数
    this._onGround = true;        // 是否在地面
    this._throttle = 0;           // 油门 0~1
    this._isRotating = false;     // 是否正在抬轮
  }

  /* ================================================================
   * 主更新入口
   * ================================================================ */

  /**
   * 主更新：计算所有力并更新飞机状态
   * @param {Object} aircraft - 飞机状态对象 { speed, altitude, position, rotation, type }
   * @param {InputSystem} inputSystem - 输入系统实例
   * @param {number} dt - 时间步长（秒）
   * @param {Object} [fallbackConfig] - 后备飞机配置（当 window.AIRCRAFT_CONFIGS 不可用时）
   */
  update(aircraft, inputSystem, dt, fallbackConfig) {
    if (!aircraft) return;

    const config = this._getConfig(aircraft, fallbackConfig);
    if (!config) return;

    const maxSpeed = config.maxSpeed;

    // 获取输入
    const flightInput = inputSystem
      ? inputSystem.getFlightInput()
      : { pitch: 0, roll: 0, yaw: 0 };
    const throttleUp = inputSystem ? inputSystem.isKeyDown('ArrowUp') : false;
    const throttleDown = inputSystem ? inputSystem.isKeyDown('ArrowDown') : false;

    // 更新油门
    if (throttleUp) {
      this._throttle = Math.min(1, this._throttle + dt * 0.5);
    } else if (throttleDown) {
      this._throttle = Math.max(0, this._throttle - dt * 0.8);
    } else {
      // 松开后油门缓慢回到怠速
      this._throttle = Math.max(0.15, this._throttle - dt * 0.1);
    }

    // 地面状态检测（1 米阈值）
    const onGround = aircraft.altitude <= 1;

    // 状态转换检测
    if (onGround && !this._onGround) {
      // 刚着陆
      this._handleTouchdown(aircraft);
    }
    if (!onGround && this._onGround) {
      // 刚离地，重置弹跳计数
      this._bounceCount = 0;
      this._isRotating = false;
    }
    this._onGround = onGround;

    // 执行物理更新
    if (onGround) {
      this._updateOnGround(aircraft, flightInput, dt, config);
    } else {
      this._updateInAir(aircraft, flightInput, dt, config);
    }

    // ---- 强制限制 ----
    aircraft.speed = Math.max(0, Math.min(maxSpeed, aircraft.speed));
    aircraft.altitude = Math.max(0, Math.min(this.maxAltitude, aircraft.altitude));
    aircraft.position.y = aircraft.altitude;
  }

  /* ================================================================
   * 地面物理
   * ================================================================ */

  /**
   * 地面阶段：加速、刹车、抬轮
   */
  _updateOnGround(aircraft, input, dt, config) {
    // ---- 推力加速 ----
    const thrustAccel = config.acceleration * this._throttle;
    aircraft.speed += thrustAccel * dt;

    // ---- 刹车（油门极低时自动刹车） ----
    if (this._throttle < 0.1) {
      aircraft.speed -= aircraft.speed * this.brakeFriction * dt;
    }

    // ---- 滚动摩擦 ----
    aircraft.speed -= aircraft.speed * this.groundFriction * dt;
    aircraft.speed = Math.max(0, aircraft.speed);

    // ---- 抬轮（Rotation）----
    // 达到 Vr 速度 + 机头上仰输入（W 键）→ 抬起机头
    if (this.canTakeoff(aircraft) && input.pitch > 0 && !this._isRotating) {
      this._isRotating = true;
    }

    if (this._isRotating) {
      // 抬头：增加垂直速度
      this._verticalSpeed += this.rotationAccel * dt;
      this._verticalSpeed = Math.min(this._verticalSpeed, 20);

      // 升力辅助：速度越快升力越大
      const v_ms = aircraft.speed / 3.6;
      const liftAccel = this._computeLiftAcceleration(v_ms, aircraft.rotation.pitch);

      // 合成垂直运动
      const netVerticalAccel = liftAccel + this._verticalSpeed - this.gravity;
      aircraft.altitude += Math.max(0, netVerticalAccel * dt * 0.5 + this._verticalSpeed * dt);
    }

    // 地面高度钳制
    if (aircraft.altitude < 0.5 && this._verticalSpeed <= 0 && !this._isRotating) {
      aircraft.altitude = 0;
      this._verticalSpeed = 0;
    }

    // ---- 更新水平位置 ----
    this._updatePosition(aircraft, dt);
  }

  /* ================================================================
   * 空中物理
   * ================================================================ */

  /**
   * 空中阶段：升力、重力、推力、阻力
   */
  _updateInAir(aircraft, input, dt, config) {
    const v_ms = aircraft.speed / 3.6;
    const pitch = aircraft.rotation.pitch;

    // ---- 升力计算 ----
    // CL = CL0 + CL_alpha * alpha（迎角近似等于俯仰角）
    const CL = this.CL0 + this.CL_alpha * pitch;
    const liftForce = 0.5 * this.airDensity * v_ms * v_ms * this.wingArea * CL;

    // ---- 重力 ----
    const gravityForce = this.mass * this.gravity;

    // ---- 推力 ----
    const thrustAccel = config.acceleration * this._throttle * 0.01;
    const thrustForce = this.mass * thrustAccel;
    const verticalThrust = thrustForce * Math.sin(pitch);
    const horizontalThrust = thrustForce * Math.cos(pitch);

    // ---- 阻力 ----
    // CD = CD0 + k * CL^2（包含诱导阻力）
    const CD = this.CD0 + this.k * CL * CL;
    const dragForce = 0.5 * this.airDensity * v_ms * v_ms * this.wingArea * CD;

    // ---- 合力计算 ----
    // 垂直方向：升力 + 推力垂直分量 - 重力
    const netVerticalForce = liftForce + verticalThrust - gravityForce;
    const verticalAccel = netVerticalForce / this.mass;

    // 更新垂直速度
    this._verticalSpeed += verticalAccel * dt;
    this._verticalSpeed = Math.max(-80, Math.min(80, this._verticalSpeed));

    // 更新高度
    aircraft.altitude += this._verticalSpeed * dt;

    // ---- 水平速度更新 ----
    // 推力水平分量 - 阻力
    const netHorizontalForce = horizontalThrust - dragForce;
    const horizontalAccel = netHorizontalForce / this.mass;
    aircraft.speed += horizontalAccel * dt * 3.6; // 转换回 km/h

    // ---- 低速保护 ----
    // 速度极低时，俯仰直接提供升力（游戏手感优化）
    if (v_ms < 25 && aircraft.altitude < 100) {
      aircraft.altitude += input.pitch * 3 * dt;
      this._verticalSpeed += input.pitch * 2 * dt;
    }

    // ---- 防止穿地 ----
    if (aircraft.altitude < 0) {
      aircraft.altitude = 0;
      this._verticalSpeed = 0;
    }

    // ---- 更新水平位置 ----
    this._updatePosition(aircraft, dt);
  }

  /* ================================================================
   * 着陆处理
   * ================================================================ */

  /**
   * 触地检测与弹跳衰减
   */
  _handleTouchdown(aircraft) {
    const impactSpeed = Math.abs(this._verticalSpeed);

    if (impactSpeed > 2 && this._bounceCount < this.maxBounces) {
      // 弹跳：垂直速度反转并衰减
      this._verticalSpeed = -this._verticalSpeed * this.bounceDecay;
      this._bounceCount++;
      aircraft.altitude = 0.5; // 小弹跳高度
    } else {
      // 稳定着陆
      this._verticalSpeed = 0;
      this._bounceCount = 0;
      this._isRotating = false;
      aircraft.altitude = 0;
    }
  }

  /* ================================================================
   * 辅助计算
   * ================================================================ */

  /**
   * 计算升力产生的加速度 (m/s^2)
   * @param {number} v_ms - 空速 (m/s)
   * @param {number} pitch - 俯仰角 (弧度)
   * @returns {number} 升力加速度
   */
  _computeLiftAcceleration(v_ms, pitch) {
    const CL = this.CL0 + this.CL_alpha * pitch;
    const liftForce = 0.5 * this.airDensity * v_ms * v_ms * this.wingArea * CL;
    return liftForce / this.mass;
  }

  /**
   * 更新水平位置（基于速度和航向）
   */
  _updatePosition(aircraft, dt) {
    const cosPitch = Math.cos(aircraft.rotation.pitch);
    const sinYaw = Math.sin(aircraft.rotation.yaw);
    const cosYaw = Math.cos(aircraft.rotation.yaw);

    aircraft.position.x += sinYaw * cosPitch * aircraft.speed * dt * 0.01;
    aircraft.position.z += cosYaw * cosPitch * aircraft.speed * dt * 0.01;
  }

  /**
   * 从全局飞机配置获取参数（支持后备配置）
   */
  _getConfig(aircraft, fallbackConfig) {
    // 优先使用全局配置（aircraft.js 加载后可用）
    if (window.AIRCRAFT_CONFIGS && aircraft.type) {
      return window.AIRCRAFT_CONFIGS[aircraft.type];
    }
    // 后备：使用引擎内联配置
    if (fallbackConfig) {
      return fallbackConfig;
    }
    return null;
  }

  /* ================================================================
   * 公开查询接口
   * ================================================================ */

  /**
   * 检查是否达到抬轮速度（Vr）
   * @param {Object} aircraft - 飞机状态
   * @returns {boolean}
   */
  canTakeoff(aircraft) {
    const config = this._getConfig(aircraft);
    if (!config) return false;
    return aircraft.speed >= config.maxSpeed * this.vrRatio;
  }

  /**
   * 检查是否在地面
   * @param {Object} aircraft - 飞机状态
   * @returns {boolean}
   */
  isOnGround(aircraft) {
    return aircraft.altitude <= 1;
  }

  /**
   * 获取当前油门值（0~1）
   * @returns {number}
   */
  getThrottle() {
    return this._throttle;
  }

  /**
   * 获取当前垂直速度 (m/s，正=上升)
   * @returns {number}
   */
  getVerticalSpeed() {
    return this._verticalSpeed;
  }
}

/* ================================================================
 * 自动集成：hook 到 GameEngine，无需修改 game.js
 * ================================================================ */

(function () {
  /**
   * 注入物理系统到引擎
   * @param {GameEngine} engine
   */
  function _injectPhysics(engine) {
    if (engine._physicsSystem) return;

    const physics = new PhysicsSystem();
    engine._physicsSystem = physics;

    // 保存原始 updateGameplay
    const origUpdate = engine.updateGameplay.bind(engine);

    /**
     * 替换 updateGameplay：
     * - 保留姿态旋转（来自原始代码）
     * - 用 PhysicsSystem 处理速度、高度、位置
     */
    engine.updateGameplay = function (dt) {
      if (!this._aircraftState) return;

      const state = this._aircraftState;
      const cfg = this._aircraftConfig;
      const input = this.input.getFlightInput();

      // ---- 姿态更新（保留原始旋转逻辑）----
      const sensitivity = cfg.turnRate * dt;
      state.rotation.pitch += input.pitch * sensitivity;
      state.rotation.roll += input.roll * sensitivity;
      state.rotation.yaw += input.yaw * sensitivity;

      // 限制俯仰角 [-80, 80] 度 -> 弧度
      const maxPitch = 80 * Math.PI / 180;
      state.rotation.pitch = Math.max(-maxPitch, Math.min(maxPitch, state.rotation.pitch));

      // 滚转角 [-180, 180] 弧度
      state.rotation.roll = Math.max(-Math.PI, Math.min(Math.PI, state.rotation.roll));

      // 偏航角环绕
      if (state.rotation.yaw > Math.PI) state.rotation.yaw -= Math.PI * 2;
      if (state.rotation.yaw < -Math.PI) state.rotation.yaw += Math.PI * 2;

      // ---- 物理系统：处理速度、高度、位置 ----
      // 传递引擎内联配置作为后备（当 window.AIRCRAFT_CONFIGS 不可用时）
      this._physicsSystem.update(state, this.input, dt, cfg);
    };

    console.log('[物理] PhysicsSystem 已集成到引擎');
  }

  /**
   * 等待引擎就绪后注入
   */
  function _waitForEngine() {
    const engine = window._engine;
    if (engine && engine.input) {
      _injectPhysics(engine);
    } else {
      requestAnimationFrame(_waitForEngine);
    }
  }

  // DOMContentLoaded 时开始等待引擎
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(_waitForEngine);
    });
  } else {
    requestAnimationFrame(_waitForEngine);
  }
})();
