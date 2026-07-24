import * as THREE from 'three';
import { EventBus } from '../core/EventBus.js';
import { InteractableEntity } from './InteractableEntity.js';

// 动物类型定义
const ANIMAL_TYPES = {
  deer: {
    name: '鹿',
    bodyColor: 0x8b6914,
    bodySize: [0.6, 0.5, 1.2],
    speed: 3,
    hp: 30,
    drops: { rawMeat: 3, animalSkin: 1 },
    fleeDistance: 15,
    nightActive: false,
  },
  rabbit: {
    name: '兔子',
    bodyColor: 0xaa9977,
    bodySize: [0.25, 0.25, 0.4],
    speed: 5,
    hp: 10,
    drops: { rawMeat: 1 },
    fleeDistance: 12,
    nightActive: false,
  },
  wolf: {
    name: '狼',
    bodyColor: 0x555555,
    bodySize: [0.4, 0.4, 0.9],
    speed: 4,
    hp: 40,
    drops: { rawMeat: 2, animalSkin: 1 },
    fleeDistance: 0, // 不逃跑
    nightActive: true,
    attackDamage: 8,
    attackRange: 2.5,
    aggroRange: 12,
  },
};

export class Animal {
  constructor(scene, type, position, worldGen) {
    this.scene = scene;
    this.type = type;
    this.def = ANIMAL_TYPES[type];
    this.position = position.clone();
    this.position.y = worldGen.getHeightAt(position.x, position.z);
    this.worldGen = worldGen;

    this.hp = this.def.hp;
    this.alive = true;
    this.state = 'idle'; // idle, wander, flee, attack, dead
    this.velocity = new THREE.Vector3();
    this.targetPos = null;
    this.stateTimer = 0;
    this.fleeTarget = null;

    this.createMesh();
  }

  createMesh() {
    this.group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: this.def.bodyColor, roughness: 0.8 });

    // 身体
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(...this.def.bodySize),
      bodyMat
    );
    body.position.y = this.def.bodySize[1] + 0.1;
    body.castShadow = true;
    this.group.add(body);
    this.bodyMesh = body;

    // 头
    const headSize = this.def.bodySize[0] * 0.7;
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(headSize, headSize, headSize),
      bodyMat
    );
    head.position.set(0, this.def.bodySize[1] + 0.15, -this.def.bodySize[2] * 0.5 - headSize * 0.3);
    this.group.add(head);

    // 腿
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 4);
    const legPositions = [
      [-this.def.bodySize[0] * 0.3, 0.15, -this.def.bodySize[2] * 0.3],
      [this.def.bodySize[0] * 0.3, 0.15, -this.def.bodySize[2] * 0.3],
      [-this.def.bodySize[0] * 0.3, 0.15, this.def.bodySize[2] * 0.3],
      [this.def.bodySize[0] * 0.3, 0.15, this.def.bodySize[2] * 0.3],
    ];
    this.legs = [];
    for (const pos of legPositions) {
      const leg = new THREE.Mesh(legGeo, bodyMat);
      leg.position.set(...pos);
      this.group.add(leg);
      this.legs.push(leg);
    }

    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  update(deltaTime, playerPos, isNight) {
    if (!this.alive) return;

    // 夜间动物行为检查
    if (isNight && !this.def.nightActive) {
      // 白天动物在夜间休息
      this.state = 'idle';
      return;
    }

    // 检查是否被攻击
    if (this.state === 'flee' && this.fleeTarget) {
      const dir = this.position.clone().sub(this.fleeTarget).normalize();
      this.velocity.set(dir.x * this.def.speed, 0, dir.z * this.def.speed);
      this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

      // 朝向移动方向
      this.group.rotation.y = Math.atan2(dir.x, dir.z);

      // 跑够距离后恢复漫游
      if (this.position.distanceTo(this.fleeTarget) > this.def.fleeDistance) {
        this.state = 'wander';
        this.fleeTarget = null;
      }
    } else if (this.state === 'attack' && playerPos) {
      // 狼追击玩家
      const dir = playerPos.clone().sub(this.position);
      dir.y = 0;
      const dist = dir.length();

      if (dist <= this.def.attackRange) {
        // 攻击
        this.stateTimer -= deltaTime;
        if (this.stateTimer <= 0) {
          EventBus.emit('animal:attack', { damage: this.def.attackDamage });
          this.stateTimer = 1.5;
        }
      } else {
        dir.normalize();
        this.velocity.set(dir.x * this.def.speed, 0, dir.z * this.def.speed);
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.group.rotation.y = Math.atan2(dir.x, dir.z);
      }
    } else {
      // 漫游
      this.stateTimer -= deltaTime;
      if (this.stateTimer <= 0 || !this.targetPos) {
        // 随机选一个新目标点
        const angle = Math.random() * Math.PI * 2;
        const dist = 5 + Math.random() * 15;
        this.targetPos = new THREE.Vector3(
          this.position.x + Math.cos(angle) * dist,
          0,
          this.position.z + Math.sin(angle) * dist
        );
        this.targetPos.y = this.worldGen.getHeightAt(this.targetPos.x, this.targetPos.z);
        this.stateTimer = 3 + Math.random() * 4;
      }

      const dir = this.targetPos.clone().sub(this.position);
      dir.y = 0;
      if (dir.length() > 0.5) {
        dir.normalize();
        this.velocity.set(dir.x * this.def.speed * 0.3, 0, dir.z * this.def.speed * 0.3);
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.group.rotation.y = Math.atan2(dir.x, dir.z);
      }
    }

    // 边界限制
    this.position.x = Math.max(-180, Math.min(180, this.position.x));
    this.position.z = Math.max(-180, Math.min(180, this.position.z));

    // 地面高度
    this.position.y = this.worldGen.getHeightAt(this.position.x, this.position.z);

    this.group.position.copy(this.position);

    // 腿部动画
    const walkCycle = Date.now() * 0.008;
    this.legs.forEach((leg, i) => {
      leg.rotation.x = Math.sin(walkCycle + i * Math.PI) * 0.3;
    });
  }

  takeDamage(damage, attackerPos) {
    this.hp -= damage;

    if (this.hp <= 0) {
      this.die();
      return;
    }

    // 逃跑
    if (this.def.fleeDistance > 0) {
      this.state = 'flee';
      this.fleeTarget = attackerPos;
    } else if (this.def.aggroRange) {
      // 狼被攻击后更愤怒
      this.state = 'attack';
    }
  }

  die() {
    this.alive = false;
    this.state = 'dead';

    // 掉落物品
    EventBus.emit('animal:killed', {
      type: this.type,
      name: this.def.name,
      drops: this.def.drops,
      position: this.position.clone(),
    });

    // 简单死亡动画：倒下
    this.group.rotation.x = Math.PI / 2;
    this.group.position.y -= 0.2;

    // 3秒后移除
    setTimeout(() => {
      this.scene.remove(this.group);
    }, 3000);
  }

  checkAggro(playerPos) {
    if (!this.def.aggroRange || !this.alive) return;
    if (this.state === 'attack' || this.state === 'flee') return;

    const dist = this.position.distanceTo(playerPos);
    if (dist < this.def.aggroRange) {
      this.state = 'attack';
      this.stateTimer = 0;
    }
  }

  getMesh() {
    return this.bodyMesh;
  }

  isAlive() {
    return this.alive;
  }
}
