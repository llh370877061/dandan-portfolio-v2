import { EventBus } from '../core/EventBus.js';

export class InteractionPrompt {
  constructor() {
    this.promptEl = document.getElementById('interaction-prompt');
    this.textEl = document.getElementById('prompt-text');
    this.visible = false;
  }

  show(text) {
    this.promptEl.style.display = 'flex';
    this.textEl.textContent = text;
    this.visible = true;
  }

  hide() {
    this.promptEl.style.display = 'none';
    this.visible = false;
  }

  update(target) {
    if (!target) {
      this.hide();
      return;
    }

    const prompts = {
      worldItem: '按 2 拾取',
      tree: '按 5 砍树',
      ladder: '按 5 攀爬',
      box: '按 5 打开箱子',
      sleepingBag: '按 5 睡觉',
      campfire: '按 4 烹饪',
      lockedBox: '按 5 打开',
      animal: '按 1 射击',
    };

    this.show(prompts[target.type] || '按 5 互动');
  }
}
