import { EventBus } from '../core/EventBus.js';

const SECRETS = {
  predecessor_diary: {
    name: '前辈的日记',
    description: '在营地箱子里发现的旧日记',
  },
  forest_map: {
    name: '森林地图',
    description: '树屋暗格中的地图',
  },
  truth: {
    name: '真相',
    description: '森林中心石碑上的文字',
  },
  hidden_stash: {
    name: '隐藏补给',
    description: '某棵大树根部的藏物',
  },
  campfire_ritual: {
    name: '篝火仪式痕迹',
    description: '营地地上的奇怪符号',
  },
};

export class SecretManager {
  constructor() {
    this.found = new Set();
    this.totalSecrets = Object.keys(SECRETS).length;

    EventBus.on('secret:tryOpenLockedBox', () => this.tryOpenLockedBox());
    EventBus.on('secret:found', (data) => this.found.add(data.secretId));
  }

  tryOpenLockedBox() {
    // 需要第5天后才能打开
    EventBus.emit('ui:message', { text: '箱子上了锁。也许再过几天能找到打开的方法...' });

    // 简化：第5天后自动打开
    setTimeout(() => {
      EventBus.emit('ui:message', { text: '你在箱子缝隙里发现了一张纸条...' });
      EventBus.emit('secret:found', { secretId: 'predecessor_diary' });
      EventBus.emit('story:trigger', {
        text: '你在营地的箱子里发现了一本旧日记。\n\n"第12天，雾永远不会散。别相信它。\n\n它不是天气。它是森林的呼吸。\n\n当你能听到树说话的时候，你就知道了。"',
      });
    }, 2000);
  }

  find(secretId) {
    if (this.found.has(secretId)) return false;
    this.found.add(secretId);
    EventBus.emit('secret:found', { secretId });
    return true;
  }

  getProgress() {
    return {
      found: this.found.size,
      total: this.totalSecrets,
      percentage: Math.round((this.found.size / this.totalSecrets) * 100),
    };
  }

  hasFound(secretId) {
    return this.found.has(secretId);
  }
}
