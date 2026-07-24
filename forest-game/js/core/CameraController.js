import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { EventBus } from './EventBus.js';

export class CameraController {
  constructor(camera, inputManager) {
    this.camera = camera;
    this.input = inputManager;

    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.euler.setFromQuaternion(this.camera.quaternion);

    // 碰撞用的玩家包围盒
    this.playerRadius = 0.35;
    this.position = new THREE.Vector3(0, CONFIG.PLAYER_EYE_HEIGHT, 0);
    this.onPlatform = false;

    // 速度
    this.velocity = new THREE.Vector3();
    this.moveDirection = new THREE.Vector3();
    this.isMoving = false;
    this.isRunning = false;
  }

  update(deltaTime) {
    if (!this.input.isPointerLocked) return;

    // 鼠标视角
    const mouseDelta = this.input.getMouseDelta();
    this.euler.y -= mouseDelta.x * CONFIG.MOUSE_SENSITIVITY;
    this.euler.x -= mouseDelta.y * CONFIG.MOUSE_SENSITIVITY;
    this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);

    // 移动
    const speed = this.input.isSprinting() ? CONFIG.PLAYER_SPRINT_SPEED : CONFIG.PLAYER_SPEED;
    this.isRunning = this.input.isSprinting();

    this.moveDirection.set(0, 0, 0);

    if (this.input.isKeyDown(CONFIG.KEYS.FORWARD)) this.moveDirection.z -= 1;
    if (this.input.isKeyDown(CONFIG.KEYS.BACKWARD)) this.moveDirection.z += 1;
    if (this.input.isKeyDown(CONFIG.KEYS.LEFT)) this.moveDirection.x -= 1;
    if (this.input.isKeyDown(CONFIG.KEYS.RIGHT)) this.moveDirection.x += 1;

    this.isMoving = this.moveDirection.length() > 0;

    if (this.isMoving) {
      this.moveDirection.normalize();

      // 根据相机朝向计算移动向量（忽略 Y 轴旋转）
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      this.velocity.x = (forward.x * -this.moveDirection.z + right.x * this.moveDirection.x) * speed;
      this.velocity.z = (forward.z * -this.moveDirection.z + right.z * this.moveDirection.x) * speed;
    } else {
      this.velocity.x *= 0.85;
      this.velocity.z *= 0.85;
    }

    // 计算新位置
    const newPos = this.position.clone();
    newPos.x += this.velocity.x * deltaTime;
    newPos.z += this.velocity.z * deltaTime;

    // 边界限制
    const B = CONFIG.BOUNDARY;
    newPos.x = Math.max(-B, Math.min(B, newPos.x));
    newPos.z = Math.max(-B, Math.min(B, newPos.z));

    // 碰撞检测（通过事件让 Physics 处理）
    const collision = { x: newPos.x, z: newPos.z };
    EventBus.emit('physics:checkCollision', {
      x: this.position.x,
      z: this.position.z,
      newX: newPos.x,
      newZ: newPos.z,
      radius: this.playerRadius,
      result: collision,
    });

    this.position.x = collision.x;
    this.position.z = collision.z;
    // 保持梯子传送后的高度，否则用默认眼高
    if (!this.onPlatform) {
      this.position.y = CONFIG.PLAYER_EYE_HEIGHT;
    }

    this.camera.position.copy(this.position);

    // 广播玩家位置
    EventBus.emit('player:move', {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      isMoving: this.isMoving,
      isRunning: this.isRunning,
    });
  }

  getPosition() {
    return this.position.clone();
  }

  getDirection() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    return dir;
  }

  getYRotation() {
    return this.euler.y;
  }
}
