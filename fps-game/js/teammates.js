// ========== 队友 AI ==========
class Teammate {
  constructor(type, position, scene) {
    this.type = type; // 'shield', 'rocket', 'c4'
    this.scene = scene;
    this.alive = true;
    this.position = new THREE.Vector3(position.x, position.y || 1.7, position.z);

    // 类型特定属性
    switch (type) {
      case 'shield':
        this.maxHp = 500;
        this.hp = 500;
        this.color = 0x2196F3;
        this.label = '🛡️';
        this.ammo = Infinity;
        break;
      case 'rocket':
        this.maxHp = 150;
        this.hp = 150;
        this.color = 0xFF9800;
        this.label = '🚀';
        this.ammo = 12;
        this.reloadTime = 4000;
        this.lastFireTime = 0;
        break;
      case 'c4':
        this.maxHp = 120;
        this.hp = 120;
        this.color = 0xF44336;
        this.label = '💣';
        this.ammo = 8;
        this.planting = false;
        this.plantTimer = 0;
        this.fleeing = false;
        this.fleeTimer = 0;
        break;
    }

    // AI 状态
    this.state = 'follow';
    this.speed = 5;
    this.mesh = this.createMesh();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
  }

  createMesh() {
    const group = new THREE.Group();
    const mat = new THREE.MeshLambertMaterial({ color: this.color });

    // 身体
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.4), mat);
    body.position.y = 0.5;
    body.castShadow = true;
    group.add(body);

    // 头
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), mat);
    head.position.y = 1.3;
    group.add(head);

    // 眼睛（蓝色）
    const eyeMat = new THREE.MeshLambertMaterial({ color: 0x00ccff });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), eyeMat);
    eyeL.position.set(-0.08, 1.35, 0.18);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), eyeMat);
    eyeR.position.set(0.08, 1.35, 0.18);
    group.add(eyeR);

    // 腿
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), mat);
    legL.position.set(-0.15, -0.25, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), mat);
    legR.position.set(0.15, -0.25, 0);
    group.add(legR);

    // 类型特征
    if (this.type === 'shield') {
      // 大盾
      const shieldMat = new THREE.MeshLambertMaterial({ color: 0x4488aa });
      const shield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.1), shieldMat);
      shield.position.set(0, 0.9, 0.5);
      group.add(shield);
    } else if (this.type === 'rocket') {
      // 火箭筒
      const rocketMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
      const rocket = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 8), rocketMat);
      rocket.rotation.x = Math.PI / 2;
      rocket.position.set(0.4, 0.8, 0.3);
      group.add(rocket);
    } else if (this.type === 'c4') {
      // C4炸药包
      const c4Mat = new THREE.MeshLambertMaterial({ color: 0x666600 });
      const c4 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), c4Mat);
      c4.position.set(0, 1.5, 0.1);
      group.add(c4);
    }

    return group;
  }

  update(dt, playerPos, enemies) {
    if (!this.alive) return;

    const distToPlayer = this.position.distanceTo(playerPos);

    switch (this.type) {
      case 'shield':
        this.updateShield(dt, playerPos, enemies, distToPlayer);
        break;
      case 'rocket':
        this.updateRocket(dt, playerPos, enemies, distToPlayer);
        break;
      case 'c4':
        this.updateC4(dt, playerPos, enemies, distToPlayer);
        break;
    }

    this.mesh.position.copy(this.position);

    // 行走动画
    this.walkAnim = (this.walkAnim || 0) + dt * this.speed;
    if (this.mesh.children[4]) {
      this.mesh.children[4].rotation.x = Math.sin(this.walkAnim * 5) * 0.3;
    }
    if (this.mesh.children[5]) {
      this.mesh.children[5].rotation.x = -Math.sin(this.walkAnim * 5) * 0.3;
    }
  }

  // 盾牌队友
  updateShield(dt, playerPos, enemies, distToPlayer) {
    // 移动到玩家前方5-8米，面朝最近敌人
    const forward = new THREE.Vector3()
      .subVectors(this.position, playerPos)
      .setY(0)
      .normalize();

    if (distToPlayer > 8) {
      // 跟随玩家
      this.moveTo(playerPos, dt);
    } else if (distToPlayer < 5) {
      // 太近了，后退
      const back = forward.clone().multiplyScalar(10);
      this.moveTo(playerPos.clone().add(back), dt);
    }

    // 面朝最近敌人
    let nearestEnemy = null;
    let minDist = Infinity;
    enemies.forEach(e => {
      if (e.alive) {
        const d = this.position.distanceTo(e.mesh.position);
        if (d < minDist) { minDist = d; nearestEnemy = e; }
      }
    });
    if (nearestEnemy) {
      this.faceTarget(nearestEnemy.mesh.position);
    }
  }

  // 火箭炮队友
  updateRocket(dt, playerPos, enemies, distToPlayer) {
    // 保持在玩家后方8-12米
    const idealDist = 10;
    if (distToPlayer < idealDist - 2) {
      const away = new THREE.Vector3()
        .subVectors(this.position, playerPos)
        .setY(0)
        .normalize()
        .multiplyScalar(idealDist);
      this.moveTo(playerPos.clone().add(away), dt);
    } else if (distToPlayer > idealDist + 2) {
      this.moveTo(playerPos, dt);
    }

    // 寻找目标（优先攻击密集区域）
    const now = performance.now();
    if (now - this.lastFireTime > this.reloadTime && this.ammo > 0) {
      const target = this.findRocketTarget(enemies);
      if (target) {
        this.lastFireTime = now;
        this.ammo--;
        this.faceTarget(target.mesh.position);
        // 发射火箭
        this.fireRocket(target);
      }
    }
  }

  findRocketTarget(enemies) {
    // 找最密集的敌人位置
    let bestTarget = null;
    let bestScore = 0;

    enemies.forEach(e => {
      if (!e.alive) return;
      let nearby = 0;
      enemies.forEach(e2 => {
        if (e2 !== e && e2.alive && e.mesh.position.distanceTo(e2.mesh.position) < 5) {
          nearby++;
        }
      });
      if (nearby > bestScore) {
        bestScore = nearby;
        bestTarget = e;
      }
    });

    return bestTarget || enemies.find(e => e.alive);
  }

  fireRocket(target) {
    // 创建火箭弹
    const rocketMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
    const rocket = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), rocketMat);
    rocket.position.copy(this.position);
    rocket.position.y += 0.8;
    this.scene.add(rocket);

    const targetPos = target.mesh.position.clone();
    const dir = new THREE.Vector3().subVectors(targetPos, rocket.position).normalize();
    const speed = 25;

    const animate = () => {
      rocket.position.add(dir.clone().multiplyScalar(speed * 0.016));
      if (rocket.position.distanceTo(targetPos) < 2) {
        // 爆炸
        this.createExplosion(rocket.position);
        this.scene.remove(rocket);
        // AOE 伤害
        if (typeof enemyManager !== 'undefined') {
          enemyManager.enemies.forEach(e => {
            if (e.alive && e.mesh.position.distanceTo(targetPos) < 8) {
              e.takeDamage(150);
            }
          });
        }
        return;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  createExplosion(pos) {
    const particleCount = 20;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00 });
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), mat);
      p.position.copy(pos);
      p.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 8,
        (Math.random() - 0.5) * 10
      );
      this.scene.add(p);
      particles.push(p);
    }

    const animate = () => {
      let alive = false;
      particles.forEach(p => {
        p.position.add(p.velocity.clone().multiplyScalar(0.016));
        p.velocity.y -= 15 * 0.016;
        p.material.opacity -= 0.02;
        if (p.material.opacity > 0) alive = true;
      });
      if (alive) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(p => this.scene.remove(p));
      }
    };
    animate();
  }

  // C4 队友
  updateC4(dt, playerPos, enemies, distToPlayer) {
    if (this.fleeing) {
      // 安放C4后跑开
      this.fleeTimer -= dt;
      const away = new THREE.Vector3()
        .subVectors(this.position, playerPos)
        .setY(0)
        .normalize()
        .multiplyScalar(15);
      this.moveTo(playerPos.clone().add(away), dt, this.speed * 1.5);
      if (this.fleeTimer <= 0) {
        this.fleeing = false;
        // 引爆
        this.detonateC4();
      }
      return;
    }

    if (this.planting) {
      this.plantTimer -= dt;
      if (this.plantTimer <= 0) {
        this.planting = false;
        this.fleeing = true;
        this.fleeTimer = 3;
      }
      return;
    }

    // 找最近敌人，冲过去安放C4
    let nearest = null;
    let minDist = Infinity;
    enemies.forEach(e => {
      if (e.alive) {
        const d = this.position.distanceTo(e.mesh.position);
        if (d < minDist) { minDist = d; nearest = e; }
      }
    });

    if (nearest && this.ammo > 0) {
      if (minDist < 5) {
        // 安放C4
        this.planting = true;
        this.plantTimer = 2;
        this.faceTarget(nearest.mesh.position);
      } else {
        this.moveTo(nearest.mesh.position, dt);
      }
    } else {
      // 没有敌人或没有C4了，跟随玩家
      if (distToPlayer > 6) {
        this.moveTo(playerPos, dt);
      }
    }
  }

  detonateC4() {
    this.ammo--;
    const pos = this.position.clone();

    // AOE 伤害
    if (typeof enemyManager !== 'undefined') {
      enemyManager.enemies.forEach(e => {
        if (e.alive && e.mesh.position.distanceTo(pos) < 8) {
          e.takeDamage(300);
        }
      });
    }

    // 爆炸效果
    this.createExplosion(pos);
  }

  moveTo(target, dt, speed) {
    const dir = new THREE.Vector3()
      .subVectors(target, this.position)
      .setY(0)
      .normalize();

    const s = speed || this.speed;
    this.position.x += dir.x * s * dt;
    this.position.z += dir.z * s * dt;
    this.faceTarget(target);
  }

  faceTarget(target) {
    const dir = new THREE.Vector3()
      .subVectors(target, this.position)
      .setY(0)
      .normalize();
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }
}

class TeammateManager {
  constructor(scene) {
    this.scene = scene;
    this.teammates = [];
  }

  spawnRandom(spawnPoint) {
    const types = ['shield', 'rocket', 'c4'];
    // 随机打乱顺序
    const shuffled = types.sort(() => Math.random() - 0.5);

    const offsets = [
      { x: -3, z: 2 },
      { x: 0, z: 3 },
      { x: 3, z: 2 },
    ];

    shuffled.forEach((type, i) => {
      const pos = {
        x: spawnPoint.x + offsets[i].x,
        y: spawnPoint.y || 1.7,
        z: spawnPoint.z + offsets[i].z,
      };
      const tm = new Teammate(type, pos, this.scene);
      this.teammates.push(tm);
    });

    return this.teammates;
  }

  update(dt, playerPos, enemies) {
    this.teammates.forEach(tm => {
      tm.update(dt, playerPos, enemies);
    });
  }

  getStatus() {
    return this.teammates.map(tm => ({
      type: tm.type,
      hp: tm.hp,
      maxHp: tm.maxHp,
      ammo: tm.ammo,
      alive: tm.alive,
    }));
  }

  clear() {
    this.teammates.forEach(tm => {
      if (tm.mesh.parent) tm.scene.remove(tm.mesh);
    });
    this.teammates = [];
  }
}
