import { CONFIG } from '../config.js';
import { EventBus } from '../core/EventBus.js';

export class HUD {
  constructor(survival, timeSystem, inventory, cameraCtrl) {
    this.survival = survival;
    this.timeSystem = timeSystem;
    this.inventory = inventory;
    this.cameraCtrl = cameraCtrl;

    this.dayCounter = document.getElementById('day-counter');
    this.timeIcon = document.getElementById('time-icon');
    this.timeFill = document.getElementById('time-fill');
    this.tempFill = document.getElementById('temp-fill');
    this.hungerFill = document.getElementById('hunger-fill');
    this.staminaFill = document.getElementById('stamina-fill');
    this.tempValue = document.getElementById('temp-value');
    this.hungerValue = document.getElementById('hunger-value');
    this.staminaValue = document.getElementById('stamina-value');
    this.vignette = document.getElementById('vignette');
    this.coldOverlay = document.getElementById('cold-overlay');
    this.messageEl = document.getElementById('message-display');
    this.messageText = document.getElementById('message-text');

    this.messageTimer = null;

    // 方向指示器
    this.createDirectionIndicator();

    EventBus.on('ui:message', (data) => this.showMessage(data.text));
    EventBus.on('survival:effect', (data) => this.showEffect(data));
  }

  createDirectionIndicator() {
    this.directionEl = document.createElement('div');
    this.directionEl.id = 'direction-indicator';
    this.directionEl.innerHTML = '🏠 树屋方向';
    this.directionEl.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,215,0,0.8);
      font-size: 14px;
      pointer-events: none;
      z-index: 20;
      text-shadow: 0 1px 4px rgba(0,0,0,0.8);
      transition: opacity 0.3s;
    `;
    document.getElementById('hud').appendChild(this.directionEl);
  }

  update() {
    // 天数
    this.dayCounter.textContent = `第 ${this.timeSystem.currentDay} 天`;

    // 时间
    const tod = this.timeSystem.timeOfDay;
    this.timeFill.style.width = `${tod * 100}%`;

    if (this.timeSystem.isNight) {
      this.timeIcon.textContent = '🌙';
    } else {
      this.timeIcon.textContent = '☀️';
    }

    // 生存条
    const temp = Math.round(this.survival.temperature);
    const hunger = Math.round(this.survival.hunger);
    const stamina = Math.round(this.survival.stamina);

    this.tempFill.style.width = `${temp}%`;
    this.hungerFill.style.width = `${hunger}%`;
    this.staminaFill.style.width = `${stamina}%`;

    this.tempValue.textContent = temp;
    this.hungerValue.textContent = hunger;
    this.staminaValue.textContent = stamina;

    // 低值颜色
    this.tempFill.style.background = temp < 30
      ? 'linear-gradient(90deg, #e53935, #b71c1c)'
      : temp < 50
        ? 'linear-gradient(90deg, #ffb74d, #e65100)'
        : 'linear-gradient(90deg, #4fc3f7, #0288d1)';

    this.hungerFill.style.background = hunger < 30
      ? 'linear-gradient(90deg, #e53935, #b71c1c)'
      : 'linear-gradient(90deg, #ffb74d, #e65100)';

    // 屏幕特效
    const coldIntensity = Math.max(0, (50 - this.survival.temperature) / 50);
    this.coldOverlay.style.opacity = coldIntensity * 0.4;

    const hungerIntensity = Math.max(0, (40 - this.survival.hunger) / 40);
    this.vignette.style.opacity = hungerIntensity * 0.6;

    // 快捷栏更新
    this.updateHotbar();

    // 方向指示器
    this.updateDirection();
  }

  updateDirection() {
    if (!this.cameraCtrl || !this.directionEl) return;

    const playerPos = this.cameraCtrl.getPosition();
    // 树屋位置 (8, ?, -10)
    const treeHouseX = 8;
    const treeHouseZ = -10;

    const dx = treeHouseX - playerPos.x;
    const dz = treeHouseZ - playerPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 8) {
      // 已经在树屋附近，隐藏指示器
      this.directionEl.style.opacity = '0';
      return;
    }

    // 计算角度
    const angle = Math.atan2(dx, dz);
    const playerAngle = this.cameraCtrl.getYRotation();

    // 相对角度
    let relativeAngle = angle - playerAngle;
    // 归一化到 -PI ~ PI
    while (relativeAngle > Math.PI) relativeAngle -= Math.PI * 2;
    while (relativeAngle < -Math.PI) relativeAngle += Math.PI * 2;

    // 根据相对角度显示方向
    let direction = '';
    let opacity = '0.8';
    if (Math.abs(relativeAngle) < 0.5) {
      direction = '⬆️ 前方';
    } else if (relativeAngle > 0.5 && relativeAngle < 2.5) {
      direction = '⬅️ 左方';
    } else if (relativeAngle < -0.5 && relativeAngle > -2.5) {
      direction = '➡️ 右方';
    } else {
      direction = '⬇️ 后方';
    }

    this.directionEl.textContent = `🏠 树屋 ${direction} (${Math.round(dist)}m)`;
    this.directionEl.style.opacity = opacity;
  }

  updateHotbar() {
    const slots = document.querySelectorAll('.hotbar-slot');
    slots.forEach((slot, i) => {
      const item = this.inventory.items[i];
      if (item) {
        slot.innerHTML = `<span style="font-size:22px">${item.def.icon}</span>`;
        if (i === this.inventory.equippedSlot) {
          slot.classList.add('active');
        } else {
          slot.classList.remove('active');
        }
      } else {
        slot.innerHTML = '';
        slot.classList.remove('active');
      }
    });
  }

  showMessage(text) {
    this.messageText.textContent = text;
    this.messageEl.style.display = 'block';

    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => {
      this.messageEl.style.display = 'none';
    }, 3000);
  }

  showEffect(data) {
    if (data.message) {
      this.showMessage(data.message);
    }
  }
}
