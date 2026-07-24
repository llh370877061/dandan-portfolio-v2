import { EventBus } from './EventBus.js';

export class Physics {
  constructor() {
    this.colliders = []; // { x, z, radius } 或 { x, z, width, depth } 矩形

    EventBus.on('physics:checkCollision', (data) => this.checkCollision(data));
  }

  addCircleCollider(x, z, radius) {
    this.colliders.push({ type: 'circle', x, z, radius });
  }

  addRectCollider(x, z, halfWidth, halfDepth) {
    this.colliders.push({ type: 'rect', x, z, halfWidth, halfDepth });
  }

  removeCollider(collider) {
    const idx = this.colliders.indexOf(collider);
    if (idx !== -1) this.colliders.splice(idx, 1);
  }

  checkCollision(data) {
    const { x, z, newX, newZ, radius, result } = data;

    let finalX = newX;
    let finalZ = newZ;

    for (const col of this.colliders) {
      if (col.type === 'circle') {
        const dx = finalX - col.x;
        const dz = finalZ - col.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = radius + col.radius;

        if (dist < minDist && dist > 0) {
          const pushX = (dx / dist) * (minDist - dist);
          const pushZ = (dz / dist) * (minDist - dist);
          finalX += pushX;
          finalZ += pushZ;
        }
      } else if (col.type === 'rect') {
        const closestX = Math.max(col.x - col.halfWidth, Math.min(finalX, col.x + col.halfWidth));
        const closestZ = Math.max(col.z - col.halfDepth, Math.min(finalZ, col.z + col.halfDepth));

        const dx = finalX - closestX;
        const dz = finalZ - closestZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < radius && dist > 0) {
          finalX += (dx / dist) * (radius - dist);
          finalZ += (dz / dist) * (radius - dist);
        }
      }
    }

    result.x = finalX;
    result.z = finalZ;
  }
}
