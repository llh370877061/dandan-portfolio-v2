// ============================================
// 成长档案 - 反思提示问题库
// ============================================

export const REFLECTION_QUESTIONS = [
  // 日常反思
  {
    category: 'daily',
    questions: [
      '今天最让你感到骄傲的事情是什么？',
      '今天遇到了什么困难？你是怎么面对的？',
      '今天学到了什么新东西？',
      '今天有没有帮助别人？感觉怎么样？',
      '如果今天可以重来，你会做什么不同的事？',
      '今天的心情怎么样？发生了什么事让你有这种感觉？',
      '今天有没有尝试做以前没做过的事？',
      '今天最开心的时刻是什么？'
    ]
  },

  // 学习反思
  {
    category: 'learning',
    questions: [
      '最近在学什么？你觉得最难的部分是什么？',
      '有没有什么知识是你特别想了解的？为什么？',
      '你是怎么学会一样新东西的？分享一下你的方法。',
      '学习中遇到困难时，你会怎么做？',
      '有没有什么学习方法对你特别有效？',
      '你觉得自己在哪方面进步最大？',
      '有没有什么知识是你想教给别人的？'
    ]
  },

  // 社交反思
  {
    category: 'social',
    questions: [
      '今天和朋友相处得怎么样？',
      '有没有和别人发生矛盾？你是怎么处理的？',
      '你觉得什么是好的朋友？你有这样的朋友吗？',
      '有没有帮助过别人？那种感觉怎么样？',
      '如果朋友遇到困难，你会怎么做？',
      '你觉得怎样才能交到好朋友？'
    ]
  },

  // 情绪反思
  {
    category: 'emotional',
    questions: [
      '今天有什么事让你特别开心？',
      '有没有什么事让你感到难过或生气？',
      '当你感到不开心时，你会怎么做？',
      '有没有人让你感到温暖？为什么？',
      '你觉得什么是勇气？你有过勇敢的时刻吗？',
      '如果可以给今天的自己打分（1-10），你会打几分？为什么？'
    ]
  },

  // 成长反思
  {
    category: 'growth',
    questions: [
      '和一个月前相比，你觉得自己有什么变化？',
      '你最想改进自己哪方面？为什么？',
      '你觉得自己最大的优点是什么？',
      '有没有什么事是你以前不敢做，现在敢做了？',
      '你希望未来的自己是什么样的？',
      '你最感谢的人是谁？为什么？'
    ]
  },

  // 探索反思
  {
    category: 'exploration',
    questions: [
      '最近有没有发现什么有趣的事？',
      '你对什么最好奇？想探索什么？',
      '如果可以去任何地方，你想去哪里？为什么？',
      '有没有什么事让你觉得"世界真奇妙"？',
      '你最近有没有尝试新事物？感觉怎么样？',
      '如果可以发明一样东西，你想发明什么？'
    ]
  }
];

// 根据分类获取随机问题
export function getRandomQuestion(category = null) {
  let pool;
  if (category) {
    const found = REFLECTION_QUESTIONS.find(q => q.category === category);
    pool = found ? found.questions : REFLECTION_QUESTIONS[0].questions;
  } else {
    pool = REFLECTION_QUESTIONS.flatMap(q => q.questions);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// 根据分类获取所有问题
export function getQuestionsByCategory(category) {
  const found = REFLECTION_QUESTIONS.find(q => q.category === category);
  return found ? found.questions : [];
}

// 获取所有分类
export function getCategories() {
  return REFLECTION_QUESTIONS.map(q => q.category);
}

export default { REFLECTION_QUESTIONS, getRandomQuestion, getQuestionsByCategory, getCategories };
