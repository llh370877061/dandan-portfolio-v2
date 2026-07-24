import { EventBus } from '../core/EventBus.js';

export class StoryManager {
  constructor() {
    this.currentDay = 1;
    this.triggeredNodes = new Set();
    this.discoveredConditions = new Set();

    // 监听事件来设置条件
    EventBus.on('item:pickup', (data) => {
      if (data.itemId === 'predecessorNote') this.discoveredConditions.add('hasNote');
    });
    EventBus.on('tree:chopped', () => this.discoveredConditions.add('choppedTree'));
    EventBus.on('secret:found', (data) => this.discoveredConditions.add(data.secretId));
  }

  triggerDayEvent(day) {
    this.currentDay = day;

    const events = {
      1: '你在森林中醒来。四周都是浓雾，能见度不到十米。\n\n你不记得自己是怎么到这里来的。身上只有一个背包，里面有：匕首、手枪、杯子、烧水壶和一个日记本。\n\n天气很冷。你需要尽快找到木材生火，否则会冻死在这里。',
      3: '第三天了。雾好像越来越浓。\n\n你在一棵特别高的树上发现了一间小木屋。也许可以在那里过夜。',
      5: '你逐渐适应了森林里的生活。砍树、打猎、烧水——每天都在重复。\n\n但你总觉得有什么东西在注视着你。',
      7: '第七天。\n\n你在营地附近发现了更多的痕迹——墙上的刻痕、散落的笔记。\n\n有人在这里待过很长时间。他/她去了哪里？',
      10: '第十天。\n\n你找到了前辈留下的笔记。上面写着："第12天，雾永远不会散。别相信它。"\n\n什么意思？雾是什么？"它"又是什么？',
      14: '第十四天。\n\n你已经在这片森林里待了两周。你发现了前辈的地图，上面标注了几个特殊位置。\n\n森林似乎有自己的意志。树木在移动，雾在呼吸，动物在观察。\n\n你开始明白——你不是偶然来到这里的。\n\n每个来这里的人，都是被选中的。',
    };

    const text = events[day];
    if (text) {
      EventBus.emit('story:trigger', { text, day });
      EventBus.emit('diary:log', { text: `第${day}天 - ${text.split('\n')[0]}` });
    }
  }

  checkTriggers(gameState) {
    // 检查基于条件的剧情触发
    if (this.discoveredConditions.has('hasNote') && !this.triggeredNodes.has('note_read')) {
      this.triggeredNodes.add('note_read');
      setTimeout(() => {
        EventBus.emit('story:trigger', {
          text: '你翻开了前辈的笔记。\n\n"第1天，和你一样，我也是被派来的。\n第5天，我发现了树屋。\n第8天，我找到了营地。\n第12天，我明白了真相。\n\n如果你读到这些，说明你也选择了留下。"\n\n笔记到这里就断了。',
        });
      }, 3000);
    }

    if (this.discoveredConditions.has('choppedTree') && !this.triggeredNodes.has('first_chop')) {
      this.triggeredNodes.add('first_chop');
      setTimeout(() => {
        EventBus.emit('ui:message', { text: '砍倒了一棵树。森林深处似乎有什么东西在回应这声巨响...' });
      }, 2000);
    }
  }
}
