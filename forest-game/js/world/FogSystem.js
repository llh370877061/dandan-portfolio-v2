import * as THREE from 'three';
import { CONFIG } from '../config.js';

export class FogSystem {
  constructor(scene) {
    this.scene = scene;
    this.fogDensity = CONFIG.FOG.DENSITY_DAY;
    this.fogColor = new THREE.Color(CONFIG.FOG.COLOR_DAY);

    scene.fog = new THREE.FogExp2(this.fogColor, this.fogDensity);
    scene.background = this.fogColor;

    this.createParticleFog();
  }

  createParticleFog() {
    const count = 400;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xaabbcc,
      size: 6,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.fogParticles = new THREE.Points(geo, mat);
    this.scene.add(this.fogParticles);
  }

  update(deltaTime) {
    if (!this.fogParticles) return;
    const positions = this.fogParticles.geometry.attributes.position;
    const t = Date.now() * 0.0002;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      positions.setX(i, x + Math.sin(t + i * 0.1) * 0.015);
      positions.setZ(i, positions.getZ(i) + Math.cos(t + i * 0.07) * 0.01);
    }
    positions.needsUpdate = true;
  }

  setTimeOfDay(nightProgress) {
    const density = CONFIG.FOG.DENSITY_DAY + nightProgress * (CONFIG.FOG.DENSITY_NIGHT - CONFIG.FOG.DENSITY_DAY);
    this.scene.fog.density = density;

    const dayColor = new THREE.Color(CONFIG.FOG.COLOR_DAY);
    const nightColor = new THREE.Color(CONFIG.FOG.COLOR_NIGHT);
    this.scene.fog.color.lerpColors(dayColor, nightColor, nightProgress);
    this.scene.background.copy(this.scene.fog.color);
  }
}
