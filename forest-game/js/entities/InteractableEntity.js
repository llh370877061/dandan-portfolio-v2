import * as THREE from 'three';
import { EventBus } from '../core/EventBus.js';

export class InteractableEntity {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.alive = true;
  }

  getDistanceTo(pos) {
    return this.position.distanceTo(pos);
  }

  destroy() {
    this.alive = false;
  }
}
