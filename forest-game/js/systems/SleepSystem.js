import { EventBus } from '../core/EventBus.js';

export class SleepSystem {
  constructor(timeSystem, survivalSystem) {
    this.timeSystem = timeSystem;
    this.survival = survivalSystem;
    this.isSleeping = false;

    EventBus.on('sleep:request', () => this.trySleep());
  }

  trySleep() {
    if (this.isSleeping) return;

    if (!this.timeSystem.isNight) {
      EventBus.emit('ui:message', { text: '现在不是夜晚，不能睡觉' });
      return;
    }

    this.isSleeping = true;
    EventBus.emit('sleep:start', {});
    EventBus.emit('ui:message', { text: '你沉沉地睡去了...' });

    // 渐黑效果
    setTimeout(() => {
      this.survival.sleepRecover();
      this.timeSystem.skipToMorning();

      EventBus.emit('ui:message', { text: `第 ${this.timeSystem.currentDay} 天的早晨，你醒了过来` });
      EventBus.emit('sleep:end', {});

      this.isSleeping = false;
    }, 2000);
  }
}
