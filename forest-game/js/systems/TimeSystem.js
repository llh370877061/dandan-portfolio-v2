import { CONFIG } from '../config.js';
import { EventBus } from '../core/EventBus.js';

export class TimeSystem {
  constructor() {
    // timeOfDay: 0=正午, 0.5=午夜, 1.0=次日正午
    this.timeOfDay = 0.1; // 从中午稍后开始
    this.currentDay = 1;
    this.daySpeed = 1 / CONFIG.TIME.DAY_LENGTH; // 每秒推进多少
    this.isNight = false;

    this.lastDay = 1;
  }

  update(deltaTime) {
    this.timeOfDay += this.daySpeed * deltaTime;

    if (this.timeOfDay >= 1.0) {
      this.timeOfDay -= 1.0;
      this.currentDay++;
      EventBus.emit('time:dayChange', { day: this.currentDay });
    }

    // 夜间判定
    const wasNight = this.isNight;
    this.isNight = this.timeOfDay > CONFIG.TIME.NIGHT_START && this.timeOfDay < CONFIG.TIME.NIGHT_END;

    if (!wasNight && this.isNight) {
      EventBus.emit('time:nightStart', { day: this.currentDay });
    }
    if (wasNight && !this.isNight) {
      EventBus.emit('time:dayStart', { day: this.currentDay });
    }

    // 计算夜间进度（用于雾和天空）
    let nightProgress = 0;
    if (this.isNight) {
      if (this.timeOfDay > CONFIG.TIME.NIGHT_START) {
        nightProgress = (this.timeOfDay - CONFIG.TIME.NIGHT_START) /
                        (CONFIG.TIME.NIGHT_END + 1 - CONFIG.TIME.NIGHT_START);
      } else {
        nightProgress = (this.timeOfDay + 1 - CONFIG.TIME.NIGHT_START) /
                        (CONFIG.TIME.NIGHT_END + 1 - CONFIG.TIME.NIGHT_START);
      }
    }

    EventBus.emit('time:update', {
      timeOfDay: this.timeOfDay,
      day: this.currentDay,
      isNight: this.isNight,
      nightProgress,
    });
  }

  skipToMorning() {
    this.timeOfDay = CONFIG.TIME.NIGHT_END + 0.02;
    this.isNight = false;
  }

  getTimeLabel() {
    const hour = Math.floor(this.timeOfDay * 24);
    if (hour < 6) return '深夜';
    if (hour < 8) return '清晨';
    if (hour < 11) return '上午';
    if (hour < 13) return '中午';
    if (hour < 17) return '下午';
    if (hour < 19) return '傍晚';
    if (hour < 21) return '夜晚';
    return '深夜';
  }
}
