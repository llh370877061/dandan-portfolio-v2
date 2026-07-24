import * as THREE from 'three';
import { CONFIG } from '../config.js';

export class ForestGenerator {
  constructor(scene, worldGen, physics) {
    this.scene = scene;
    this.worldGen = worldGen;
    this.physics = physics;

    this.TREE_COUNT = CONFIG.TREE_COUNT;
    this.FOREST_RADIUS = CONFIG.FOREST_RADIUS;
    this.MIN_SPACING = CONFIG.MIN_TREE_SPACING;

    this.trees = [];          // 所有树的位置数据（碰撞用）
    this.specialTrees = [];   // 可交互的树

    this.generate();
    this.createSpecialTrees();
  }

  generate() {
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.3, 5, 8);
    const crownGeo = new THREE.ConeGeometry(2.8, 6, 8);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.95,
    });
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0x1a4a12,
      roughness: 0.85,
    });

    const trunkInstances = new THREE.InstancedMesh(trunkGeo, trunkMat, this.TREE_COUNT);
    const crownInstances = new THREE.InstancedMesh(crownGeo, crownMat, this.TREE_COUNT);
    trunkInstances.castShadow = true;
    crownInstances.castShadow = true;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.TREE_COUNT; i++) {
      let x, z;
      let attempts = 0;

      do {
        x = (Math.random() - 0.5) * this.FOREST_RADIUS * 2;
        z = (Math.random() - 0.5) * this.FOREST_RADIUS * 2;
        attempts++;
      } while (this.isTooClose(x, z) && attempts < 80);

      const y = this.worldGen.getHeightAt(x, z);
      const scale = 0.7 + Math.random() * 0.7;
      const rotY = Math.random() * Math.PI * 2;

      // 树干
      dummy.position.set(x, y + 2.5 * scale, z);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      trunkInstances.setMatrixAt(i, dummy.matrix);

      // 树冠
      dummy.position.set(x, y + 5 * scale + 1, z);
      dummy.updateMatrix();
      crownInstances.setMatrixAt(i, dummy.matrix);

      this.trees.push({
        x, z, y,
        radius: 0.35 * scale,
        scale,
        alive: true,
        index: i,
      });

      // 加碰撞
      this.physics.addCircleCollider(x, z, 0.35 * scale);
    }

    this.scene.add(trunkInstances);
    this.scene.add(crownInstances);
    this.trunkInstances = trunkInstances;
    this.crownInstances = crownInstances;
  }

  isTooClose(x, z) {
    for (const t of this.trees) {
      const dx = t.x - x;
      const dz = t.z - z;
      if (Math.sqrt(dx * dx + dz * dz) < this.MIN_SPACING) return true;
    }
    // 中心附近不放树
    if (Math.sqrt(x * x + z * z) < 15) return true;
    // 树屋附近安全区（梯子在10, -7.5附近）
    const treeHouseDist = Math.sqrt((x - 8) * (x - 8) + (z + 10) * (z + 10));
    if (treeHouseDist < 15) return true;
    // 营地附近安全区
    const campDist = Math.sqrt((x + 25) * (x + 25) + (z - 20) * (z - 20));
    if (campDist < 10) return true;
    // 从出生点到梯子的路径安全区
    const pathDist = this.distToPath(x, z);
    if (pathDist < 2) return true;
    return false;
  }

  // 计算点到路径的距离（出生点0,0到梯子10,-7.5的直线）
  distToPath(x, z) {
    // 路径：从(0,0)到(10,-7.5)的线段
    const ax = 0, az = 0;
    const bx = 10, bz = -7.5;
    const dx = bx - ax, dz = bz - az;
    const len2 = dx * dx + dz * dz;
    let t = ((x - ax) * dx + (z - az) * dz) / len2;
    t = Math.max(0, Math.min(1, t));
    const closestX = ax + t * dx;
    const closestZ = az + t * dz;
    return Math.sqrt((x - closestX) * (x - closestX) + (z - closestZ) * (z - closestZ));
  }

  createSpecialTrees() {
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 6, 8);
    const crownGeo = new THREE.ConeGeometry(3, 7, 8);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4738, roughness: 0.9 });
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x1a5a12, roughness: 0.85 });

    for (let i = 0; i < CONFIG.SPECIAL_TREE_COUNT; i++) {
      let x, z;
      let attempts = 0;
      do {
        x = (Math.random() - 0.5) * this.FOREST_RADIUS * 1.5;
        z = (Math.random() - 0.5) * this.FOREST_RADIUS * 1.5;
        attempts++;
      } while (this.isTooClose(x, z) && attempts < 80);

      const y = this.worldGen.getHeightAt(x, z);
      const scale = 0.8 + Math.random() * 0.5;

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, y + 3 * scale, z);
      trunk.scale.set(scale, scale, scale);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.set(x, y + 6 * scale + 1.5, z);
      crown.scale.set(scale, scale, scale);
      crown.castShadow = true;
      this.scene.add(crown);

      const treeData = {
        x, z, y,
        radius: 0.5 * scale,
        scale,
        alive: true,
        trunk,
        crown,
        type: 'choppable',
      };

      this.specialTrees.push(treeData);
      this.trees.push(treeData);
      this.physics.addCircleCollider(x, z, 0.5 * scale);
    }
  }

  chopTree(treeData) {
    if (!treeData.alive) return false;
    treeData.alive = false;
    this.scene.remove(treeData.trunk);
    this.scene.remove(treeData.crown);
    return true;
  }

  getSpecialTrees() {
    return this.specialTrees;
  }

  getAllTrees() {
    return this.trees;
  }
}
