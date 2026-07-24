import * as THREE from 'three';
import { EventBus } from '../core/EventBus.js';

export class Player {
  constructor(cameraCtrl, inventory) {
    this.cameraCtrl = cameraCtrl;
    this.inventory = inventory;
    this.attackCooldown = 0;

    EventBus.on('player:attack', (data) => this.onAttack(data));
  }

  update(deltaTime) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
  }

  onAttack(data) {
    if (this.attackCooldown > 0) return;

    const equipped = this.inventory.getEquipped();
    if (!equipped) {
      EventBus.emit('ui:message', { text: '你没有装备武器' });
      return;
    }

    this.attackCooldown = 0.5;

    EventBus.emit('combat:attack', {
      damage: equipped.def.damage || 10,
      range: equipped.def.range || 3,
      position: this.cameraCtrl.getPosition(),
      direction: this.cameraCtrl.getDirection(),
      weaponId: equipped.id,
    });
  }
}
