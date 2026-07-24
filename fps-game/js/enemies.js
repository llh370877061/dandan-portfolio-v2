// ========== 敌人 AI ==========
const ENEMY_TYPES = {
  grunt: { hp: 100, damage: 15, speed: 4, color: 0x8B0000, score: 10 },
  armed: { hp: 200, damage: 25, speed: 4, color: 0x660000, score: 20 },
  rusher: { hp: 80, damage: 20, speed: 7, color: 0xAA0000, score: 15 },
  heavy: { hp: 400, damage: 35, speed: 2.5, color: 0x440000, score: 30 },
  sniper: { hp: 60, damage: 50, speed: 2, color: 0x330033, score: 25 },
  elite: { hp: 300, damage: 40, speed: 6, color: 0xFF0000, score: 50 },
};

const WAVES = [
  { enemies: [{ type: 'grunt', count: 8 }] },
  { enemies: [{ type: 'grunt', count: 6 }, { type: 'armed', count: 3 }, { type: 'rusher', count: 3 }] },
  { enemies: [{ type: 'grunt', count: 5 }, { type: 'armed', count: 3 }, { type: 'heavy', count: 2 }, { type: 'sniper', count: 2 }] },
  { enemies: [{ type: 'grunt', count: 4 }, { type: 'armed', count: 4 }, { type: 'rusher', count: 4 }, { type: 'sniper', count: 2 }] },
  { enemies: [{ type: 'grunt', count: 3 }, { type: 'elite', count: 2 }, { type: 'armed', count: 3 }, { type: 'heavy', count: 2 }] },
];

class Enemy {
  constructor(type, position, scene) {
    this.type = type;
    const def = ENEMY_TYPES[type];
    this.hp = def.hp;
    this.maxHp = def.hp;
    this.damage = def.damage;
    this.speed = def.speed;
    this.color = def.color;
    this.alive = true;
    this.scene = scene;

    // AI 状态
    this.state = 'patrol'; // patrol, chase, attack, takeCover, dead
    this.targetPos = null;
    this.lastFireTime = 0;
    this.fireInterval = 1200 + Math.random() * 800;
    this.detectionRange = 50;
    this.attackRange = type === 'sniper' ? 40 : 20;
    this.coverRange = 10;
    this.patrolTarget = null;
    this.stuckTimer = 0;

    // 3D 模型
    this.mesh = this.createMesh();
    this.mesh.position.set(position.x, position.y || 1, position.z);
    scene.add(this.mesh);

    // 血条
    this.hpBar = this.createHpBar();
    this.mesh.add(this.hpBar);
  }

  createMesh() {
    const group = new THREE.Group();

    // 身体
    const bodyMat = new THREE.MeshLambertMaterial({ color: this.color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.4), bodyMat);
    body.position.y = 0.5;
    body.castShadow = true;
    group.add(body);

    // 头
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), bodyMat);
    head.position.y = 1.3;
    head.castShadow = true;
    group.add(head);

    // 眼睛
    const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), eyeMat);
    eyeL.position.set(-0.08, 1.35, 0.18);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), eyeMat);
    eyeR.position.set(0.08, 1.35, 0.18);
    group.add(eyeR);

    // 腿
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), bodyMat);
    legL.position.set(-0.15, -0.25, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), bodyMat);
    legR.position.set(0.15, -0.25, 0);
    group.add(legR);

    // 枪（手里的武器）
    const gunMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), gunMat);
    gun.position.set(0.35, 0.6, 0.2);
    group.add(gun);

    return group;
  }

  createHpBar() {
    const group = new THREE.Group();
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.08), bgMat);
    bg.position.y = 1.8;
    bg.lookAt(new THREE.Vector3(bg.position.x, bg.position.y, bg.position.z + 1));
    group.add(bg);

    const hpMat = new THREE.MeshBasicMaterial({ color: 0xe94560 });
    this.hpFill = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.06), hpMat);
    this.hpFill.position.y = 1.8;
    this.hpFill.position.z = 0.01;
    group.add(this.hpFill);

    return group;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.die();
    } else {
      // 受伤闪烁
      this.mesh.children[0].material.emissive = new THREE.Color(0xff0000);
      setTimeout(() => {
        if (this.mesh.children[0]) this.mesh.children[0].material.emissive = new THREE.Color(0x000000);
      }, 100);
    }
    this.updateHpBar();
  }

  updateHpBar() {
    const ratio = this.hp / this.maxHp;
    this.hpFill.scale.x = ratio;
    this.hpFill.position.x = -0.39 * (1 - ratio);
  }

  die() {
    // 死亡动画
    const fall = () => {
      if (this.mesh.rotation.x < Math.PI / 2) {
        this.mesh.rotation.x += 0.05;
        this.mesh.position.y -= 0.02;
        requestAnimationFrame(fall);
      } else {
        setTimeout(() => {
          this.scene.remove(this.mesh);
        }, 2000);
      }
    };
    fall();
  }

  update(dt, playerPos, coverPoints) {
    if (!this.alive) return;

    // 血条朝向玩家
    this.hpBar.lookAt(playerPos);

    const distToPlayer = this.distanceTo(playerPos);

    switch (this.state) {
      case 'patrol':
        this.patrol(dt, playerPos, distToPlayer);
        break;
      case 'chase':
        this.chase(dt, playerPos, distToPlayer);
        break;
      case 'attack':
        this.attack(dt, playerPos, distToPlayer);
        break;
      case 'takeCover':
        this.takeCover(dt, playerPos, coverPoints);
        break;
    }
  }

  patrol(dt, playerPos, dist) {
    // 巡逻：随机移动
    if (!this.patrolTarget) {
      this.patrolTarget = new THREE.Vector3(
        this.mesh.position.x + (Math.random() - 0.5) * 20,
        0,
        this.mesh.position.z + (Math.random() - 0.5) * 20
      );
    }

    this.moveTo(this.patrolTarget, dt, this.speed * 0.5);

    if (this.distanceTo(this.patrolTarget) < 2) {
      this.patrolTarget = null;
    }

    // 发现玩家
    if (dist < this.detectionRange) {
      this.state = 'chase';
    }
  }

  chase(dt, playerPos, dist) {
    this.moveTo(playerPos, dt, this.speed);

    if (dist < this.attackRange) {
      this.state = 'attack';
    }

    // 丢失目标
    if (dist > this.detectionRange * 1.5) {
      this.state = 'patrol';
    }
  }

  attack(dt, playerPos, dist) {
    // 面朝玩家
    this.faceTarget(playerPos);

    // 射击
    const now = performance.now();
    if (now - this.lastFireTime > this.fireInterval) {
      this.lastFireTime = now;
      // 返回伤害值（由main.js处理）
      this.shooting = true;
    } else {
      this.shooting = false;
    }

    // 距离太远就追
    if (dist > this.attackRange * 1.2) {
      this.state = 'chase';
    }

    // 血量低时找掩体
    if (this.hp < this.maxHp * 0.3) {
      this.state = 'takeCover';
    }
  }

  takeCover(dt, playerPos, coverPoints) {
    // 找最近的掩体
    if (!this.coverTarget && coverPoints.length > 0) {
      let minDist = Infinity;
      coverPoints.forEach(c => {
        const d = this.distanceTo(new THREE.Vector3(c.x, 0, c.z));
        if (d < minDist) {
          minDist = d;
          this.coverTarget = new THREE.Vector3(c.x, 0, c.z);
        }
      });
    }

    if (this.coverTarget) {
      this.moveTo(this.coverTarget, dt, this.speed);
      if (this.distanceTo(this.coverTarget) < 2) {
        this.coverTarget = null;
        // 在掩体后射击
        this.state = 'attack';
      }
    } else {
      this.state = 'chase';
    }
  }

  moveTo(target, dt, speed) {
    const dir = new THREE.Vector3()
      .subVectors(target, this.mesh.position)
      .setY(0)
      .normalize();

    this.mesh.position.x += dir.x * speed * dt;
    this.mesh.position.z += dir.z * speed * dt;
    this.faceTarget(target);

    // 行走动画
    this.walkAnim += dt * speed;
    if (this.mesh.children[4]) { // 腿
      this.mesh.children[4].rotation.x = Math.sin(this.walkAnim * 5) * 0.5;
    }
    if (this.mesh.children[5]) {
      this.mesh.children[5].rotation.x = -Math.sin(this.walkAnim * 5) * 0.5;
    }
  }

  faceTarget(target) {
    const dir = new THREE.Vector3()
      .subVectors(target, this.mesh.position)
      .setY(0)
      .normalize();
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
  }

  distanceTo(pos) {
    return this.mesh.position.distanceTo(
      pos instanceof THREE.Vector3 ? pos : new THREE.Vector3(pos.x, this.mesh.position.y, pos.z)
    );
  }
}

class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = [];
    this.currentWave = 0;
    this.totalWaves = WAVES.length;
    this.spawnPoints = [];
    this.coverPoints = [];
  }

  setMap(mapId) {
    this.spawnPoints = getEnemySpawns(mapId);
    this.coverPoints = getCoverPoints(mapId);
  }

  spawnWave(waveIndex) {
    this.currentWave = waveIndex;
    const wave = WAVES[waveIndex];
    let spawnIndex = 0;

    wave.enemies.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        const spawn = this.spawnPoints[spawnIndex % this.spawnPoints.length];
        const offset = {
          x: spawn.x + (Math.random() - 0.5) * 4,
          y: spawn.y || 1,
          z: spawn.z + (Math.random() - 0.5) * 4,
        };
        const enemy = new Enemy(group.type, offset, this.scene);
        this.enemies.push(enemy);
        spawnIndex++;
      }
    });

    return this.enemies.length;
  }

  update(dt, playerPos) {
    let aliveCount = 0;
    this.enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.update(dt, playerPos, this.coverPoints);
        aliveCount++;
      }
    });
    return aliveCount;
  }

  checkPlayerShooting(raycaster, damage) {
    const hitEnemies = [];
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      // 简单距离+方向检测
      const toEnemy = new THREE.Vector3().subVectors(enemy.mesh.position, raycaster.ray.origin);
      const projection = toEnemy.dot(raycaster.ray.direction);
      if (projection < 0) return;

      const closest = new THREE.Vector3()
        .copy(raycaster.ray.direction)
        .multiplyScalar(projection)
        .add(raycaster.ray.origin);

      const dist = closest.distanceTo(enemy.mesh.position);
      if (dist < 1.2) { // 命中半径
        const bone = this.hitZone(closest, enemy.mesh.position);
        const mult = getHitMultiplier(bone);
        enemy.takeDamage(damage * mult);
        hitEnemies.push({ enemy, bone, damage: damage * mult });
      }
    });
    return hitEnemies;
  }

  checkMelee(raycaster, damage) {
    const hitEnemies = [];
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      const dist = enemy.mesh.position.distanceTo(raycaster.ray.origin);
      if (dist < 3) {
        // 背后偷袭
        const behind = enemy.mesh.getWorldDirection(new THREE.Vector3());
        const toPlayer = new THREE.Vector3().subVectors(raycaster.ray.origin, enemy.mesh.position).normalize();
        const dot = behind.dot(toPlayer);
        const mult = dot > 0.7 ? 2 : 1; // 背后偷袭x2
        enemy.takeDamage(damage * mult);
        hitEnemies.push({ enemy, bone: 'melee', damage: damage * mult });
      }
    });
    return hitEnemies;
  }

  hitZone(hitPos, enemyPos) {
    const y = hitPos.y - enemyPos.y;
    if (y > 1.0) return 'head';
    if (y > -0.2) return 'torso';
    return 'limbs';
  }

  getAliveCount() {
    return this.enemies.filter(e => e.alive).length;
  }

  clear() {
    this.enemies.forEach(e => {
      if (e.mesh.parent) e.scene.remove(e.mesh);
    });
    this.enemies = [];
  }
}
