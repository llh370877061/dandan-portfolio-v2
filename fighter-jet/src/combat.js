/**
 * 战斗系统
 * 负责：敌机生成（AI 控制）、导弹发射（追踪弹道）、击中判定（碰撞检测+爆炸效果）、
 *       敌方基地（可攻击建筑群）、胜利条件（摧毁所有基地建筑）
 *
 * 集成方式：自动 hook 到 GameEngine，无需修改 game.js
 */

class CombatSystem {
  constructor() {
    /** 敌方基地位置（世界坐标） */
    this.basePosition = { x: 4000, y: 0, z: 4000 };
    /** 基地建筑群 */
    this.buildings = [];
    /** 玩家导弹列表 */
    this.playerMissiles = [];
    /** 敌方导弹列表 */
    this.enemyMissiles = [];
    /** 敌机管理器 */
    this.enemyManager = null;
    /** 爆炸管理器 */
    this.explosionManager = null;
    /** 导弹冷却时间（秒） */
    this.missileCooldown = 0;
    this.missileCooldownMax = 0.5;
    /** 导弹追踪加速度 */
    this.missileAcceleration = 2000;
    this.missileMaxSpeed = 1800;
    /** 游戏结束状态 */
    this.victory = false;
    this.victoryShown = false;
    /**2D 覆盖层 Canvas */
    this._overlay = null;
    this._overlayCtx = null;
    this._overlayW = 0;
    this._overlayH = 0;
  }

  /**
   * 初始化战斗系统：创建基地建筑群、敌机管理器、爆炸管理器、2D 覆盖层
   */
  init() {
    this._createBuildings();
    this.enemyManager = new EnemyManager();
    this.explosionManager = new ExplosionManager();
    this._createOverlay();
    console.log(
      '[战斗] 初始化完成 — 建筑:', this.buildings.length,
      '| 基地位置:', this.basePosition.x, this.basePosition.z
    );
  }

  /**
   * 创建敌方基地建筑群（6 栋建筑）
   */
  _createBuildings() {
    this.buildings = [];
    const bx = this.basePosition.x;
    const bz = this.basePosition.z;

    const defs = [
      { name: '指挥中心',  ox: 0,   oz: 0,   w: 25, h: 40, d: 25, hp: 200, color: [0.7, 0.2, 0.2] },
      { name: '雷达站',    ox: 120, oz: -60,  w: 14, h: 55, d: 14, hp: 100, color: [0.6, 0.6, 0.6] },
      { name: '机库 A',    ox: -150,oz: 100,  w: 40, h: 18, d: 30, hp: 150, color: [0.45, 0.45, 0.5] },
      { name: '机库 B',    ox: 150, oz: 100,  w: 40, h: 18, d: 30, hp: 150, color: [0.45, 0.45, 0.5] },
      { name: '弹药库',    ox: -80, oz: -130, w: 18, h: 12, d: 18, hp: 80,  color: [0.6, 0.5, 0.3] },
      { name: '营房',      ox: 80,  oz: -130, w: 30, h: 15, d: 20, hp: 120, color: [0.4, 0.5, 0.4] },
    ];

    for (const d of defs) {
      this.buildings.push({
        name: d.name,
        position: { x: bx + d.ox, y: 0, z: bz + d.oz },
        size: { x: d.w, y: d.h, z: d.d },
        health: d.hp,
        maxHealth: d.hp,
        alive: true,
        color: d.color,
      });
    }
  }

  /**
   * 创建2D 覆盖层 Canvas（用于渲染爆炸效果和导弹尾迹）
   */
  _createOverlay() {
    this._overlay = document.createElement('canvas');
    this._overlay.id = 'combat-overlay';
    this._overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8;';
    this._overlayW = window.innerWidth;
    this._overlayH = window.innerHeight;
    this._overlay.width = this._overlayW;
    this._overlay.height = this._overlayH;
    document.body.appendChild(this._overlay);
    this._overlayCtx = this._overlay.getContext('2d');

    window.addEventListener('resize', () => {
      this._overlayW = window.innerWidth;
      this._overlayH = window.innerHeight;
      this._overlay.width = this._overlayW;
      this._overlay.height = this._overlayH;
    });
  }

  // ================================================================
  // 玩家导弹
  // ================================================================

  /**
   * 发射玩家导弹
   * @param {{x,y,z}} playerPos - 玩家位置（世界坐标）
   * @param {{x,y,z}} playerDir - 玩家朝向单位向量
   * @returns {boolean} 是否成功发射
   */
  fireMissile(playerPos, playerDir) {
    if (this.victory) return false;
    if (this.missileCooldown > 0) return false;

    const aliveEnemies = this.enemyManager.getAliveEnemies();
    if (aliveEnemies.length === 0) return false;

    // 找最近敌机
    let nearest = null;
    let nearestDist = Infinity;
    for (const e of aliveEnemies) {
      const dx = e.position.x - playerPos.x;
      const dy = e.position.y - playerPos.y;
      const dz = e.position.z - playerPos.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = e;
      }
    }
    if (!nearest || nearestDist > 4000) return false;

    this.playerMissiles.push({
      position: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
      target: nearest,
      velocity: {
        x: (playerDir && playerDir.x) || 0,
        y: (playerDir && playerDir.y) || 0,
        z: (playerDir && playerDir.z) || 0,
      },
      life: 6,
      speed: this.missileMaxSpeed * 0.6,
      damage: 50,
    });

    this.missileCooldown = this.missileCooldownMax;
    return true;
  }

  // ================================================================
  // 每帧更新
  // ================================================================

  /**
   * 更新战斗系统
   * @param {number} dt - 帧间隔（秒）
   * @param {{x,y,z}} playerPosition - 玩家位置（世界坐标）
   * @param {{x,y,z,yaw,pitch,roll}} playerRotation - 玩家姿态
   * @param {number} playerHealth - 玩家生命值
   * @returns {number} 剩余玩家生命值
   */
  update(dt, playerPosition, playerRotation, playerHealth) {
    if (this.victory) return playerHealth;

    // 冷却
    if (this.missileCooldown > 0) {
      this.missileCooldown -= dt;
    }

    // 生成敌机
    this.enemyManager.update(dt, playerPosition, this.basePosition);

    // 更新玩家导弹
    this._updatePlayerMissiles(dt);
    // 更新敌方导弹
    this._updateEnemyMissiles(dt, playerPosition);
    // 更新敌机 AI 并处理敌机攻击
    this._updateEnemies(dt, playerPosition);
    // 碰撞检测
    playerHealth = this._checkCollisions(playerHealth);
    // 爆炸效果
    this.explosionManager.update(dt);
    // 胜利条件
    this._checkVictory();

    return playerHealth;
  }

  _updatePlayerMissiles(dt) {
    for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
      const m = this.playerMissiles[i];
      m.life -= dt;
      if (m.life <= 0) {
        this.playerMissiles.splice(i, 1);
        continue;
      }

      // 追踪目标
      if (m.target && m.target.alive) {
        const dx = m.target.position.x - m.position.x;
        const dy = m.target.position.y - m.position.y;
        const dz = m.target.position.z - m.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 1) {
          m.velocity.x += (dx / dist) * this.missileAcceleration * dt;
          m.velocity.y += (dy / dist) * this.missileAcceleration * dt;
          m.velocity.z += (dz / dist) * this.missileAcceleration * dt;
        }
      }

      // 速度限制
      const spd = Math.sqrt(
        m.velocity.x * m.velocity.x +
        m.velocity.y * m.velocity.y +
        m.velocity.z * m.velocity.z
      );
      if (spd > this.missileMaxSpeed) {
        const s = this.missileMaxSpeed / spd;
        m.velocity.x *= s;
        m.velocity.y *= s;
        m.velocity.z *= s;
      }
      m.speed = Math.min(this.missileMaxSpeed, Math.max(m.speed, spd));

      m.position.x += m.velocity.x * dt;
      m.position.y += m.velocity.y * dt;
      m.position.z += m.velocity.z * dt;
    }
  }

  _updateEnemyMissiles(dt, playerPos) {
    for (let i = this.enemyMissiles.length - 1; i >= 0; i--) {
      const m = this.enemyMissiles[i];
      m.life -= dt;
      if (m.life <= 0) {
        this.enemyMissiles.splice(i, 1);
        continue;
      }

      // 追踪玩家
      const dx = playerPos.x - m.position.x;
      const dy = (playerPos.y || 500) - m.position.y;
      const dz = playerPos.z - m.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 1) {
        m.velocity.x += (dx / dist) * this.missileAcceleration * dt;
        m.velocity.y += (dy / dist) * this.missileAcceleration * dt;
        m.velocity.z += (dz / dist) * this.missileAcceleration * dt;
      }

      const spd = Math.sqrt(
        m.velocity.x * m.velocity.x +
        m.velocity.y * m.velocity.y +
        m.velocity.z * m.velocity.z
      );
      if (spd > this.missileMaxSpeed) {
        const s = this.missileMaxSpeed / spd;
        m.velocity.x *= s;
        m.velocity.y *= s;
        m.velocity.z *= s;
      }

      m.position.x += m.velocity.x * dt;
      m.position.y += m.velocity.y * dt;
      m.position.z += m.velocity.z * dt;
    }
  }

  _updateEnemies(dt, playerPosition) {
    for (const enemy of this.enemyManager.enemies) {
      if (!enemy.alive) continue;

      // 敌机攻击玩家
      if (enemy.canFire()) {
        const dx = playerPosition.x - enemy.position.x;
        const dy = (playerPosition.y || 500) - enemy.position.y;
        const dz = playerPosition.z - enemy.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < enemy.attackRange && dist > 1) {
          this.enemyMissiles.push({
            position: { ...enemy.position },
            velocity: {
              x: (dx / dist) * this.missileMaxSpeed * 0.4,
              y: (dy / dist) * this.missileMaxSpeed * 0.4,
              z: (dz / dist) * this.missileMaxSpeed * 0.4,
            },
            life: 5,
            damage: 10,
          });
          enemy.didFire();
        }
      }
    }
  }

  // ================================================================
  // 碰撞检测
  // ================================================================

  _checkCollisions(playerHealth) {
    // 玩家导弹 vs 敌机
    this._checkPlayerMissileVsEnemies();

    // 敌机 vs 玩家（直接碰撞）
    this._checkEnemyCollisionWithPlayer(playerHealth);

    // 玩家导弹 vs 基地建筑
    this._checkPlayerMissileVsBuildings();

    // 敌方导弹 vs 基地建筑
    this._checkEnemyMissileVsBuildings();

    // 敌方导弹 vs 玩家
    return this._checkEnemyMissileVsPlayer(playerHealth);
  }

  _checkPlayerMissileVsEnemies() {
    const hitRadius = 15;
    for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
      const m = this.playerMissiles[i];
      const aliveEnemies = this.enemyManager.getAliveEnemies();

      for (const enemy of aliveEnemies) {
        const dx = m.position.x - enemy.position.x;
        const dy = m.position.y - enemy.position.y;
        const dz = m.position.z - enemy.position.z;
        if (dx * dx + dy * dy + dz * dz < hitRadius * hitRadius) {
          const killed = enemy.takeDamage(m.damage);
          this.explosionManager.create(m.position, killed ? 25 : 12);
          this.playerMissiles.splice(i, 1);
          break;
        }
      }
    }
  }

  _checkEnemyCollisionWithPlayer(playerHealth) {
    const hitRadius = 20;
    let hp = playerHealth;
    for (const enemy of this.enemyManager.enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.position.x - this._lastPlayerPos.x;
      const dy = enemy.position.y - this._lastPlayerPos.y;
      const dz = enemy.position.z - this._lastPlayerPos.z;
      if (dx * dx + dy * dy + dz * dz < hitRadius * hitRadius) {
        enemy.takeDamage(100);
        this.explosionManager.create(enemy.position, 20);
        hp -= 20;
      }
    }
    return hp;
  }

  _checkPlayerMissileVsBuildings() {
    const hitRadius = 18;
    for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
      const m = this.playerMissiles[i];
      for (const b of this.buildings) {
        if (!b.alive) continue;
        const dx = m.position.x - b.position.x;
        const dy = m.position.y - (b.position.y + b.size.y / 2);
        const dz = m.position.z - b.position.z;
        const halfSize = Math.max(b.size.x, b.size.z) / 2;
        if (dx * dx + dy * dy + dz * dz < (hitRadius + halfSize) * (hitRadius + halfSize)) {
          b.health -= m.damage;
          if (b.health <= 0) {
            b.health = 0;
            b.alive = false;
            this.explosionManager.create(b.position, 35);
          } else {
            this.explosionManager.create(m.position, 15);
          }
          this.playerMissiles.splice(i, 1);
          break;
        }
      }
    }
  }

  _checkEnemyMissileVsBuildings() {
    const hitRadius = 15;
    for (let i = this.enemyMissiles.length - 1; i >= 0; i--) {
      const m = this.enemyMissiles[i];
      for (const b of this.buildings) {
        if (!b.alive) continue;
        const dx = m.position.x - b.position.x;
        const dy = m.position.y - (b.position.y + b.size.y / 2);
        const dz = m.position.z - b.position.z;
        const halfSize = Math.max(b.size.x, b.size.z) / 2;
        if (dx * dx + dy * dy + dz * dz < (hitRadius + halfSize) * (hitRadius + halfSize)) {
          b.health -= m.damage;
          if (b.health <= 0) {
            b.health = 0;
            b.alive = false;
            this.explosionManager.create(b.position, 35);
          } else {
            this.explosionManager.create(m.position, 10);
          }
          this.enemyMissiles.splice(i, 1);
          break;
        }
      }
    }
  }

  _checkEnemyMissileVsPlayer(playerHealth) {
    const hitRadius = 18;
    let hp = playerHealth;
    for (let i = this.enemyMissiles.length - 1; i >= 0; i--) {
      const m = this.enemyMissiles[i];
      const dx = m.position.x - this._lastPlayerPos.x;
      const dy = m.position.y - this._lastPlayerPos.y;
      const dz = m.position.z - this._lastPlayerPos.z;
      if (dx * dx + dy * dy + dz * dz < hitRadius * hitRadius) {
        hp -= m.damage;
        this.explosionManager.create(m.position, 10);
        this.enemyMissiles.splice(i, 1);
      }
    }
    return hp;
  }

  // ================================================================
  // 胜利条件
  // ================================================================

  _checkVictory() {
    if (this.victory) return;
    const allDestroyed = this.buildings.every(b => !b.alive);
    if (allDestroyed) {
      this.victory = true;
      this._showVictoryScreen();
    }
  }

  checkVictory() {
    return this.victory;
  }

  _showVictoryScreen() {
    if (this.victoryShown) return;
    this.victoryShown = true;

    const overlay = document.createElement('div');
    overlay.id = 'victory-screen';
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'display:flex;flex-direction:column;justify-content:center;align-items:center;' +
      'background:rgba(0,0,0,0.85);z-index:200;color:#0f0;font-family:Courier New,monospace;';

    overlay.innerHTML =
      '<div style="font-size:64px;font-weight:bold;margin-bottom:20px;' +
      'text-shadow:0 0 20px #0f0,0 0 40px #0f0;">VICTORY</div>' +
      '<div style="font-size:24px;margin-bottom:30px;color:#0f0;">' +
      'All enemy base structures destroyed</div>' +
      '<div style="font-size:18px;color:#0a0;opacity:0.7;">' +
      'Mission Complete</div>';

    document.body.appendChild(overlay);
  }

  // ================================================================
  // 渲染 — WebGL（3D 物体：建筑、玩家导弹）
  // ================================================================

  /**
   * 使用 WebGL 渲染基地建筑和玩家导弹（在3D 透视下）
   * @param {WebGLRenderer} renderer
   * @param {{x,y,z,yaw,pitch,roll}} camera
   */
  render(renderer, camera) {
    if (!renderer) return;
    const gl = renderer.getContext();
    if (!gl) return;

    this._renderBuildings3D(gl, renderer, camera);
    this._renderPlayerMissiles3D(gl, renderer, camera);
  }

  _renderBuildings3D(gl, renderer, camera) {
    const aPos = renderer.getAttribute('aPosition');
    const aCol = renderer.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) return;

    const camX = camera.x * 0.01;
    const camZ = camera.z * 0.01;
    const vd = 1800 * 0.01;

    for (const b of this.buildings) {
      if (!b.alive) continue;

      const bx = b.position.x * 0.01;
      const bz = b.position.z * 0.01;
      const dx = bx - camX;
      const dz = bz - camZ;
      if (dx * dx + dz * dz > vd * vd) continue;

      const hw = b.size.x * 0.01 / 2;
      const hh = b.size.y * 0.01 / 2;
      const hd = b.size.z * 0.01 / 2;
      const by = hh;

      // 颜色：受伤变暗
      const hpRatio = b.health / b.maxHealth;
      const r = b.color[0] * (0.5 + 0.5 * hpRatio);
      const g = b.color[1] * (0.5 + 0.5 * hpRatio);
      const bl = b.color[2] * (0.5 + 0.5 * hpRatio);

      // 6 面 × 2 三角形 × 3 顶点
      const positions = new Float32Array([
        // 前 (z+)
        -hw, by - hh, hd,  hw, by - hh, hd,  hw, by + hh, hd,
        -hw, by - hh, hd,  hw, by + hh, hd, -hw, by + hh, hd,
        // 后 (z-)
        hw, by - hh, -hd, -hw, by - hh, -hd, -hw, by + hh, -hd,
        hw, by - hh, -hd, -hw, by + hh, -hd,  hw, by + hh, -hd,
        // 上 (y+)
        -hw, by + hh, -hd,  hw, by + hh, -hd,  hw, by + hh, hd,
        -hw, by + hh, -hd,  hw, by + hh, hd, -hw, by + hh, hd,
        // 下 (y-)
        -hw, by - hh, hd,  hw, by - hh, hd,  hw, by - hh, -hd,
        -hw, by - hh, hd,  hw, by - hh, -hd, -hw, by - hh, -hd,
        // 右 (x+)
        hw, by - hh, hd,  hw, by - hh, -hd,  hw, by + hh, -hd,
        hw, by - hh, hd,  hw, by + hh, -hd,  hw, by + hh, hd,
        // 左 (x-)
        -hw, by - hh, -hd, -hw, by - hh, hd, -hw, by + hh, hd,
        -hw, by - hh, -hd, -hw, by + hh, hd, -hw, by + hh, -hd,
      ]);

      const count = positions.length / 3;
      const colors = new Float32Array(count * 3);
      for (let c = 0; c < count * 3; c += 3) {
        colors[c] = r;
        colors[c + 1] = g;
        colors[c + 2] = bl;
      }

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      const colBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aCol);
      gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, count);

      gl.disableVertexAttribArray(aPos);
      gl.disableVertexAttribArray(aCol);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(colBuf);
    }
  }

  _renderPlayerMissiles3D(gl, renderer, camera) {
    const aPos = renderer.getAttribute('aPosition');
    const aCol = renderer.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) return;

    for (const m of this.playerMissiles) {
      const mx = m.position.x * 0.01;
      const my = m.position.y * 0.01;
      const mz = m.position.z * 0.01;
      const s = 0.6;

      const positions = new Float32Array([
        mx - s, my, mz,  mx + s, my, mz,  mx, my + s * 0.5, mz,
        mx - s, my, mz,  mx, my + s * 0.5, mz,  mx, my - s * 0.5, mz,
        mx, my, mz - s,  mx, my, mz + s,  mx, my + s * 0.5, mz,
        mx, my, mz - s,  mx, my + s * 0.5, mz,  mx, my - s * 0.5, mz,
      ]);

      const count = positions.length / 3;
      const colors = new Float32Array(count * 3);
      for (let c = 0; c < count * 3; c += 3) {
        colors[c] = 1.0;
        colors[c + 1] = 0.9;
        colors[c + 2] = 0.2;
      }

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      const colBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aCol);
      gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, count);

      gl.disableVertexAttribArray(aPos);
      gl.disableVertexAttribArray(aCol);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(colBuf);
    }
  }

  // ================================================================
  // 渲染 — 2D 覆盖层（爆炸、敌方导弹、基地状态 HUD）
  // ================================================================

  /**
   * 在2D Canvas 上渲染爆炸效果、敌方导弹尾迹、基地状态 HUD
   */
  renderOverlay(camera) {
    if (!this._overlayCtx) return;

    const ctx = this._overlayCtx;
    ctx.clearRect(0, 0, this._overlayW, this._overlayH);

    this._renderEnemyMissiles2D(ctx, camera);
    this.explosionManager.render(ctx, camera, this._overlayW, this._overlayH);
    this._renderBaseStatusHUD(ctx, camera);
  }

  _renderEnemyMissiles2D(ctx, camera) {
    const fov = 75;
    const halfFov = (fov / 2) * Math.PI / 180;
    const halfW = this._overlayW / 2;
    const halfH = this._overlayH / 2;

    for (const m of this.enemyMissiles) {
      const wx = m.position.x * 0.01;
      const wy = m.position.y * 0.01;
      const wz = m.position.z * 0.01;

      const relX = wx - camera.x * 0.01;
      const relY = wy - camera.y * 0.01;
      const relZ = wz - camera.z * 0.01;

      const cosYaw = Math.cos(-camera.yaw);
      const sinYaw = Math.sin(-camera.yaw);
      let rx = relX * cosYaw - relZ * sinYaw;
      let rz = relX * sinYaw + relZ * cosYaw;
      let ry = relY;

      const cosPitch = Math.cos(-camera.pitch);
      const sinPitch = Math.sin(-camera.pitch);
      const ry2 = ry * cosPitch - rz * sinPitch;
      const rz2 = ry * sinPitch + rz * cosPitch;
      ry = ry2;
      rz = rz2;

      if (rz >= -0.1) continue;

      const scale = Math.abs(1 / rz) * halfW / Math.tan(halfFov);
      const sx = halfW + rx * scale;
      const sy = halfH - ry * scale;

      if (sx < -20 || sx > this._overlayW + 20 || sy < -20 || sy > this._overlayH + 20) continue;

      const alpha = Math.min(1, Math.max(0.3, 3.0 / Math.abs(rz)));

      // 导弹主体（红色）
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#f44';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();

      // 尾迹
      const tailLen = 12;
      const vx = m.velocity.x;
      const vy = m.velocity.y;
      const vz = m.velocity.z;
      const vlen = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (vlen > 1) {
        const tailX = sx - (vx / vlen) * tailLen * scale * 0.1;
        const tailY = sy + (vy / vlen) * tailLen * scale * 0.1;
        ctx.strokeStyle = 'rgba(255,100,50,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  /**
   * 在屏幕左上角绘制基地状态 HUD
   */
  _renderBaseStatusHUD(ctx, camera) {
    const aliveCount = this.buildings.filter(b => b.alive).length;
    const totalCount = this.buildings.length;
    const destroyedCount = totalCount - aliveCount;
    const progress = totalCount > 0 ? destroyedCount / totalCount : 0;

    const boxX = 10;
    const boxY = 10;
    const boxW = 200;
    const boxH = 75;

    // 背景
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#f44';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // 标题
    ctx.fillStyle = '#f44';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('ENEMY BASE', boxX + 8, boxY + 16);

    // 建筑状态
    ctx.fillStyle = aliveCount > 0 ? '#f88' : '#0f0';
    ctx.font = '11px Courier New';
    ctx.fillText(
      'Structures: ' + aliveCount + ' / ' + totalCount,
      boxX + 8, boxY + 32
    );

    // 摧毁进度条
    const barX = boxX + 8;
    const barY = boxY + 40;
    const barW = boxW - 16;
    const barH = 8;

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#f44';
    ctx.fillRect(barX, barY, barW * progress, barH);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barW, barH);

    // 导弹状态
    const hasMissilesFlying =
      this.playerMissiles.length > 0 || this.enemyMissiles.length > 0;
    if (hasMissilesFlying) {
      ctx.fillStyle = '#ff0';
      ctx.font = '10px Courier New';
      ctx.fillText('MISSILES IN FLIGHT', boxX + 8, boxY + 64);
    }
  }
}

/* ================================================================
 * 自动集成：hook 到 GameEngine，无需修改 game.js
 * ================================================================ */

(function () {
  /** 动态加载脚本 */
  function _loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  /** 注入战斗系统到引擎 */
  function _injectCombat(engine) {
    if (engine._combatSystem) return;

    var combat = new CombatSystem();

    // 加载依赖模块
    Promise.all([
      _loadScript('src/enemy.js'),
      _loadScript('src/explosion.js'),
    ]).then(function (results) {
      if (results[0] && results[1]) {
        combat.init();
        engine._combatSystem = combat;
        _hookEngine(engine, combat);
        console.log('[战斗] CombatSystem 已集成到引擎');
      } else {
        console.error('[战斗] 依赖模块加载失败');
      }
    });
  }

  /** Hook 引擎的 update 和 render */
  function _hookEngine(engine, combat) {
    // ---- 更新 Hook ----
    var origUpdate = engine.updateGameplay.bind(engine);

    engine.updateGameplay = function (dt) {
      origUpdate(dt);

      if (!this._aircraftState) return;

      var st = this._aircraftState;

      // 缓存玩家位置供碰撞检测使用
      combat._lastPlayerPos = {
        x: st.position.x,
        y: st.position.y,
        z: st.position.z,
      };

      // 更新战斗系统
      st.health = combat.update(
        dt,
        st.position,
        st.rotation,
        st.health
      );

      // 处理玩家死亡
      if (st.health <= 0) {
        st.health = 0;
        console.log('[战斗] 玩家被击落');
      }

      // 检测空格键发射导弹
      if (this.input && this.input.isKeyDown(' ')) {
        // 计算玩家朝向向量
        const cosPitch = Math.cos(st.rotation.pitch);
        const dir = {
          x: Math.sin(st.rotation.yaw) * cosPitch,
          y: Math.sin(st.rotation.pitch),
          z: Math.cos(st.rotation.yaw) * cosPitch,
        };
        combat.fireMissile(st.position, dir);
      }
    };

    // ---- 渲染 Hook ----
    var origRender = engine.renderGameplay.bind(engine);

    engine.renderGameplay = function () {
      origRender();

      if (!this._aircraftState || !engine._combatSystem) return;

      const st = this._aircraftState;
      const cam = {
        x: st.position.x,
        y: st.position.y,
        z: st.position.z,
        yaw: st.rotation.yaw,
        pitch: st.rotation.pitch,
        roll: st.rotation.roll,
      };

      // WebGL 渲染：建筑 + 玩家导弹
      engine._combatSystem.render(this.renderer, cam);

      //2D 覆盖层渲染：爆炸 + 敌方导弹 + HUD
      engine._combatSystem.renderOverlay(cam);
    };
  }

  /** 等待引擎就绪后注入 */
  function _waitForEngine() {
    var engine = window._engine;
    if (engine && engine.renderer && engine.renderer.getContext()) {
      _injectCombat(engine);
    } else {
      requestAnimationFrame(_waitForEngine);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(_waitForEngine);
    });
  } else {
    requestAnimationFrame(_waitForEngine);
  }
})();
