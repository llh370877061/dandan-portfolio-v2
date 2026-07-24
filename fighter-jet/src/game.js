/**
 * 核心游戏引擎
 * 负责：WebGL 初始化、游戏主循环、场景管理、输入处理整合
 *
 * index.html 只加载此文件，此文件动态加载 src/input.js 和 src/renderer.js
 */

/* ================================================================
 * 场景管理器
 * ================================================================ */

class SceneManager {
  constructor() {
    /** @type {Map<string, Scene>} */
    this._scenes = new Map();
    /** @type {Scene|null} */
    this._current = null;
    /** @type {string} */
    this._currentName = '';
    /** @type {string|null} 调度中的下一场 */
    this._pending = null;
  }

  /**
   * 注册场景
   * @param {string} name
   * @param {Scene} scene
   */
  register(name, scene) {
    scene.sceneManager = this;
    this._scenes.set(name, scene);
  }

  /**
   * 切换到指定场景（延迟到帧末执行，避免 update 中途切换）
   * @param {string} name
   * @param {*} [data] 传递给目标场景的数据
   */
  switchTo(name, data) {
    this._pending = name;
    this._pendingData = data;
  }

  /**
   * 立即执行挂起的场景切换（由主循环在帧开始时调用）
   */
  flushSwitch() {
    if (!this._pending) return;

    const nextName = this._pending;
    const data = this._pendingData;
    this._pending = null;
    this._pendingData = undefined;

    const next = this._scenes.get(nextName);
    if (!next) {
      console.error('SceneManager: 未知场景 "' + nextName + '"');
      return;
    }

    if (this._current) {
      this._current.exit();
    }

    this._current = next;
    this._currentName = nextName;
    this._current.enter(data);
  }

  /**
   * @returns {string} 当前场景名
   */
  getCurrentName() {
    return this._currentName;
  }

  /**
   * @returns {Scene|null}
   */
  getCurrent() {
    return this._current;
  }
}

/**
 * 场景基类 — 子类需覆写 enter / update / render / exit
 */
class Scene {
  constructor() {
    /** @type {SceneManager} */
    this.sceneManager = null;
  }
  enter() {}
  update() {}
  render() {}
  exit() {}
}

/* ================================================================
 * 预定义场景
 * ================================================================ */

/** 加载场景（占位） */
class LoadingScene extends Scene {
  enter() {
    console.log('[场景] 加载中...');
    // index.html 中 #loading 默认显示，飞机选择页面默认隐藏
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('aircraft-select').style.display = 'none';
  }
  render() {}
  exit() {
    document.getElementById('loading').style.display = 'none';
  }
}

/** 飞机选择场景 */
class AircraftSelectScene extends Scene {
  enter() {
    console.log('[场景] 飞机选择');
    const panel = document.getElementById('aircraft-select');
    panel.style.display = 'block';

    this._handler = (e) => {
      const aircraftType = e.target.dataset.aircraft;
      if (!aircraftType) return;
      console.log('[场景] 选择飞机:', aircraftType);
      this.sceneManager.switchTo('game', { aircraft: aircraftType });
    };
    panel.addEventListener('click', this._handler);
  }
  exit() {
    const panel = document.getElementById('aircraft-select');
    panel.style.display = 'none';
    if (this._handler) {
      panel.removeEventListener('click', this._handler);
      this._handler = null;
    }
  }
}

/** 主游戏场景 */
class GameplayScene extends Scene {
  enter(data) {
    console.log('[场景] 进入游戏, 飞机:', data && data.aircraft);
    const engine = window._engine;
    if (engine) {
      engine.startGameplay(data);
    }
  }
  update(dt) {
    const engine = window._engine;
    if (engine) engine.updateGameplay(dt);
  }
  render() {
    const engine = window._engine;
    if (engine) engine.renderGameplay();
  }
  exit() {
    console.log('[场景] 退出游戏');
  }
}

/* ================================================================
 * 核心引擎
 * ================================================================ */

class GameEngine {
  constructor() {
    this.canvas = null;
    /** @type {WebGLRenderer} */
    this.renderer = null;
    /** @type {InputSystem} */
    this.input = null;
    /** @type {SceneManager} */
    this.scenes = new SceneManager();

    this.running = false;
    this.lastTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsTime = 0;

    // 游戏状态
    this._aircraftConfig = null;
    this._aircraftState = null;
  }

  /**
   * 初始化引擎：加载子模块、创建渲染器和输入系统、注册场景
   * @returns {Promise<boolean>}
   */
  async init() {
    // 动态加载子模块
    const loaded = await this._loadScripts(['src/input.js', 'src/renderer.js', 'src/terrain.js', 'src/physics.js']);
    if (!loaded) {
      console.error('子模块加载失败');
      return false;
    }

    // Canvas
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) {
      console.error('找不到 #game-canvas');
      return false;
    }

    // WebGL 渲染器
    this.renderer = new WebGLRenderer(this.canvas);
    if (!this.renderer.init()) {
      return false;
    }

    // 窗口 resize
    window.addEventListener('resize', () => this.renderer.resize());

    // 输入系统
    this.input = new InputSystem();
    this.input.init();

    // 注册场景
    this.scenes.register('loading', new LoadingScene());
    this.scenes.register('aircraft_select', new AircraftSelectScene());
    this.scenes.register('game', new GameplayScene());

    // 监听 WebGL 上下文丢失
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('WebGL 上下文丢失');
      this.running = false;
    });

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL 上下文恢复');
      this.renderer.init();
    });

    console.log('GameEngine: 初始化完成');
    return true;
  }

  /**
   * 启动主循环并切换到飞机选择场景
   */
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.scenes.switchTo('aircraft_select');
    console.log('游戏主循环启动');
    this._loop();
  }

  /**
   * 停止主循环
   */
  stop() {
    this.running = false;
  }

  // ---- 游戏场景逻辑 ----

  /**
   * GameplayScene.enter 调用：初始化飞机状态
   */
  startGameplay(data) {
    const type = (data && data.aircraft) || 'j20';

    // 飞机配置（内联，避免额外依赖）
    const AIRCRAFT_CONFIGS = {
      j20:   { name: '歼-20',   maxSpeed: 3000, acceleration: 150, turnRate: 2.5, health: 100, missiles: 8 },
      j35:   { name: '歼-35',   maxSpeed: 2800, acceleration: 140, turnRate: 2.8, health: 100, missiles: 6 },
      j16:   { name: '歼-16',   maxSpeed: 2200, acceleration: 120, turnRate: 2.2, health: 120, missiles: 10 },
      j10:   { name: '歼-10',   maxSpeed: 2000, acceleration: 130, turnRate: 3.0, health: 80,  missiles: 6 },
      mig25: { name: '米格-25', maxSpeed: 3000, acceleration: 100, turnRate: 1.8, health: 110, missiles: 4 },
      mig27: { name: '米格-27', maxSpeed: 1800, acceleration: 110, turnRate: 2.4, health: 100, missiles: 6 },
      y20:   { name: '运-20',   maxSpeed: 800,  acceleration: 60,  turnRate: 1.2, health: 200, missiles: 0 },
      bomber:{ name: '轰炸机', maxSpeed: 1200, acceleration: 80,  turnRate: 1.5, health: 150, missiles: 12 },
    };

    const cfg = AIRCRAFT_CONFIGS[type] || AIRCRAFT_CONFIGS.j20;
    this._aircraftConfig = cfg;
    this._aircraftState = {
      type,
      speed: 0,
      altitude: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { pitch: 0, yaw: 0, roll: 0 },
      health: cfg.health,
      missilesLeft: cfg.missiles,
    };

    console.log('已加载飞机:', cfg.name);
  }

  /**
   * GameplayScene.update 调用：物理 + 输入响应
   */
  updateGameplay(dt) {
    if (!this._aircraftState) return;

    const state = this._aircraftState;
    const cfg = this._aircraftConfig;
    const input = this.input.getFlightInput();

    const sensitivity = cfg.turnRate * dt;

    // 姿态更新
    state.rotation.pitch += input.pitch * sensitivity;
    state.rotation.roll  += input.roll  * sensitivity;
    state.rotation.yaw   += input.yaw   * sensitivity;

    // 限制俯仰角 [-80, 80] 度 -> 弧度
    const maxPitch = 80 * Math.PI / 180;
    state.rotation.pitch = Math.max(-maxPitch, Math.min(maxPitch, state.rotation.pitch));

    // 滚转角 [-180, 180] 弧度
    state.rotation.roll = Math.max(-Math.PI, Math.min(Math.PI, state.rotation.roll));

    // 偏航角环绕
    if (state.rotation.yaw > Math.PI)  state.rotation.yaw -= Math.PI * 2;
    if (state.rotation.yaw < -Math.PI) state.rotation.yaw += Math.PI * 2;

    // 速度控制：上/下方向键加速/减速
    if (this.input.isKeyDown('ArrowUp')) {
      state.speed += cfg.acceleration * dt;
    }
    if (this.input.isKeyDown('ArrowDown')) {
      state.speed -= cfg.acceleration * dt;
    }
    state.speed = Math.max(0, Math.min(cfg.maxSpeed, state.speed));

    // 位置更新（基于朝向的简单前向移动）
    const cosPitch = Math.cos(state.rotation.pitch);
    const sinYaw   = Math.sin(state.rotation.yaw);
    const cosYaw   = Math.cos(state.rotation.yaw);

    state.position.x += sinYaw * cosPitch * state.speed * dt * 0.01;
    state.position.y += Math.sin(state.rotation.pitch) * state.speed * dt * 0.01;
    state.position.z += cosYaw * cosPitch * state.speed * dt * 0.01;

    // 最低高度
    if (state.position.y < 0) {
      state.position.y = 0;
      state.speed = Math.max(state.speed, 100);
    }
  }

  /**
   * GameplayScene.render 调用：WebGL 场景渲染
   */
  renderGameplay() {
    const r = this.renderer;
    if (!r) return;

    r.clear();
    r.useProgram();

    if (!this._aircraftState) return;

    // 简易透视矩阵
    const proj = this._makePerspective(60 * Math.PI / 180, r.getAspect(), 0.1, 10000);
    const uProj = r.getUniform('uProjectionMatrix');
    if (uProj) {
      r.getContext().uniformMatrix4fv(uProj, false, proj);
    }

    // 模型视图矩阵 = 相机反向旋转
    const st = this._aircraftState;
    const mv = this._makeIdentity();
    // 偏航
    this._rotateY(mv, -st.rotation.yaw);
    // 俯仰
    this._rotateX(mv, -st.rotation.pitch);
    // 滚转
    this._rotateZ(mv, -st.rotation.roll);
    // 平移（摄像机跟随）
    this._translate(mv, -st.position.x * 0.01, -st.position.y * 0.01, -st.position.z * 0.01);

    const uMV = r.getUniform('uModelViewMatrix');
    if (uMV) {
      r.getContext().uniformMatrix4fv(uMV, false, mv);
    }

    // 绘制一个简单的参考网格（地面平面）
    this._renderGrid(r);

    // 渲染云
    this._renderClouds(r);
  }

  // ---- 主循环 ----

  _loop() {
    if (!this.running) return;

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.05); // 上限 50ms 防跳帧
    this.lastTime = now;

    // FPS 计算
    this.frameCount++;
    this.fpsTime += deltaTime;
    if (this.fpsTime >= 1) {
      this.fps = Math.round(this.frameCount / this.fpsTime);
      this.frameCount = 0;
      this.fpsTime = 0;
    }

    // 处理挂起的场景切换
    this.scenes.flushSwitch();

    // 更新当前场景
    const scene = this.scenes.getCurrent();
    if (scene) {
      scene.update(deltaTime);
    }

    // 渲染当前场景
    if (scene) {
      scene.render();
    }

    requestAnimationFrame(() => this._loop());
  }

  // ---- 工具方法 ----

  /**
   * 动态加载脚本文件
   * @param {string[]} paths
   * @returns {Promise<boolean>}
   */
  _loadScripts(paths) {
    return new Promise((resolve) => {
      let loaded = 0;
      let failed = false;
      const total = paths.length;

      if (total === 0) {
        resolve(true);
        return;
      }

      const onLoad = () => {
        loaded++;
        if (loaded === total && !failed) resolve(true);
      };

      const onError = (path) => {
        failed = true;
        console.error('脚本加载失败:', path);
        resolve(false);
      };

      for (const path of paths) {
        const script = document.createElement('script');
        script.src = path;
        script.onload = onLoad;
        script.onerror = () => onError(path);
        document.head.appendChild(script);
      }
    });
  }

  /** 创建 4x4 单位矩阵 */
  _makeIdentity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  /** 创建透视投影矩阵 */
  _makePerspective(fovY, aspect, near, far) {
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0,
    ]);
  }

  /** 对 4x4 矩阵执行绕 Y 轴旋转（原地修改） */
  _rotateY(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    m[0]  = a00 * c + a20 * s;
    m[1]  = a01 * c + a21 * s;
    m[2]  = a02 * c + a22 * s;
    m[3]  = a03 * c + a23 * s;
    m[8]  = a20 * c - a00 * s;
    m[9]  = a21 * c - a01 * s;
    m[10] = a22 * c - a02 * s;
    m[11] = a23 * c - a03 * s;
  }

  /** 对 4x4 矩阵执行绕 X 轴旋转（原地修改） */
  _rotateX(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    m[4]  = a10 * c + a20 * s;
    m[5]  = a11 * c + a21 * s;
    m[6]  = a12 * c + a22 * s;
    m[7]  = a13 * c + a23 * s;
    m[8]  = a20 * c - a10 * s;
    m[9]  = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s;
    m[11] = a23 * c - a13 * s;
  }

  /** 对 4x4 矩阵执行绕 Z 轴旋转（原地修改） */
  _rotateZ(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    m[0] = a00 * c + a10 * s;
    m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s;
    m[3] = a03 * c + a13 * s;
    m[4] = a10 * c - a00 * s;
    m[5] = a11 * c - a01 * s;
    m[6] = a12 * c - a02 * s;
    m[7] = a13 * c - a03 * s;
  }

  /** 对 4x4 矩阵执行平移（原地修改） */
  _translate(m, x, y, z) {
    m[12] += m[0] * x + m[4] * y + m[8]  * z;
    m[13] += m[1] * x + m[5] * y + m[9]  * z;
    m[14] += m[2] * x + m[6] * y + m[10] * z;
    m[15] += m[3] * x + m[7] * y + m[11] * z;
  }

  /**
   * 渲染一个简单的地面参考网格
   * @param {WebGLRenderer} r
   */
  _renderGrid(r) {
    const gl = r.getContext();
    const aPos = r.getAttribute('aPosition');
    const aCol = r.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) return;

    // 生成网格线数据（每条线两个顶点）
    const gridSize = 50;
    const gridStep = 2;
    const vertices = [];
    const colors = [];

    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      // X 方向线
      vertices.push(i, 0, -gridSize, i, 0, gridSize);
      // Z 方向线
      vertices.push(-gridSize, 0, i, gridSize, 0, i);

      // 颜色：深灰网格线
      const brightness = 0.25 + (Math.abs(i) % (gridStep * 2) === 0 ? 0.1 : 0);
      colors.push(0, brightness, 0, 0, brightness, 0);
    }

    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const cBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, vertices.length / 3);

    // 清理顶点属性状态
    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
    gl.deleteBuffer(vBuf);
    gl.deleteBuffer(cBuf);
  }

  /**
   * 渲染云朵
   * @param {WebGLRenderer} r
   */
  _renderClouds(r) {
    const gl = r.getContext();
    const aPos = r.getAttribute('aPosition');
    const aCol = r.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) return;

    const st = this._aircraftState;
    const camX = st.position.x * 0.01;
    const camZ = st.position.z * 0.01;

    // 云朵数据：位置(x,z) + 大小
    const clouds = [
      { x: 100, z: 50, size: 8 },
      { x: -80, z: 120, size: 6 },
      { x: 200, z: -100, size: 10 },
      { x: -150, z: -80, size: 7 },
      { x: 50, z: 200, size: 9 },
      { x: -200, z: 150, size: 5 },
      { x: 180, z: 180, size: 11 },
      { x: -120, z: -150, size: 8 },
    ];

    const vertices = [];
    const colors = [];

    for (const cloud of clouds) {
      const cx = cloud.x;
      const cz = cloud.z;
      const cy = 15 + Math.sin(cx * 0.1) * 2; // 云朵高度15-17
      const s = cloud.size;

      // 每朵云由多个重叠的矩形组成
      // 主体
      vertices.push(cx - s, cy, cz - s * 0.3);
      vertices.push(cx + s, cy, cz - s * 0.3);
      vertices.push(cx + s, cy, cz + s * 0.3);
      vertices.push(cx - s, cy, cz - s * 0.3);
      vertices.push(cx + s, cy, cz + s * 0.3);
      vertices.push(cx - s, cy, cz + s * 0.3);

      // 左侧膨胀
      vertices.push(cx - s * 1.3, cy - 0.5, cz - s * 0.2);
      vertices.push(cx - s * 0.5, cy - 0.5, cz - s * 0.2);
      vertices.push(cx - s * 0.5, cy - 0.5, cz + s * 0.2);
      vertices.push(cx - s * 1.3, cy - 0.5, cz - s * 0.2);
      vertices.push(cx - s * 0.5, cy - 0.5, cz + s * 0.2);
      vertices.push(cx - s * 1.3, cy - 0.5, cz + s * 0.2);

      // 右侧膨胀
      vertices.push(cx + s * 0.5, cy - 0.3, cz - s * 0.25);
      vertices.push(cx + s * 1.2, cy - 0.3, cz - s * 0.25);
      vertices.push(cx + s * 1.2, cy - 0.3, cz + s * 0.25);
      vertices.push(cx + s * 0.5, cy - 0.3, cz - s * 0.25);
      vertices.push(cx + s * 1.2, cy - 0.3, cz + s * 0.25);
      vertices.push(cx + s * 0.5, cy - 0.3, cz + s * 0.25);

      // 颜色：白色带一点透明感
      for (let i = 0; i < 18; i++) {
        colors.push(0.95, 0.95, 0.97);
      }
    }

    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const cBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
    gl.deleteBuffer(vBuf);
    gl.deleteBuffer(cBuf);
  }
}

/* ================================================================
 * 启动
 * ================================================================ */

const game = new GameEngine();
window._engine = game;

window.addEventListener('load', async () => {
  const ok = await game.init();
  if (ok) {
    document.getElementById('loading').style.display = 'none';
    game.start();
  } else {
    document.getElementById('loading').innerHTML =
      '<span style="color:#f00">初始化失败，请使用支持 WebGL 的浏览器</span>';
  }
});
