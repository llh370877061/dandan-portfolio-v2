import { EventBus } from '../core/EventBus.js';

export class DiaryUI {
  constructor(diarySystem) {
    this.diarySystem = diarySystem;
    this.isOpen = false;
    this.panel = document.getElementById('diary-panel');
    this.content = document.getElementById('diary-content');
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.style.display = this.isOpen ? 'block' : 'none';
    EventBus.emit('game:pause', { paused: this.isOpen });
    if (this.isOpen) this.render();
  }

  render() {
    const entries = this.diarySystem.getEntries();
    let html = '';

    if (entries.length === 0) {
      html = '<div style="padding:20px;text-align:center;color:#888;">日记本还是空白的...</div>';
    } else {
      // 按天分组
      const byDay = {};
      for (const entry of entries) {
        if (!byDay[entry.day]) byDay[entry.day] = [];
        byDay[entry.day].push(entry);
      }

      for (const day of Object.keys(byDay).sort((a, b) => a - b)) {
        html += `<div class="diary-day-header">第 ${day} 天</div>`;
        for (const entry of byDay[day]) {
          html += `
            <div class="diary-entry">
              <div class="entry-time">${entry.timeLabel}</div>
              <div class="entry-text">${entry.text}</div>
            </div>
          `;
        }
      }
    }

    this.content.innerHTML = html;
  }
}
