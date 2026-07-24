// ========== 玩家控制 ==========
class Player {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.hp = 100;
    this.maxHp = 100;
    this.armor = 100;
    this.maxArmor = 100;
    this.speed = 8;
    this.sprintSpeed = 13;
    this.jumpForce = 8;
    this.gravity = -20;
    this.velocityY = 0;
    this.onGround = true;
    this.height = 1.7;

    // 位置
    this.position = new THREE.Vector3(0, this.height, 10);
    this.camera.position.copy(this.position);

    // 视角
    this.pitch = 0;
    this.yaw = 0;
    this.sensitivity = 0.002;
    this.maxPitch = Math.PI / 2 - 0.1;

    // 移动
    this.moveForward = false;
    this.moveBack = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.sprinting = false;

    // 武器
    this.currentWeapon = null;
    this.currentKnife = null;
    this.activeSlot = 'gun'; // 'gun' or 'knife'
    this.isReloading = false;
    this.lastFireTime = 0;
    this.ammo = 0;
    this.reserveAmmo = 0;
    this.isZoomed = false;
    this.isMeleeing = false;
    this.meleeTimer = 0;

    // 状态
    this.alive = true;
    this.isShooting = false;

    // 武器模型
    this.weaponGroup = new THREE.Group();
    this.weaponGroup.name = 'weaponModel';
    this.camera.add(this.weaponGroup);
    this.buildGunModel();

    this.controlsSetup();
  }

  buildGunModel() {
    // 清除旧模型
    while (this.weaponGroup.children.length) {
      this.weaponGroup.remove(this.weaponGroup.children[0]);
    }

    const mat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const mat2 = new THREE.MeshLambertMaterial({ color: 0x444444 });

    // 枪身
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.4), mat);
    body.position.set(0.15, -0.1, -0.3);
    this.weaponGroup.add(body);

    // 枪管
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), mat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0.15, -0.08, -0.55);
    this.weaponGroup.add(barrel);

    // 握把
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), mat2);
    grip.position.set(0.15, -0.16, -0.25);
    grip.rotation.x = -0.2;
    this.weaponGroup.add(grip);

    // 弹匣
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.04), mat);
    mag.position.set(0.15, -0.18, -0.32);
    mag.rotation.x = 0.15;
    this.weaponGroup.add(mag);

    // 瞄准镜
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8), mat2);
    scope.position.set(0.15, -0.03, -0.3);
    scope.rotation.z = Math.PI / 2;
    this.weaponGroup.add(scope);
  }

  buildKnifeModel() {
    while (this.weaponGroup.children.length) {
      this.weaponGroup.remove(this.weaponGroup.children[0]);
    }

    const bladeMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x3d2b1f });

    // 刀刃
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.2), bladeMat);
    blade.position.set(0.2, -0.1, -0.3);
    this.weaponGroup.add(blade);

    // 刀柄
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), handleMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0.2, -0.1, -0.18);
    this.weaponGroup.add(handle);
  }

  equipWeapon(weapon) {
    this.currentWeapon = weapon;
    this.ammo = weapon.magSize;
    this.reserveAmmo = weapon.magSize * 3;
    this.buildGunModel();
  }

  equipKnife(knife) {
    this.currentKnife = knife;
  }

  controlsSetup() {
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onKeyDown(e) {
    if (!this.alive) return;
    switch (e.code) {
      case 'KeyW': this.moveForward = true; break;
      case 'KeyS': this.moveBack = true; break;
      case 'KeyA': this.moveLeft = true; break;
      case 'KeyD': this.moveRight = true; break;
      case 'ShiftLeft': this.sprinting = true; break;
      case 'Space':
        if (this.onGround) { this.velocityY = this.jumpForce; this.onGround = false; }
        break;
      case 'KeyR': this.reload(); break;
      case 'Digit1': this.switchToGun(); break;
      case 'Digit2': this.switchToKnife(); break;
      case 'Escape':
        if (typeof togglePause === 'function') togglePause();
        break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'KeyW': this.moveForward = false; break;
      case 'KeyS': this.moveBack = false; break;
      case 'KeyA': this.moveLeft = false; break;
      case 'KeyD': this.moveRight = false; break;
      case 'ShiftLeft': this.sprinting = false; break;
    }
  }

  onMouseMove(e) {
    if (!this.alive || !this.locked) return;
    this.yaw -= e.movementX * this.sensitivity;
    this.pitch -= e.movementY * this.sensitivity;
    this.pitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.pitch));
  }

  onMouseDown(e) {
    if (!this.alive || !this.locked) return;
    if (e.button === 0) {
      if (this.activeSlot === 'knife') {
        this.startMelee();
      } else {
        this.isShooting = true;
      }
    }
    if (e.button === 2) {
      if (this.activeSlot === 'gun' && this.currentWeapon) {
        this.toggleZoom();
      } else {
        this.startMelee();
      }
    }
  }

  onMouseUp(e) {
    if (e.button === 0) this.isShooting = false;
  }

  switchToGun() {
    if (this.currentWeapon) {
      this.activeSlot = 'gun';
      this.isZoomed = false;
      this.buildGunModel();
      document.getElementById('scope-overlay').style.display = 'none';
    }
  }

  switchToKnife() {
    this.activeSlot = 'knife';
    this.isZoomed = false;
    this.buildKnifeModel();
    document.getElementById('scope-overlay').style.display = 'none';
  }

  startMelee() {
    if (this.isMeleeing || !this.currentKnife) return;
    this.isMeleeing = true;
    this.meleeTimer = 0.4;
    this.meleeStartRot = this.weaponGroup.rotation.x;
  }

  reload() {
    if (this.isReloading || !this.currentWeapon) return;
    if (this.ammo >= this.currentWeapon.magSize) return;
    if (this.reserveAmmo <= 0) return;

    this.isReloading = true;
    setTimeout(() => {
      const needed = this.currentWeapon.magSize - this.ammo;
      const loaded = Math.min(needed, this.reserveAmmo);
      this.ammo += loaded;
      this.reserveAmmo -= loaded;
      this.isReloading = false;
    }, 1500);
  }

  toggleZoom() {
    if (!this.currentWeapon) return;
    this.isZoomed = !this.isZoomed;
    document.getElementById('scope-overlay').style.display = this.isZoomed ? 'flex' : 'none';
  }

  shoot() {
    if (!this.alive || !this.currentWeapon || this.isReloading || this.isMeleeing) return;
    if (!this.currentWeapon) return;

    const now = performance.now();
    const interval = getFireInterval(this.currentWeapon);
    if (now - this.lastFireTime < interval) return;
    if (this.ammo <= 0) {
      this.reload();
      return;
    }

    this.lastFireTime = now;
    this.ammo--;

    // 后坐力
    this.pitch += this.currentWeapon.recoil * 0.0003;
    this.weaponGroup.position.z += 0.03;
    setTimeout(() => { this.weaponGroup.position.z = 0; }, 50);

    // 返回射线检测结果
    return this.castRay();
  }

  castRay() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    raycaster.far = (this.currentWeapon.range || 50) * 2;

    // 偏移（模拟散布）
    const spread = this.currentWeapon.recoil * 0.0005;
    const dir = raycaster.ray.direction;
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.normalize();

    return raycaster;
  }

  meleeAttack() {
    if (!this.alive || !this.currentKnife) return null;

    // 近战范围检测
    const raycaster = new THREE.Raycaster();
    raycaster.set(new THREE.Vector3().copy(this.position), this.camera.getWorldDirection(new THREE.Vector3()));
    raycaster.far = this.currentKnife.range;
    return raycaster;
  }

  takeDamage(amount) {
    if (!this.alive) return;

    // 护甲吸收50%
    if (this.armor > 0) {
      const armorDmg = Math.min(amount * 0.5, this.armor);
      this.armor -= armorDmg;
      amount -= armorDmg;
    }

    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  update(dt) {
    if (!this.alive) return;

    // 移动
    const speed = this.sprinting ? this.sprintSpeed : this.speed;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const move = new THREE.Vector3();
    if (this.moveForward) move.add(forward);
    if (this.moveBack) move.sub(forward);
    if (this.moveRight) move.add(right);
    if (this.moveLeft) move.sub(right);

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * dt);
      this.position.add(move);
    }

    // 重力
    if (!this.onGround) {
      this.velocityY += this.gravity * dt;
      this.position.y += this.velocityY * dt;
      if (this.position.y <= this.height) {
        this.position.y = this.height;
        this.velocityY = 0;
        this.onGround = true;
      }
    }

    // 地图边界
    this.position.x = Math.max(-48, Math.min(48, this.position.x));
    this.position.z = Math.max(-48, Math.min(48, this.position.z));

    // 更新相机
    this.camera.position.copy(this.position);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

    // 武器视角
    if (this.currentWeapon && this.isZoomed) {
      this.camera.fov = 30;
    } else {
      this.camera.fov = 75;
    }
    this.camera.updateProjectionMatrix();

    // 近战动画
    if (this.isMeleeing) {
      this.meleeTimer -= dt;
      if (this.meleeTimer > 0.2) {
        this.weaponGroup.rotation.x -= dt * 8;
      } else if (this.meleeTimer > 0) {
        this.weaponGroup.rotation.x += dt * 8;
        // 在挥刀中点造成伤害
        if (!this.meleeDamageApplied) {
          this.meleeDamageApplied = true;
          this.meleeReady = true;
        }
      } else {
        this.weaponGroup.rotation.x = this.meleeStartRot || 0;
        this.isMeleeing = false;
        this.meleeDamageApplied = false;
        this.meleeReady = false;
      }
    }
  }

  respawn(spawnPoint) {
    this.hp = this.maxHp;
    this.armor = this.maxArmor;
    this.alive = true;
    this.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);
    this.velocityY = 0;
    this.onGround = true;
    this.isZoomed = false;
    this.isShooting = false;
    document.getElementById('scope-overlay').style.display = 'none';
  }
}
