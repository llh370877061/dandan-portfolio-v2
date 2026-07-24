import * as THREE from 'three';

export class SkyBox {
  constructor(scene) {
    this.scene = scene;
    // 不用 CubeTexture，用大球体当天空穹顶
    const geo = new THREE.SphereGeometry(250, 32, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x8899aa,
      side: THREE.BackSide,
    });
    this.sky = new THREE.Mesh(geo, mat);
    scene.add(this.sky);

    this.dayColor = new THREE.Color(0x8899aa);
    this.nightColor = new THREE.Color(0x112233);
    this.dawnColor = new THREE.Color(0xaa6633);
  }

  setTimeOfDay(timeOfDay) {
    // 简化：根据 timeOfDay 计算天空颜色
    // 0.0=正午, 0.25=傍晚, 0.5=午夜, 0.75=黎明, 1.0=正午
    let color;

    if (timeOfDay < 0.15) {
      // 白天
      color = this.dayColor;
    } else if (timeOfDay < 0.3) {
      // 傍晚
      const t = (timeOfDay - 0.15) / 0.15;
      color = this.dayColor.clone().lerp(this.dawnColor, t);
    } else if (timeOfDay < 0.5) {
      // 夜晚
      const t = (timeOfDay - 0.3) / 0.2;
      color = this.dawnColor.clone().lerp(this.nightColor, t);
    } else if (timeOfDay < 0.7) {
      // 深夜
      color = this.nightColor;
    } else if (timeOfDay < 0.85) {
      // 黎明
      const t = (timeOfDay - 0.7) / 0.15;
      color = this.nightColor.clone().lerp(this.dawnColor, t);
    } else {
      // 早晨
      const t = (timeOfDay - 0.85) / 0.15;
      color = this.dawnColor.clone().lerp(this.dayColor, t);
    }

    this.sky.material.color.copy(color);
  }
}
