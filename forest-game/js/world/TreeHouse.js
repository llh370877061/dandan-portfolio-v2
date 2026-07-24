import * as THREE from 'three';

export class TreeHouse {
  constructor(scene, worldGen, physics) {
    this.scene = scene;
    this.worldGen = worldGen;
    this.group = new THREE.Group();

    // 树屋位置（稍微偏离中心）
    this.position = new THREE.Vector3(8, 0, -10);
    this.position.y = worldGen.getHeightAt(this.position.x, this.position.z);

    this.build();
    scene.add(this.group);

    // 碰撞体（树干）
    physics.addCircleCollider(this.position.x, this.position.z, 1.2);
  }

  build() {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.9 });
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.95 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.85 });

    const baseY = this.position.y;

    // 粗壮的基座树干
    const trunkGeo = new THREE.CylinderGeometry(0.6, 0.8, 10, 8);
    const trunk = new THREE.Mesh(trunkGeo, darkWood);
    trunk.position.set(this.position.x, baseY + 5, this.position.z);
    trunk.castShadow = true;
    this.group.add(trunk);

    // 平台（8m 高）
    const platformY = baseY + 8;
    const platGeo = new THREE.BoxGeometry(5, 0.2, 5);
    const platform = new THREE.Mesh(platGeo, woodMat);
    platform.position.set(this.position.x, platformY, this.position.z);
    platform.receiveShadow = true;
    this.group.add(platform);

    // 四面墙（留门和窗）
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x7a5236, roughness: 0.88 });
    const wallH = 2.5;
    const wallThick = 0.15;

    // 后墙
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(5, wallH, wallThick), wallMat);
    backWall.position.set(this.position.x, platformY + wallH / 2 + 0.1, this.position.z - 2.4);
    this.group.add(backWall);

    // 左墙
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, 5), wallMat);
    leftWall.position.set(this.position.x - 2.4, platformY + wallH / 2 + 0.1, this.position.z);
    this.group.add(leftWall);

    // 右墙（留窗）
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, 5), wallMat);
    rightWall.position.set(this.position.x + 2.4, platformY + wallH / 2 + 0.1, this.position.z);
    this.group.add(rightWall);

    // 前墙下半部分（门在中间）
    const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, wallH * 0.6, wallThick), wallMat);
    frontLeft.position.set(this.position.x - 1.75, platformY + wallH * 0.3 + 0.1, this.position.z + 2.4);
    this.group.add(frontLeft);

    const frontRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, wallH * 0.6, wallThick), wallMat);
    frontRight.position.set(this.position.x + 1.75, platformY + wallH * 0.3 + 0.1, this.position.z + 2.4);
    this.group.add(frontRight);

    // 屋顶（双坡）
    const roofGeo = new THREE.ConeGeometry(4, 2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(this.position.x, platformY + wallH + 1, this.position.z);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    this.group.add(roof);

    // 梯子
    this.createLadder(baseY, platformY);

    // 内部物品位置（都在树屋平台上）
    this.boxPosition = new THREE.Vector3(this.position.x + 1.5, platformY + 0.3, this.position.z - 1.5);
    this.sleepPosition = new THREE.Vector3(this.position.x - 1, platformY + 0.3, this.position.z - 1);
    this.firePosition = new THREE.Vector3(this.position.x - 1, platformY + 0.1, this.position.z + 1);

    // 篝火（在树屋平台上）
    this.createCampfire(platformY);
  }

  createLadder(baseY, platformY) {
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x6b4226 });

    const ladderX = this.position.x + 2;
    const ladderZ = this.position.z + 2.5;
    const height = platformY - baseY;
    const steps = Math.floor(height / 0.4);

    for (let i = 0; i < steps; i++) {
      const y = baseY + i * 0.4 + 0.2;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.06, 0.12),
        stepMat
      );
      step.position.set(ladderX, y, ladderZ);
      this.group.add(step);
    }

    // 两根绳子
    for (const offset of [-0.2, 0.2]) {
      const rope = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, height, 4),
        ropeMat
      );
      rope.position.set(ladderX + offset, baseY + height / 2, ladderZ);
      this.group.add(rope);
    }

    // 梯子交互区域
    this.ladderArea = {
      x: ladderX,
      z: ladderZ,
      radius: 1,
      baseY,
      topY: platformY,
    };

    // 梯子发光标记（帮助玩家在雾中找到梯子）
    const glowGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.6,
    });
    this.ladderGlow = new THREE.Mesh(glowGeo, glowMat);
    this.ladderGlow.position.set(ladderX, baseY + 1.5, ladderZ);
    this.scene.add(this.ladderGlow);

    // 脉冲动画
    const pulse = () => {
      const t = Date.now() * 0.003;
      this.ladderGlow.material.opacity = 0.3 + Math.sin(t) * 0.3;
      this.ladderGlow.scale.setScalar(1 + Math.sin(t) * 0.2);
      requestAnimationFrame(pulse);
    };
    pulse();
  }

  createCampfire(baseY) {
    // 石头圈
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.95 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const stone = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.15, 0),
        stoneMat
      );
      stone.position.set(
        this.firePosition.x + Math.cos(angle) * 0.5,
        baseY + 0.1,
        this.firePosition.z + Math.sin(angle) * 0.5
      );
      stone.scale.set(1, 0.6, 1);
      this.group.add(stone);
    }

    // 木柴
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6),
        woodMat
      );
      log.position.set(
        this.firePosition.x + (Math.random() - 0.5) * 0.2,
        baseY + 0.08,
        this.firePosition.z + (Math.random() - 0.5) * 0.2
      );
      log.rotation.z = Math.PI / 2;
      log.rotation.y = Math.random() * Math.PI;
      this.group.add(log);
    }

    // 篝火光（点光源）
    this.fireLight = new THREE.PointLight(0xff6622, 0, 12, 2);
    this.fireLight.position.set(this.firePosition.x, baseY + 1, this.firePosition.z);
    this.group.add(this.fireLight);
  }

  setFireActive(active) {
    this.fireLight.intensity = active ? 1.5 : 0;
  }

  getLadderArea() {
    return this.ladderArea;
  }

  getBoxPosition() {
    return this.boxPosition;
  }

  getSleepPosition() {
    return this.sleepPosition;
  }

  getFirePosition() {
    return this.firePosition;
  }
}
