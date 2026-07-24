import * as THREE from 'three';
import { CONFIG } from '../config.js';

export class WorldGenerator {
  constructor(scene) {
    this.scene = scene;
    this.ground = null;
    this.groundSize = CONFIG.WORLD_SIZE;

    this.createGround();
  }

  createGround() {
    // 大地面
    const geo = new THREE.PlaneGeometry(this.groundSize, this.groundSize, 120, 120);
    geo.rotateX(-Math.PI / 2);

    // 轻微地形起伏
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = this.getHeightAt(x, z);
      positions.setY(i, y);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x2d5a1e,
      roughness: 0.92,
      metalness: 0.0,
    });

    this.ground = new THREE.Mesh(geo, mat);
    this.ground.receiveShadow = true;
    this.ground.name = 'ground';
    this.scene.add(this.ground);

    // 从出生点到梯子的小路
    this.createPath();

    // 散布一些小石头和草丛（简单几何体）
    this.scatterDetails();
  }

  // 简易噪声
  getHeightAt(x, z) {
    return (
      Math.sin(x * 0.025) * 1.2 +
      Math.cos(z * 0.02) * 0.8 +
      Math.sin((x + z) * 0.015) * 0.5
    );
  }

  createPath() {
    // 从出生点(0,0)到梯子(10,-7.5)的小路
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x4a6a3a,
      roughness: 0.95,
    });

    const segments = 20;
    const startX = 0, startZ = 0;
    const endX = 10, endZ = -7.5;

    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const x = startX + (endX - startX) * t;
      const z = startZ + (endZ - startZ) * t;
      const y = this.getHeightAt(x, z);

      const pathTile = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        pathMat
      );
      pathTile.rotation.x = -Math.PI / 2;
      pathTile.position.set(x, y + 0.02, z);
      pathTile.receiveShadow = true;
      this.scene.add(pathTile);
    }
  }

  scatterDetails() {
    const stoneGeo = new THREE.DodecahedronGeometry(0.2, 0);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.95 });

    const grassGeo = new THREE.ConeGeometry(0.08, 0.4, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x3a6a2a });

    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * this.groundSize * 0.85;
      const z = (Math.random() - 0.5) * this.groundSize * 0.85;
      const y = this.getHeightAt(x, z);

      if (Math.random() < 0.3) {
        // 石头
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        const s = 0.5 + Math.random() * 1;
        stone.position.set(x, y + 0.1 * s, z);
        stone.scale.set(s, s * 0.6, s);
        stone.rotation.y = Math.random() * Math.PI;
        stone.castShadow = true;
        this.scene.add(stone);
      } else {
        // 草丛
        for (let j = 0; j < 3; j++) {
          const grass = new THREE.Mesh(grassGeo, grassMat);
          grass.position.set(
            x + (Math.random() - 0.5) * 0.5,
            y + 0.2,
            z + (Math.random() - 0.5) * 0.5
          );
          grass.rotation.x = (Math.random() - 0.5) * 0.3;
          this.scene.add(grass);
        }
      }
    }
  }
}
