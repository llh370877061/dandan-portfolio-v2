/**
 * 敌机系统
 * 负责：敌机 AI（巡逻、追踪、攻击）、敌机生成、行为控制
 */

class EnemyAircraft {
  constructor(position, type) {
    this.position = { x: position.x, y: position.y || 500, z: position.z };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.type = type || 'fighter';
    this.health = 80;
    this.maxHealth = 80;
    this.speed = 600;
    this.maxSpeed = 800;
    this.alive = true;

    // AI 行为
    this.state = 'patrol'; // patrol, chase, attack
    this.target = null;
    this.patrolAngle = Math.random() * Math.PI * 2;
    this.patrolRadius = 800 + Math.random() * 400;
    this.patrolCenter = { x: position.x, z: position.z };
    this.attackCooldown = 0;
    this.attackInterval = 2.5; // 攻击间隔（秒）
    this.attackRange = 1500;
    this.chaseRange = 3000;
    this.turnSpeed = 2.0;
  }

  update(dt, playerPosition) {
    if (!this.alive) return;

    const dx = playerPosition.x - this.position.x;
    const dz = playerPosition.z - this.position.z;
    const dy = (playerPosition.y || 500) - this.position.y;
    const distToPlayer = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // AI 状态机
    switch (this.state) {
      case 'patrol':
        if (distToPlayer < this.chaseRange) {
          this.state = 'chase';
          this.target = playerPosition;
        } else {
          this._patrol(dt);
        }
        break;
      case 'chase':
        if (distToPlayer > this.chaseRange * 1.3) {
          this.state = 'patrol';
        } else if (distToPlayer < this.attackRange) {
          this.state = 'attack';
        } else {
          this._chase(dt, playerPosition);
        }
        break;
      case 'attack':
        if (distToPlayer > this.attackRange * 1.5) {
          this.state = 'chase';
        } else {
          this._attack(dt, playerPosition);
        }
        break;
    }

    // 限制高度
    if (this.position.y < 100) this.position.y = 100;
    if (this.position.y > 2000) this.position.y = 2000;

    // 更新位置
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;
  }

  _patrol(dt) {
    this.patrolAngle += dt * 0.4;
    const targetX = this.patrolCenter.x + Math.cos(this.patrolAngle) * this.patrolRadius;
    const targetZ = this.patrolCenter.z + Math.sin(this.patrolAngle) * this.patrolRadius;

    const dx = targetX - this.position.x;
    const dz = targetZ - this.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 1) {
      const speed = this.speed * 0.6;
      this.velocity.x = (dx / dist) * speed;
      this.velocity.z = (dz / dist) * speed;
    }
    this.velocity.y = 0;
  }

  _chase(dt, playerPos) {
    const dx = playerPos.x - this.position.x;
    const dy = (playerPos.y || 500) - this.position.y;
    const dz = playerPos.z - this.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > 1) {
      const speed = this.speed;
      this.velocity.x += (dx / dist) * speed * dt * this.turnSpeed;
      this.velocity.y += (dy / dist) * speed * dt * this.turnSpeed;
      this.velocity.z += (dz / dist) * speed * dt * this.turnSpeed;
    }

    // 速度限制
    const currentSpeed = Math.sqrt(
      this.velocity.x * this.velocity.x +
      this.velocity.y * this.velocity.y +
      this.velocity.z * this.velocity.z
    );
    if (currentSpeed > this.speed) {
      const scale = this.speed / currentSpeed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
      this.velocity.z *= scale;
    }
  }

  _attack(dt, playerPos) {
    this._chase(dt, playerPos);
    this.attackCooldown -= dt;
  }

  canFire() {
    return this.alive && this.state === 'attack' && this.attackCooldown <= 0;
  }

  didFire() {
    this.attackCooldown = this.attackInterval;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
    }
    return !this.alive;
  }
}

class EnemyManager {
  constructor() {
    this.enemies = [];
    this.spawnTimer = 0;
    this.spawnInterval = 8;
    this.maxEnemies = 6;
  }

  update(dt, playerPosition, basePosition) {
    // 定时生成敌机
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
      this.spawn(basePosition);
      this.spawnTimer = 0;
    }

    // 更新所有敌机
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.alive) {
        enemy.update(dt, playerPosition);
      } else {
        this.enemies.splice(i, 1);
      }
    }
  }

  spawn(basePosition) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 500 + Math.random() * 300;
    const position = {
      x: basePosition.x + Math.cos(angle) * distance,
      y: 400 + Math.random() * 300,
      z: basePosition.z + Math.sin(angle) * distance,
    };
    this.enemies.push(new EnemyAircraft(position));
  }

  getAliveEnemies() {
    return this.enemies.filter(e => e.alive);
  }

  removeDead() {
    this.enemies = this.enemies.filter(e => e.alive);
  }
}

// 暴露到全局作用域
window.EnemyAircraft = EnemyAircraft;
window.EnemyManager = EnemyManager;
