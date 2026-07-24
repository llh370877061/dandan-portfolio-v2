import * as THREE from 'three';

export class WorldItem {
  constructor(scene, itemId, count, position) {
    this.scene = scene;
    this.itemId = itemId;
    this.count = count;
    this.position = position;
    this.collected = false;

    this.createMesh();
  }

  createMesh() {
    // 根据物品类型创建不同的几何体
    const colors = {
      knife: 0xaaaaaa,
      pistol: 0x555555,
      diary: 0x8b6914,
      cup: 0xdddddd,
      kettle: 0x666666,
      campfireTool: 0x888888,
      axe: 0x888888,
      sleepingBag: 0x556644,
      wood: 0x6b4226,
      rawMeat: 0xcc4444,
      cookedMeat: 0x8b4513,
      soup: 0xddaa44,
      hotWater: 0x88bbcc,
      animalSkin: 0x8b6914,
      predecessorNote: 0xddccaa,
      forestMap: 0xccbb88,
    };

    const color = colors[this.itemId] || 0xffffff;

    // 基础物品是一个小方块
    const geo = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.1,
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(this.position);
    this.mesh.position.y += 0.2;
    this.mesh.castShadow = true;
    this.mesh.userData = { type: 'worldItem', itemId: this.itemId, count: this.count };
    this.scene.add(this.mesh);

    // 发光提示
    const glowGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.15,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.glow.position.copy(this.mesh.position);
    this.scene.add(this.glow);
  }

  update(deltaTime) {
    if (this.collected) return;
    // 轻微浮动
    const t = Date.now() * 0.002;
    this.mesh.position.y = this.position.y + 0.2 + Math.sin(t) * 0.05;
    this.mesh.rotation.y += deltaTime * 0.5;
    this.glow.position.y = this.mesh.position.y;
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
    this.scene.remove(this.mesh);
    this.scene.remove(this.glow);
  }

  getMesh() {
    return this.mesh;
  }
}
