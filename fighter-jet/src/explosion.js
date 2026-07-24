/**
 * 爆炸效果系统
 * 负责：爆炸动画、粒子效果、2D Canvas 渲染
 */

class Explosion {
  constructor(position, size) {
    this.position = { x: position.x, y: position.y || 0, z: position.z };
    this.particles = [];
    this.life = 1.0;
    this.maxLife = 1.0;
    this.size = size || 15;
    this.active = true;
  }

  init() {
    const count = 30 + Math.floor(Math.random() * 15);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = this.size * (0.5 + Math.random() * 1.5);

      this.particles.push({
        x: 0,
        y: 0,
        z: 0,
        vx: Math.cos(angle) * Math.cos(elevation) * speed,
        vy: Math.sin(elevation) * speed * 0.6,
        vz: Math.sin(angle) * Math.cos(elevation) * speed,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 3,
        r: 1.0,
        g: 0.3 + Math.random() * 0.5,
        b: 0.05 + Math.random() * 0.15,
      });
    }
    // 核心闪光粒子
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: 0, y: 0, z: 0,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        vz: (Math.random() - 0.5) * 5,
        life: 0.2 + Math.random() * 0.2,
        maxLife: 0.2 + Math.random() * 0.2,
        size: 4 + Math.random() * 3,
        r: 1.0, g: 1.0, b: 0.8,
      });
    }
  }

  update(dt) {
    if (!this.active) return false;

    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return false;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 8 * dt; // 重力
    }

    return this.particles.length > 0;
  }

  /**
   * 渲染到 2D Canvas（世界坐标 → 屏幕坐标投影）
   * @param {CanvasRenderingContext2D} ctx
   * @param {{x:number,y:number,z:number,yaw:number,pitch:number,roll:number}} camera
   * @param {number} canvasW
   * @param {number} canvasH
   */
  render(ctx, camera, canvasW, canvasH) {
    if (!this.active) return;

    const fov = 75;
    const halfFov = (fov / 2) * Math.PI / 180;
    const halfW = canvasW / 2;
    const halfH = canvasH / 2;

    for (const p of this.particles) {
      // 世界坐标
      const wx = this.position.x * 0.01 + p.x * 0.01;
      const wy = this.position.y * 0.01 + p.y * 0.01;
      const wz = this.position.z * 0.01 + p.z * 0.01;

      // 相机空间（反向旋转 + 平移）
      const relX = wx - camera.x * 0.01;
      const relY = wy - camera.y * 0.01;
      const relZ = wz - camera.z * 0.01;

      // 偏航旋转
      const cosYaw = Math.cos(-camera.yaw);
      const sinYaw = Math.sin(-camera.yaw);
      let rx = relX * cosYaw - relZ * sinYaw;
      let rz = relX * sinYaw + relZ * cosYaw;
      let ry = relY;

      // 俯仰旋转
      const cosPitch = Math.cos(-camera.pitch);
      const sinPitch = Math.sin(-camera.pitch);
      const ry2 = ry * cosPitch - rz * sinPitch;
      const rz2 = ry * sinPitch + rz * cosPitch;
      ry = ry2;
      rz = rz2;

      // 透视投影
      if (rz >= -0.1) continue; // 在相机后面

      const scale = Math.abs(1 / rz) * halfW / Math.tan(halfFov);
      const sx = halfW + rx * scale;
      const sy = halfH - ry * scale;

      // 屏幕外跳过
      if (sx < -50 || sx > canvasW + 50 || sy < -50 || sy > canvasH + 50) continue;

      const alpha = Math.max(0, p.life / p.maxLife);
      const radius = Math.max(1, p.size * scale * 0.3 * alpha);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${Math.floor(p.r * 255)},${Math.floor(p.g * 255)},${Math.floor(p.b * 255)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

class ExplosionManager {
  constructor() {
    this.explosions = [];
  }

  create(position, size) {
    const explosion = new Explosion(position, size);
    explosion.init();
    this.explosions.push(explosion);
  }

  update(dt) {
    this.explosions = this.explosions.filter(e => e.update(dt));
  }

  /**
   * 渲染所有爆炸到 2D Canvas
   */
  render(ctx, camera, canvasW, canvasH) {
    for (const explosion of this.explosions) {
      explosion.render(ctx, camera, canvasW, canvasH);
    }
  }
}

// 暴露到全局作用域
window.Explosion = Explosion;
window.ExplosionManager = ExplosionManager;
