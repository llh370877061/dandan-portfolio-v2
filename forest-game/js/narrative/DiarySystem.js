import { EventBus } from '../core/EventBus.js';

export class DiarySystem {
  constructor() {
    this.entries = [];
  }

  addEntry(text, day, timeOfDay) {
    const timeLabel = this.getTimeLabel(timeOfDay);
    this.entries.push({
      day,
      timeLabel,
      text,
      timestamp: Date.now(),
    });
    EventBus.emit('diary:entryAdded', { entry: this.entries[this.entries.length - 1] });
  }

  getTimeLabel(timeOfDay) {
    const hour = Math.floor(timeOfDay * 24);
    if (hour < 6) return '深夜';
    if (hour < 8) return '清晨';
    if (hour < 11) return '上午';
    if (hour < 13) return '中午';
    if (hour < 17) return '下午';
    if (hour < 19) return '傍晚';
    if (hour < 21) return '夜晚';
    return '深夜';
  }

  getEntries() {
    return this.entries;
  }

  getEntriesByDay(day) {
    return this.entries.filter(e => e.day === day);
  }
}
