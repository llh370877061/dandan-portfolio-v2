import * as THREE from 'three';

export class LightingSystem {
  constructor(scene) {
    this.scene = scene;

    // 太阳光
    this.sunLight = new THREE.DirectionalLight(0xffeedd, 0.4);
    this.sunLight.position.set(50, 80, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -60;
    this.sunLight.shadow.camera.right = 60;
    this.sunLight.shadow.camera.top = 60;
    this.sunLight.shadow.camera.bottom = -60;
    scene.add(this.sunLight);

    // 环境光
    this.ambientLight = new THREE.AmbientLight(0x6688aa, 0.4);
    scene.add(this.ambientLight);

    // 半球光（天空/地面颜色过渡）
    this.hemiLight = new THREE.HemisphereLight(0x8899bb, 0x334422, 0.3);
    scene.add(this.hemiLight);

    // 手电筒
    this.flashlight = new THREE.SpotLight(0xffffee, 0, 35, 0.5, 0.4, 1);
    this.flashlight.castShadow = false;
    scene.add(this.flashlight);
    scene.add(this.flashlight.target);
  }

  updateTimeOfDay(timeOfDay) {
    // timeOfDay: 0=正午, 0.5=午夜, 1.0=次日正午
    const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2;
    const sunY = Math.sin(sunAngle);
    const sunX = Math.cos(sunAngle);

    this.sunLight.position.set(sunX * 80, Math.max(sunY * 80, 5), 30);

    if (sunY > 0) {
      // 白天
      this.sunLight.intensity = sunY * 0.5;
      this.ambientLight.intensity = 0.25 + sunY * 0.25;
      this.ambientLight.color.setHex(0x778899);
      this.hemiLight.intensity = 0.3;
      this.flashlight.intensity = 0;
    } else {
      // 夜晚
      this.sunLight.intensity = 0;
      this.ambientLight.intensity = 0.08;
      this.ambientLight.color.setHex(0x112233);
      this.hemiLight.intensity = 0.05;
      this.flashlight.intensity = 1.2;
    }
  }

  updateFlashlight(position, direction) {
    this.flashlight.position.set(position.x, position.y, position.z);
    this.flashlight.target.position.set(
      position.x + direction.x * 15,
      position.y + direction.y * 15 - 0.5,
      position.z + direction.z * 15
    );
  }
}
