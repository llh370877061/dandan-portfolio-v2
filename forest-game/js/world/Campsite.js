import * as THREE from 'three';

export class Campsite {
  constructor(scene, worldGen, physics) {
    this.scene = scene;
    this.worldGen = worldGen;
    this.group = new THREE.Group();

    // 营地位置（远离中心）
    this.position = new THREE.Vector3(-25, 0, 20);
    this.position.y = worldGen.getHeightAt(this.position.x, this.position.z);

    this.build();
    scene.add(this.group);

    physics.addCircleCollider(this.position.x, this.position.z, 3);
  }

  build() {
    const baseY = this.position.y;

    // 帐篷（简易三角形）
    const tentMat = new THREE.MeshStandardMaterial({ color: 0x556644, roughness: 0.9, side: THREE.DoubleSide });

    // 帐篷主体
    const tentShape = new THREE.Shape();
    tentShape.moveTo(-2, 0);
    tentShape.lineTo(0, 2.2);
    tentShape.lineTo(2, 0);
    tentShape.lineTo(-2, 0);

    const tentGeo = new THREE.ExtrudeGeometry(tentShape, { depth: 3, bevelEnabled: false });
    const tent = new THREE.Mesh(tentGeo, tentMat);
    tent.position.set(this.position.x - 1.5, baseY, this.position.z - 1.5);
    tent.rotation.y = 0.3;
    tent.castShadow = true;
    this.group.add(tent);

    // 散落的物品（小方块代表笔记、罐头等）
    const itemMat = new THREE.MeshStandardMaterial({ color: 0x888866 });
    const itemMat2 = new THREE.MeshStandardMaterial({ color: 0x997755 });

    for (let i = 0; i < 5; i++) {
      const item = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.05, 0.1),
        i % 2 === 0 ? itemMat : itemMat2
      );
      item.position.set(
        this.position.x + (Math.random() - 0.5) * 3,
        baseY + 0.05,
        this.position.z + (Math.random() - 0.5) * 3
      );
      item.rotation.y = Math.random() * Math.PI;
      this.group.add(item);
    }

    // 上锁的箱子
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.85 });
    const boxGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    this.lockedBox = new THREE.Mesh(boxGeo, boxMat);
    this.lockedBox.position.set(this.position.x + 2, baseY + 0.25, this.position.z);
    this.lockedBox.castShadow = true;
    this.group.add(this.lockedBox);

    // 锁
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 });
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), lockMat);
    lock.position.set(this.position.x + 2, baseY + 0.35, this.position.z + 0.31);
    this.group.add(lock);

    // 墙上刻痕（天数记录）
    // 用一个小标记代替
    const markMat = new THREE.MeshStandardMaterial({ color: 0xaa9977 });
    for (let i = 0; i < 12; i++) {
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.15, 0.02),
        markMat
      );
      mark.position.set(
        this.position.x - 3 + i * 0.2,
        baseY + 1 + Math.sin(i * 0.8) * 0.3,
        this.position.z - 2.8
      );
      this.group.add(mark);
    }

    // 篝火遗迹
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1 });
    const ash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.5, 0.05, 8),
      ashMat
    );
    ash.position.set(this.position.x, baseY + 0.02, this.position.z + 2);
    this.group.add(ash);

    // 树根部的隐藏补给点
    this.hiddenStash = new THREE.Vector3(this.position.x + 5, baseY, this.position.z - 3);
  }

  getLockedBox() {
    return this.lockedBox;
  }

  getHiddenStash() {
    return this.hiddenStash;
  }

  getPosition() {
    return this.position;
  }
}
