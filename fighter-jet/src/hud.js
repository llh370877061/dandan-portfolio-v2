/**
 * HUD 界面系统
 * 负责：飞行仪表、雷达显示、武器状态、小地图
 *
 * 集成方式：在 game.js 中调用
 *   const hud = new HUDSystem();
 *   hud.init();            // 创建 HUD 画布
 *   hud.update(state, enemies, combatState);  // 每帧更新数据
 *   hud.render();          // 每帧渲染 HUD
 */

class HUDSystem {
  constructor() {
    /** @type {HTMLCanvasElement} */
    this.canvas = null;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = null;

    // ---- 数据缓存 ----
    /** @type {Object} 飞机状态快照 */
    this._aircraft = null;
    /** @type {Array} 敌机列表快照 */
    this._enemies = [];
    /** @type {Object} 战斗状态快照 */
    this._combat = null;

    // ---- 雷达扫描线角度 ----
    this._radarAngle = 0;

    // ---- 世界坐标系常量 ----
    /** 雷达 / 小地图 的世界范围半径（游戏坐标单位） */
    this.WORLD_RANGE = 5000;
    /** 机场位置（游戏坐标） */
    this.AIRPORT_POS = { x: 0, z: 0 };
    /** 敌方基地位置（游戏坐标） */
    this.ENEMY_BASE_POS = { x: 4000, z: 4000 };
  }

  /* ==============================================================
   * 初始化
   * ============================================================== */

  /**
   * 创建 HUD 画布并挂载到 DOM
   */
  init() {
    if (this.canvas) return; // 防止重复初始化

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'hud-canvas';
    this.canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    // 响应窗口大小变化
    this._resizeHandler = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', this._resizeHandler);
  }

  /* ==============================================================
   * 数据更新（每帧调用）
   * ============================================================== */

  /**
   * @param {Object} aircraftState - { speed, altitude, position:{x,y,z}, rotation:{pitch,yaw,roll}, health, missilesLeft }
   * @param {Array}  enemies       - [ { position:{x,y,z}, health, type }, ... ]
   * @param {Object} [combatState]  - { locked: boolean, lockedEnemy: Object|null }
   */
  update(aircraftState, enemies, combatState) {
    this._aircraft = aircraftState;
    this._enemies = enemies || [];
    this._combat = combatState || null;
  }

  /* ==============================================================
   * 主渲染入口
   * ============================================================== */

  render() {
    const ctx = this.ctx;
    if (!ctx) return;

    const W = this.canvas.width;
    const H = this.canvas.height;

    // 清空画布
    ctx.clearRect(0, 0, W, H);

    // 无飞机数据时不绘制
    if (!this._aircraft) return;

    const ac = this._aircraft;

    // 更新雷达扫描角度
    this._radarAngle += 0.03; // 每帧增量（约 60fps 下 1.8 rad/s）
    if (this._radarAngle > Math.PI * 2) this._radarAngle -= Math.PI * 2;

    // ---- 各组件绘制 ----
    this._drawSpeedGauge(ctx, ac.speed, ac.maxSpeed || 3000, W, H);
    this._drawAltitudeGauge(ctx, ac.altitude || ac.position.y, W, H);
    this._drawAttitudeIndicator(ctx, ac.rotation.pitch, ac.rotation.roll, W, H);
    this._drawRadar(ctx, ac.position, this._enemies, W, H);
    this._drawWeaponStatus(ctx, ac.missilesLeft, this._combat, W, H);
    this._drawMinimap(ctx, ac.position, W, H);
    this._drawCrosshair(ctx, W, H);
  }

  /* ==============================================================
   * 速度表（左侧竖条）
   * ============================================================== */

  _drawSpeedGauge(ctx, speed, maxSpeed, W, H) {
    const gaugeX = 40;          // 条形左侧 x
    const gaugeY = H * 0.2;    // 条形顶部 y
    const gaugeW = 28;          // 条形宽度
    const gaugeH = H * 0.55;   // 条形高度

    // 背景条
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);
    ctx.strokeRect(gaugeX, gaugeY, gaugeW, gaugeH);

    // 填充量
    const ratio = Math.max(0, Math.min(1, speed / maxSpeed));
    const fillH = gaugeH * ratio;
    ctx.fillStyle = ratio > 0.9 ? '#f44' : '#0f0';
    ctx.fillRect(gaugeX, gaugeY + gaugeH - fillH, gaugeW, fillH);

    // 刻度线
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = gaugeY + (gaugeH / 10) * i;
      const tickLen = i % 5 === 0 ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(gaugeX - tickLen, y);
      ctx.lineTo(gaugeX, y);
      ctx.stroke();
    }

    // 数字标签
    ctx.fillStyle = '#0f0';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText(maxSpeed.toString(), gaugeX - 14, gaugeY + 4);
    ctx.fillText('0', gaugeX - 14, gaugeY + gaugeH + 4);

    // 当前速度（大字）
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f0';
    ctx.fillText(Math.round(speed).toString(), gaugeX + gaugeW / 2, gaugeY - 12);

    // 单位
    ctx.font = '10px Courier New';
    ctx.fillText('km/h', gaugeX + gaugeW / 2, gaugeY - 2);

    // 标题
    ctx.font = '12px Courier New';
    ctx.fillText('SPD', gaugeX + gaugeW / 2, gaugeY + gaugeH + 20);
  }

  /* ==============================================================
   * 高度表（右侧竖条）
   * ============================================================== */

  _drawAltitudeGauge(ctx, altitude, W, H) {
    const maxAlt = 20000;
    const gaugeX = W - 68;       // 条形左侧 x
    const gaugeY = H * 0.2;
    const gaugeW = 28;
    const gaugeH = H * 0.55;

    // 背景条
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);
    ctx.strokeRect(gaugeX, gaugeY, gaugeW, gaugeH);

    // 填充量
    const ratio = Math.max(0, Math.min(1, altitude / maxAlt));
    const fillH = gaugeH * ratio;
    ctx.fillStyle = altitude < 100 ? '#f44' : '#0ff';
    ctx.fillRect(gaugeX, gaugeY + gaugeH - fillH, gaugeW, fillH);

    // 刻度线
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = gaugeY + (gaugeH / 10) * i;
      const tickLen = i % 5 === 0 ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(gaugeX + gaugeW, y);
      ctx.lineTo(gaugeX + gaugeW + tickLen, y);
      ctx.stroke();
    }

    // 数字标签
    ctx.fillStyle = '#0ff';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(maxAlt.toString(), gaugeX + gaugeW + 16, gaugeY + 4);
    ctx.fillText('0', gaugeX + gaugeW + 16, gaugeY + gaugeH + 4);

    // 当前高度（大字）
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(altitude).toString(), gaugeX + gaugeW / 2, gaugeY - 12);

    // 单位
    ctx.font = '10px Courier New';
    ctx.fillText('m', gaugeX + gaugeW / 2, gaugeY - 2);

    // 标题
    ctx.font = '12px Courier New';
    ctx.fillText('ALT', gaugeX + gaugeW / 2, gaugeY + gaugeH + 20);
  }

  /* ==============================================================
   * 姿态仪（中心偏上）
   * ============================================================== */

  _drawAttitudeIndicator(ctx, pitch, roll, W, H) {
    const cx = W / 2;
    const cy = H * 0.18;
    const radius = Math.min(W, H) * 0.07;

    ctx.save();

    // 裁剪圆形区域
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // 绘制背景（天空/地面分界）
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-roll);

    // 俯仰偏移
    const pitchOffset = (pitch / (Math.PI / 2)) * radius;

    // 天空
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(-radius * 2, -radius * 2, radius * 4, radius * 2 + pitchOffset);

    // 地面
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(-radius * 2, pitchOffset, radius * 4, radius * 2);

    // 地平线
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 2, pitchOffset);
    ctx.lineTo(radius * 2, pitchOffset);
    ctx.stroke();

    // 俯仰刻度线
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.font = '9px Courier New';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'center';
    for (let deg = -60; deg <= 60; deg += 20) {
      if (deg === 0) continue;
      const yOff = pitchOffset - (deg / 90) * radius;
      const halfW = 15;
      ctx.beginPath();
      ctx.moveTo(-halfW, yOff);
      ctx.lineTo(halfW, yOff);
      ctx.stroke();
      ctx.fillText(Math.abs(deg).toString(), halfW + 12, yOff + 3);
    }

    ctx.restore();

    // 外框
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 固定翼标记（左右两个三角）
    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 2;
    // 左翼
    ctx.beginPath();
    ctx.moveTo(cx - radius - 5, cy);
    ctx.lineTo(cx - radius + 8, cy - 5);
    ctx.lineTo(cx - radius + 8, cy + 5);
    ctx.closePath();
    ctx.stroke();
    // 右翼
    ctx.beginPath();
    ctx.moveTo(cx + radius + 5, cy);
    ctx.lineTo(cx + radius - 8, cy - 5);
    ctx.lineTo(cx + radius - 8, cy + 5);
    ctx.closePath();
    ctx.stroke();

    // 中心点
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 滚转角指示（圆弧上的刻度）
    this._drawRollIndicator(ctx, cx, cy, radius, roll);
  }

  /**
   * 在姿态仪圆周上绘制滚转角刻度
   */
  _drawRollIndicator(ctx, cx, cy, radius, roll) {
    ctx.save();
    ctx.translate(cx, cy);

    // 绘制固定的刻度（顶部 0°，左右各 60°）
    const tickAngles = [0, -30, -60, 30, 60];
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;

    for (const deg of tickAngles) {
      const rad = (deg - 90) * Math.PI / 180;
      const innerR = radius + 4;
      const outerR = radius + (deg === 0 ? 12 : 8);
      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR);
      ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
      ctx.stroke();
    }

    // 当前滚转角指针
    const rollRad = (-roll - Math.PI / 2);
    const pointerR = radius + 16;
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(rollRad) * pointerR,
      Math.sin(rollRad) * pointerR
    );
    ctx.lineTo(
      Math.cos(rollRad - 0.15) * (pointerR - 8),
      Math.sin(rollRad - 0.15) * (pointerR - 8)
    );
    ctx.lineTo(
      Math.cos(rollRad + 0.15) * (pointerR - 8),
      Math.sin(rollRad + 0.15) * (pointerR - 8)
    );
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /* ==============================================================
   * 雷达显示（左下角）
   * ============================================================== */

  _drawRadar(ctx, playerPos, enemies, W, H) {
    const radarR = Math.min(W, H) * 0.13;
    const cx = radarR + 30;
    const cy = H - radarR - 30;

    ctx.save();

    // 背景圆形
    ctx.fillStyle = 'rgba(0,20,0,0.7)';
    ctx.beginPath();
    ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
    ctx.fill();

    // 同心圆网格
    ctx.strokeStyle = 'rgba(0,255,0,0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, radarR * (i / 4), 0, Math.PI * 2);
      ctx.stroke();
    }

    // 十字线
    ctx.beginPath();
    ctx.moveTo(cx - radarR, cy);
    ctx.lineTo(cx + radarR, cy);
    ctx.moveTo(cx, cy - radarR);
    ctx.lineTo(cx, cy + radarR);
    ctx.stroke();

    // 扫描线（扇形渐隐）
    const sweepAngle = 0.6; // 扇形半角
    const gradient = ctx.createConicGradient(this._radarAngle - sweepAngle, cx, cy);
    gradient.addColorStop(0, 'rgba(0,255,0,0)');
    gradient.addColorStop(sweepAngle / (Math.PI * 2), 'rgba(0,255,0,0.3)');
    gradient.addColorStop((sweepAngle + 0.01) / (Math.PI * 2), 'rgba(0,255,0,0)');
    gradient.addColorStop(1, 'rgba(0,255,0,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
    ctx.fill();

    // 扫描线（亮线）
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(this._radarAngle) * radarR,
      cy + Math.sin(this._radarAngle) * radarR
    );
    ctx.stroke();

    // ---- 绘制目标点 ----
    const scale = radarR / this.WORLD_RANGE;

    // 敌机（红点）
    if (enemies && enemies.length > 0) {
      for (const enemy of enemies) {
        if (!enemy.position) continue;
        const dx = (enemy.position.x - playerPos.x) * scale;
        const dz = (enemy.position.z - playerPos.z) * scale;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > radarR) continue; // 超出雷达范围

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dz, 4, 0, Math.PI * 2);
        ctx.fill();

        // 闪烁效果
        if (Math.sin(Date.now() * 0.01) > 0) {
          ctx.strokeStyle = 'rgba(255,0,0,0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx + dx, cy + dz, 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // 友方（蓝点）— 这里暂无友方数据，预留绘制逻辑
    // 未来可传入 allies 数组绘制

    // 玩家自身（蓝色三角形，位于中心）
    ctx.fillStyle = '#0af';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.closePath();
    ctx.fill();

    // 外框
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
    ctx.stroke();

    // 标题
    ctx.fillStyle = '#0f0';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('RADAR', cx, cy - radarR - 8);

    // 距离标注
    ctx.font = '9px Courier New';
    ctx.fillStyle = 'rgba(0,255,0,0.6)';
    ctx.fillText(Math.round(this.WORLD_RANGE / 4) + 'km', cx + radarR * 0.25 + 2, cy - 3);
    ctx.fillText(Math.round(this.WORLD_RANGE / 2) + 'km', cx + radarR * 0.5 + 2, cy - 3);

    ctx.restore();
  }

  /* ==============================================================
   * 武器状态（底部中央）
   * ============================================================== */

  _drawWeaponStatus(ctx, missilesLeft, combatState, W, H) {
    const boxW = 180;
    const boxH = 60;
    const boxX = W / 2 - boxW / 2;
    const boxY = H - boxH - 30;

    // 背景
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // 标题
    ctx.fillStyle = '#0f0';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('WEAPONS', W / 2, boxY + 14);

    // 导弹图标 + 数量
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'left';
    ctx.fillStyle = missilesLeft > 0 ? '#0f0' : '#f44';
    ctx.fillText('=', boxX + 10, boxY + 40); // 简易导弹符号
    ctx.fillText('x' + missilesLeft, boxX + 30, boxY + 40);

    // 锁定状态
    const locked = combatState && combatState.locked;
    ctx.textAlign = 'right';
    if (locked) {
      ctx.fillStyle = '#f44';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText('LOCK', boxX + boxW - 10, boxY + 40);
      // 闪烁方框
      if (Math.sin(Date.now() * 0.008) > 0) {
        ctx.strokeStyle = '#f44';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX + boxW - 55, boxY + 26, 50, 18);
      }
    } else {
      ctx.fillStyle = '#888';
      ctx.font = '12px Courier New';
      ctx.fillText('SEARCH', boxX + boxW - 10, boxY + 40);
    }
  }

  /* ==============================================================
   * 小地图（右下角）
   * ============================================================== */

  _drawMinimap(ctx, playerPos, W, H) {
    const mapSize = Math.min(W, H) * 0.15;
    const mapX = W - mapSize - 20;
    const mapY = H - mapSize - 100;
    const scale = mapSize / (this.WORLD_RANGE * 2);

    ctx.save();

    // 背景
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);

    // 世界原点 → 小地图中心
    const originX = mapX + mapSize / 2;
    const originY = mapY + mapSize / 2;

    // 网格线
    ctx.strokeStyle = 'rgba(0,255,0,0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const gx = mapX + (mapSize / 4) * i;
      const gy = mapY + (mapSize / 4) * i;
      ctx.beginPath();
      ctx.moveTo(gx, mapY);
      ctx.lineTo(gx, mapY + mapSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mapX, gy);
      ctx.lineTo(mapX + mapSize, gy);
      ctx.stroke();
    }

    // 机场位置（蓝色方块）
    const apX = originX + this.AIRPORT_POS.x * scale;
    const apY = originY + this.AIRPORT_POS.z * scale;
    ctx.fillStyle = '#08f';
    ctx.fillRect(apX - 4, apY - 4, 8, 8);
    ctx.strokeStyle = '#0af';
    ctx.lineWidth = 1;
    ctx.strokeRect(apX - 4, apY - 4, 8, 8);

    // 敌方基地（红色方块）
    const ebX = originX + this.ENEMY_BASE_POS.x * scale;
    const ebY = originY + this.ENEMY_BASE_POS.z * scale;
    ctx.fillStyle = '#f44';
    ctx.fillRect(ebX - 5, ebY - 5, 10, 10);
    ctx.strokeStyle = '#f88';
    ctx.lineWidth = 1;
    ctx.strokeRect(ebX - 5, ebY - 5, 10, 10);

    // 玩家位置（三角形，朝向由 yaw 决定）
    const px = originX + playerPos.x * scale;
    const py = originY + playerPos.z * scale;
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(px, py - 6);
    ctx.lineTo(px - 4, py + 4);
    ctx.lineTo(px + 4, py + 4);
    ctx.closePath();
    ctx.fill();

    // 标签
    ctx.fillStyle = '#0af';
    ctx.font = '8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('APT', apX, apY - 8);
    ctx.fillStyle = '#f44';
    ctx.fillText('ENEMY', ebX, ebY - 9);

    // 标题
    ctx.fillStyle = '#0f0';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('MAP', mapX + mapSize / 2, mapY - 6);

    ctx.restore();
  }

  /* ==============================================================
   * 准心（屏幕中心）
   * ============================================================== */

  _drawCrosshair(ctx, W, H) {
    const cx = W / 2;
    const cy = H / 2;
    const size = 20;
    const gap = 8;

    ctx.strokeStyle = 'rgba(0,255,0,0.7)';
    ctx.lineWidth = 1.5;

    // 上
    ctx.beginPath();
    ctx.moveTo(cx, cy - gap);
    ctx.lineTo(cx, cy - gap - size);
    ctx.stroke();
    // 下
    ctx.beginPath();
    ctx.moveTo(cx, cy + gap);
    ctx.lineTo(cx, cy + gap + size);
    ctx.stroke();
    // 左
    ctx.beginPath();
    ctx.moveTo(cx - gap, cy);
    ctx.lineTo(cx - gap - size, cy);
    ctx.stroke();
    // 右
    ctx.beginPath();
    ctx.moveTo(cx + gap, cy);
    ctx.lineTo(cx + gap + size, cy);
    ctx.stroke();

    // 中心圆
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* ==============================================================
   * 清理
   * ============================================================== */

  destroy() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}
