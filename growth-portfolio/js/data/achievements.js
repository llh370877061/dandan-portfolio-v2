// ============================================
// 成长档案 - 成就定义
// ============================================

export const ACHIEVEMENTS = [
  // 阅读类
  {
    id: 'bookworm_1',
    name: '小书虫',
    description: '读完第一本书',
    icon: '📖',
    category: 'reading',
    target: 1,
    type: 'reading_completed'
  },
  {
    id: 'bookworm_5',
    name: '书虫进阶',
    description: '读完5本书',
    icon: '📚',
    category: 'reading',
    target: 5,
    type: 'reading_completed'
  },
  {
    id: 'bookworm_10',
    name: '阅读达人',
    description: '读完10本书',
    icon: '📚',
    category: 'reading',
    target: 10,
    type: 'reading_completed'
  },
  {
    id: 'bookworm_20',
    name: '阅读大师',
    description: '读完20本书',
    icon: '🏆',
    category: 'reading',
    target: 20,
    type: 'reading_completed'
  },
  {
    id: 'reviewer_3',
    name: '小评论家',
    description: '写下3篇读后感',
    icon: '✍️',
    category: 'reading',
    target: 3,
    type: 'reading_with_thoughts'
  },

  // 探索类
  {
    id: 'explorer_1',
    name: '小探险家',
    description: '完成第一次社区探索',
    icon: '🔍',
    category: 'exploration',
    target: 1,
    type: 'activity_exploration'
  },
  {
    id: 'explorer_5',
    name: '探索达人',
    description: '完成5次社区探索',
    icon: '🗺️',
    category: 'exploration',
    target: 5,
    type: 'activity_exploration'
  },
  {
    id: 'explorer_10',
    name: '探索大师',
    description: '完成10次社区探索',
    icon: '🌍',
    category: 'exploration',
    target: 10,
    type: 'activity_exploration'
  },
  {
    id: 'scientist_1',
    name: '小科学家',
    description: '完成第一个科学实验',
    icon: '🔬',
    category: 'exploration',
    target: 1,
    type: 'activity_science'
  },
  {
    id: 'scientist_5',
    name: '科学达人',
    description: '完成5次科学实验',
    icon: '🧪',
    category: 'exploration',
    target: 5,
    type: 'activity_science'
  },

  // 成长类
  {
    id: 'progress_1',
    name: '进步之星',
    description: '记录第一次进步',
    icon: '⭐',
    category: 'growth',
    target: 1,
    type: 'progress_count'
  },
  {
    id: 'progress_5',
    name: '成长达人',
    description: '记录5次进步',
    icon: '🌟',
    category: 'growth',
    target: 5,
    type: 'progress_count'
  },
  {
    id: 'progress_10',
    name: '成长大师',
    description: '记录10次进步',
    icon: '💫',
    category: 'growth',
    target: 10,
    type: 'progress_count'
  },
  {
    id: 'independent_3',
    name: '独立小能手',
    description: '记录3次独立完成的事',
    icon: '💪',
    category: 'growth',
    target: 3,
    type: 'progress_independent'
  },

  // 反思类
  {
    id: 'thinker_1',
    name: '小思想家',
    description: '完成第一次反思',
    icon: '💭',
    category: 'reflection',
    target: 1,
    type: 'reflection_count'
  },
  {
    id: 'thinker_5',
    name: '思考达人',
    description: '完成5次反思',
    icon: '🧠',
    category: 'reflection',
    target: 5,
    type: 'reflection_count'
  },
  {
    id: 'thinker_10',
    name: '反思大师',
    description: '完成10次反思',
    icon: '🎓',
    category: 'reflection',
    target: 10,
    type: 'reflection_count'
  },

  // 困惑类
  {
    id: 'questioner_1',
    name: '小问号',
    description: '提出第一个困惑',
    icon: '❓',
    category: 'curiosity',
    target: 1,
    type: 'confusion_count'
  },
  {
    id: 'questioner_5',
    name: '好奇宝宝',
    description: '提出5个困惑',
    icon: '❓',
    category: 'curiosity',
    target: 5,
    type: 'confusion_count'
  },
  {
    id: 'resolver_3',
    name: '问题解决者',
    description: '解决3个困惑',
    icon: '✅',
    category: 'curiosity',
    target: 3,
    type: 'confusion_resolved'
  },

  // 特殊成就
  {
    id: 'first_week',
    name: '一周坚持',
    description: '连续记录一周',
    icon: '📅',
    category: 'special',
    target: 7,
    type: 'streak_days'
  },
  {
    id: 'first_month',
    name: '月度之星',
    description: '连续记录一个月',
    icon: '🌙',
    category: 'special',
    target: 30,
    type: 'streak_days'
  },
  {
    id: 'all_rounder',
    name: '全能小达人',
    description: '获得所有类别至少一个成就',
    icon: '👑',
    category: 'special',
    target: 5,
    type: 'category_count'
  }
];

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'reading', name: '阅读', icon: '📚', color: '#5c6bc0' },
  { id: 'exploration', name: '探索', icon: '🔍', color: '#4caf50' },
  { id: 'growth', name: '成长', icon: '⭐', color: '#ff9800' },
  { id: 'reflection', name: '反思', icon: '💭', color: '#9c27b0' },
  { id: 'curiosity', name: '好奇', icon: '❓', color: '#00bcd4' },
  { id: 'special', name: '特殊', icon: '🏆', color: '#ffd700' }
];

export default { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES };
