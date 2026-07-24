// ============================================
// 成长档案 - 系统配置
// ============================================

export const ASSESSMENT_DIMENSIONS = [
  { key: 'cognitive', name: '认知发展', weight: 0.20, color: '#5c6bc0', icon: '🧠' },
  { key: 'social', name: '社会性发展', weight: 0.20, color: '#42a5f5', icon: '🤝' },
  { key: 'emotional', name: '情绪发展', weight: 0.15, color: '#ec407a', icon: '💖' },
  { key: 'physical', name: '身体发展', weight: 0.10, color: '#66bb6a', icon: '🏃' },
  { key: 'artistic', name: '艺术素养', weight: 0.15, color: '#ab47bc', icon: '🎨' },
  { key: 'moral', name: '品德发展', weight: 0.20, color: '#ffa726', icon: '⭐' }
];

export const ACTIVITY_CATEGORIES = [
  '社区探索',
  '户外活动',
  '科学实验',
  '艺术创作',
  '运动健身',
  '社交活动',
  '家务劳动',
  '其他'
];

export const READING_STATUSES = [
  '想读',
  '在读',
  '已完成',
  '暂停'
];

export const CONFUSION_CATEGORIES = [
  '自然科学',
  '社会科学',
  '语言文学',
  '数学逻辑',
  '生活常识',
  '人际关系',
  '情绪管理',
  '其他'
];

export const PROGRESS_CATEGORIES = [
  '独立性',
  '学习能力',
  '社交能力',
  '情绪管理',
  '创造力',
  '责任感',
  '运动技能',
  '其他'
];

export const MOOD_OPTIONS = [
  { value: '开心', icon: '😊', color: '#4caf50' },
  { value: '平静', icon: '😌', color: '#2196f3' },
  { value: '兴奋', icon: '🤩', color: '#ff9800' },
  { value: '困惑', icon: '🤔', color: '#9c27b0' },
  { value: '沮丧', icon: '😢', color: '#607d8b' },
  { value: '生气', icon: '😤', color: '#f44336' },
  { value: '自豪', icon: '😎', color: '#ffd700' }
];

export const SKILL_TAGS = [
  '观察力', '思考力', '表达力', '动手能力', '创造力',
  '合作能力', '独立性', '耐心', '勇气', '好奇心',
  '责任感', '同理心', '抗挫力', '专注力', '想象力'
];

export default {
  ASSESSMENT_DIMENSIONS,
  ACTIVITY_CATEGORIES,
  READING_STATUSES,
  CONFUSION_CATEGORIES,
  PROGRESS_CATEGORIES,
  MOOD_OPTIONS,
  SKILL_TAGS
};
