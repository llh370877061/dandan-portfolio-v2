import { CONFIG } from '../config.js';
import { EventBus } from '../core/EventBus.js';

export class SurvivalSystem {
  constructor() {
    const S = CONFIG.SURVIVAL;
    this.temperature = S.TEMPERATURE_START;
    this.hunger = S.HUNGER_START;
    this.stamina = S.STAMINA_START;

    this.isNight = false;
    this.isNearFire = false;
    this.hasWarmthItem = false;
    this.isRunning = false;
    this.isDead = false;

    // 上次警告的时间（防刷屏）
    this.lastWarnTime = { temp: 0, hunger: 0 };

    EventBus.on('item:effect', (effect) => this.applyEffect(effect));
    EventBus.on('time:nightStart', () => { this.isNight = true; });
    EventBus.on('time:dayStart', () => { this.isNight = false; });
    EventBus.on('player:move', (data) => { this.isRunning = data.isRunning; });
  }

  update(deltaTime) {
    if (this.isDead) return;

    const S = CONFIG.SURVIVAL;

    // 体温
    let tempDecay = S.TEMPERATURE_DECAY;
    if (this.isNight) tempDecay *= S.NIGHT_TEMP_MULTIPLIER;
    if (this.isNearFire) tempDecay = -S.NEAR_FIRE_HEAL;
    if (this.hasWarmthItem) tempDecay *= 0.5;
    this.temperature -= tempDecay * deltaTime;

    // 饥饿
    this.hunger -= S.HUNGER_DECAY * deltaTime;

    // 体力
    let staminaDecay = S.STAMINA_DECAY;
    if (this.isRunning) staminaDecay *= 3;
    this.stamina -= staminaDecay * deltaTime;

    // 限制范围
    this.temperature = Math.max(0, Math.min(100, this.temperature));
    this.hunger = Math.max(0, Math.min(100, this.hunger));
    this.stamina = Math.max(0, Math.min(100, this.stamina));

    // 死亡判定
    if (this.temperature <= S.DEATH_THRESHOLD) {
      this.isDead = true;
      EventBus.emit('survival:death', { cause: '你在寒冷中失去了意识...' });
      return;
    }
    if (this.hunger <= S.DEATH_THRESHOLD) {
      this.isDead = true;
      EventBus.emit('survival:death', { cause: '你饿得再也站不起来了...' });
      return;
    }

    // 低体温 + 低饥饿 = 加速死亡
    if (this.temperature <= 20 && this.hunger <= 20) {
      this.temperature -= 0.5 * deltaTime;
    }

    // 警告
    const now = Date.now();
    if (this.temperature <= S.WARNING_THRESHOLD && now - this.lastWarnTime.temp > 15000) {
      this.lastWarnTime.temp = now;
      EventBus.emit('survival:effect', {
        type: 'freezing',
        message: '你感到寒冷刺骨...',
      });
    }
    if (this.hunger <= S.WARNING_THRESHOLD && now - this.lastWarnTime.hunger > 15000) {
      this.lastWarnTime.hunger = now;
      EventBus.emit('survival:effect', {
        type: 'starving',
        message: '你饥肠辘辘...',
      });
    }

    // 广播状态
    EventBus.emit('survival:update', {
      temperature: this.temperature,
      hunger: this.hunger,
      stamina: this.stamina,
    });
  }

  applyEffect(effect) {
    if (effect.temperature) {
      this.temperature = Math.min(100, this.temperature + effect.temperature);
    }
    if (effect.hunger) {
      this.hunger = Math.min(100, this.hunger + effect.hunger);
    }
    if (effect.stamina) {
      this.stamina = Math.min(100, this.stamina + effect.stamina);
    }
  }

  sleepRecover() {
    this.stamina = CONFIG.SURVIVAL.SLEEP_RESTORE;
    this.temperature = Math.min(100, this.temperature + 10);
    this.hunger -= 15;
    if (this.hunger < 0) this.hunger = 0;
  }

  reset() {
    const S = CONFIG.SURVIVAL;
    this.temperature = S.TEMPERATURE_START;
    this.hunger = S.HUNGER_START;
    this.stamina = S.STAMINA_START;
    this.isDead = false;
  }
}
