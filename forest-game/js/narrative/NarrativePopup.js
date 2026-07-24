import { EventBus } from '../core/EventBus.js';

export class NarrativePopup {
  constructor() {
    this.popup = document.getElementById('narrative-popup');
    this.textEl = document.getElementById('narrative-text');
    this.isOpen = false;
    this.fullText = '';
    this.displayedChars = 0;
    this.typeTimer = null;

    this.popup.addEventListener('click', () => this.onClick());
  }

  show(text) {
    this.fullText = text;
    this.displayedChars = 0;
    this.textEl.textContent = '';
    this.popup.style.display = 'flex';
    this.isOpen = true;

    // 逐字显示
    this.typeTimer = setInterval(() => {
      if (this.displayedChars < this.fullText.length) {
        this.displayedChars++;
        this.textEl.textContent = this.fullText.substring(0, this.displayedChars);
      } else {
        clearInterval(this.typeTimer);
      }
    }, 30);
  }

  onClick() {
    if (this.displayedChars < this.fullText.length) {
      // 点击时直接显示全部
      clearInterval(this.typeTimer);
      this.displayedChars = this.fullText.length;
      this.textEl.textContent = this.fullText;
    } else {
      this.close();
    }
  }

  close() {
    clearInterval(this.typeTimer);
    this.popup.style.display = 'none';
    this.isOpen = false;
    EventBus.emit('narrative:closed', {});
  }
}
