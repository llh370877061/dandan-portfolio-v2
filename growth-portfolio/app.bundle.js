// ============================================
// 成长档案 - 合并打包文件
// 生成时间: 2026-06-29
// ============================================

(function() {
'use strict';

// ============================================
// [1/16] js/utils/helpers.js - 工具函数
// ============================================

// 格式化日期
function formatDate(dateStr, format = 'full') {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];

  switch (format) {
    case 'full':
      return `${year}年${month}月${day}日 星期${weekday}`;
    case 'short':
      return `${month}月${day}日`;
    case 'month':
      return `${year}年${month}月`;
    case 'iso':
      return `${year}-${month}-${day}`;
    default:
      return dateStr;
  }
}

// 相对时间
function relativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}

// 生成唯一 ID
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// 防抖
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 深拷贝
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// HTML 转义
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 简单模板渲染
function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

// 显示提示消息
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 添加动画样式
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(animationStyle);

// ============================================
// [2/16] js/utils/date.js - 日期工具
// ============================================

// 获取今天日期字符串
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 获取本周日期范围
function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.setDate(diff));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}

// 获取本月日期范围
function getMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    start: new Date(year, month, 1).toISOString().split('T')[0],
    end: new Date(year, month + 1, 0).toISOString().split('T')[0]
  };
}

// 获取最近 N 天的日期数组
function getRecentDays(n) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

// 获取月份名称
function getMonthName(month) {
  const names = ['一月', '二月', '三月', '四月', '五月', '六月',
                 '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return names[month];
}

// 计算两个日期之间的天数
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// 判断是否是今天
function _isToday(dateStr) {
  return dateStr === getToday();
}

// 判断是否是本周
function isThisWeek(dateStr) {
  const range = getWeekRange();
  return dateStr >= range.start && dateStr <= range.end;
}

// 判断是否是本月
function isThisMonth(dateStr) {
  const range = getMonthRange();
  return dateStr >= range.start && dateStr <= range.end;
}

// ============================================
// [3/16] js/utils/export.js - 数据导出工具
// ============================================

// 导出为 JSON
function exportAsJSON() {
  const data = store.exportData();
  _exportDownloadFile(data, `成长档案_${formatDate(new Date().toISOString(), 'iso')}.json`, 'application/json');
}

// 导出为 CSV
function exportAsCSV(type = 'all') {
  const children = store.getChildren();
  let csv = '';

  if (type === 'all' || type === 'activities') {
    csv += '=== 活动记录 ===\n';
    csv += '孩子,日期,标题,分类,描述,技能,心情,标签\n';
    store.getActivities().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.description || ''}","${(record.skills || []).join('、')}","${record.mood || ''}","${(record.tags || []).join('、')}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'readings') {
    csv += '=== 阅读记录 ===\n';
    csv += '孩子,日期,书名,作者,状态,进度,评分,感想,反思\n';
    store.getReadings().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.author || ''}","${record.status || ''}","${record.progress || 0}%","${record.rating || 0}","${record.thoughts || ''}","${record.reflection || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'confusions') {
    csv += '=== 困惑记录 ===\n';
    csv += '孩子,日期,标题,分类,状态,描述,解决方案\n';
    store.getConfusions().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.status || ''}","${record.description || ''}","${record.resolution || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'progresses') {
    csv += '=== 进步记录 ===\n';
    csv += '孩子,日期,标题,分类,描述,成长领域\n';
    store.getProgresses().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.description || ''}","${record.growthArea || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'assessments') {
    csv += '=== 成长评估 ===\n';
    csv += '孩子,日期,周期,认知发展,社会性发展,情绪发展,身体发展,艺术素养,品德发展,优势,待提升\n';
    store.getAssessments().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      const s = record.scores || {};
      csv += `"${child?.name || ''}","${record.date}","${record.period || ''}","${s.cognitive || 0}","${s.social || 0}","${s.emotional || 0}","${s.physical || 0}","${s.artistic || 0}","${s.moral || 0}","${(record.strengths || []).join('、')}","${(record.areasToImprove || []).join('、')}"\n`;
    });
  }

  // 添加 BOM 以支持中文
  const bom = '﻿';
  _exportDownloadFile(bom + csv, `成长档案_${formatDate(new Date().toISOString(), 'iso')}.csv`, 'text/csv;charset=utf-8');
}

// 下载文件
function _exportDownloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 导入 JSON
function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = store.importData(e.target.result);
      if (success) {
        resolve(true);
      } else {
        reject(new Error('导入失败，数据格式不正确'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
}

// ============================================
// [4/16] js/data/config.js - 系统配置
// ============================================

var ASSESSMENT_DIMENSIONS = [
  { key: 'cognitive', name: '认知发展', weight: 0.20, color: '#5c6bc0', icon: '🧠' },
  { key: 'social', name: '社会性发展', weight: 0.20, color: '#42a5f5', icon: '🤝' },
  { key: 'emotional', name: '情绪发展', weight: 0.15, color: '#ec407a', icon: '💖' },
  { key: 'physical', name: '身体发展', weight: 0.10, color: '#66bb6a', icon: '🏃' },
  { key: 'artistic', name: '艺术素养', weight: 0.15, color: '#ab47bc', icon: '🎨' },
  { key: 'moral', name: '品德发展', weight: 0.20, color: '#ffa726', icon: '⭐' }
];

var ACTIVITY_CATEGORIES = [
  '社区探索',
  '户外活动',
  '科学实验',
  '艺术创作',
  '运动健身',
  '社交活动',
  '家务劳动',
  '其他'
];

var READING_STATUSES = [
  '想读',
  '在读',
  '已完成',
  '暂停'
];

var CONFUSION_CATEGORIES = [
  '自然科学',
  '社会科学',
  '语言文学',
  '数学逻辑',
  '生活常识',
  '人际关系',
  '情绪管理',
  '其他'
];

var PROGRESS_CATEGORIES = [
  '独立性',
  '学习能力',
  '社交能力',
  '情绪管理',
  '创造力',
  '责任感',
  '运动技能',
  '其他'
];

var MOOD_OPTIONS = [
  { value: '开心', icon: '😊', color: '#4caf50' },
  { value: '平静', icon: '😌', color: '#2196f3' },
  { value: '兴奋', icon: '🤩', color: '#ff9800' },
  { value: '困惑', icon: '🤔', color: '#9c27b0' },
  { value: '沮丧', icon: '😢', color: '#607d8b' },
  { value: '生气', icon: '😤', color: '#f44336' },
  { value: '自豪', icon: '😎', color: '#ffd700' }
];

var SKILL_TAGS = [
  '观察力', '思考力', '表达力', '动手能力', '创造力',
  '合作能力', '独立性', '耐心', '勇气', '好奇心',
  '责任感', '同理心', '抗挫力', '专注力', '想象力'
];

// ============================================
// [5/16] js/data/achievements.js - 成就定义
// ============================================

var ACHIEVEMENTS = [
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

var ACHIEVEMENT_CATEGORIES = [
  { id: 'reading', name: '阅读', icon: '📚', color: '#5c6bc0' },
  { id: 'exploration', name: '探索', icon: '🔍', color: '#4caf50' },
  { id: 'growth', name: '成长', icon: '⭐', color: '#ff9800' },
  { id: 'reflection', name: '反思', icon: '💭', color: '#9c27b0' },
  { id: 'curiosity', name: '好奇', icon: '❓', color: '#00bcd4' },
  { id: 'special', name: '特殊', icon: '🏆', color: '#ffd700' }
];

// ============================================
// [6/16] js/data/reflections.js - 反思提示问题库
// ============================================

var REFLECTION_QUESTIONS = [
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
function getRandomQuestion(category = null) {
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
function getQuestionsByCategory(category) {
  const found = REFLECTION_QUESTIONS.find(q => q.category === category);
  return found ? found.questions : [];
}

// 获取所有分类
function getCategories() {
  return REFLECTION_QUESTIONS.map(q => q.category);
}

// ============================================
// [7/16] js/store.js - 数据存储管理
// ============================================

var STORAGE_KEY = 'growth_archive';

// 生成唯一 ID (store 内部版本)
function storeGenerateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// 获取当前时间戳
function getNow() {
  return new Date().toISOString();
}

// 获取今天日期 (store 内部版本)
function storeGetToday() {
  return new Date().toISOString().split('T')[0];
}

// 默认数据结构
var DEFAULT_DATA = {
  config: {
    familyName: '我们的家庭',
    children: [
      {
        id: 'child_1',
        name: '女儿',
        age: 11,
        avatar: '🌸',
        color: '#e8a0bf',
        createdAt: storeGetToday()
      },
      {
        id: 'child_2',
        name: '儿子',
        age: 9,
        avatar: '🌟',
        color: '#7eb8da',
        createdAt: storeGetToday()
      }
    ],
    createdAt: storeGetToday()
  },
  records: {
    activities: [],
    readings: [],
    confusions: [],
    progresses: []
  },
  assessments: [],
  reflections: [],
  achievements: []
};

class Store {
  constructor() {
    this.data = this.load();
    this.listeners = new Map();
  }

  // 加载数据
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeWithDefaults(parsed);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  // 合并默认数据
  mergeWithDefaults(stored) {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_DATA));

    if (stored.config) {
      defaults.config = { ...defaults.config, ...stored.config };
      if (stored.config.children) {
        defaults.config.children = stored.config.children;
      }
    }

    if (stored.records) {
      defaults.records = { ...defaults.records, ...stored.records };
    }

    defaults.assessments = stored.assessments || [];
    defaults.reflections = stored.reflections || [];
    defaults.achievements = stored.achievements || [];

    return defaults;
  }

  // 保存数据
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  // 监听数据变化
  onChange(callback) {
    const id = storeGenerateId('listener');
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  // 通知监听者
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data));
  }

  // 获取配置
  getConfig() {
    return this.data.config;
  }

  // 更新配置
  updateConfig(updates) {
    this.data.config = { ...this.data.config, ...updates };
    this.save();
  }

  // 获取孩子信息
  getChild(childId) {
    return this.data.config.children.find(c => c.id === childId);
  }

  // 获取所有孩子
  getChildren() {
    return this.data.config.children;
  }

  // ============ 活动记录 ============

  getActivities(childId = null) {
    let activities = this.data.records.activities;
    if (childId) {
      activities = activities.filter(a => a.childId === childId);
    }
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addActivity(activity) {
    const record = {
      id: storeGenerateId('act'),
      createdAt: getNow(),
      ...activity
    };
    this.data.records.activities.unshift(record);
    this.save();
    return record;
  }

  updateActivity(id, updates) {
    const index = this.data.records.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.records.activities[index] = {
        ...this.data.records.activities[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.records.activities[index];
    }
    return null;
  }

  deleteActivity(id) {
    this.data.records.activities = this.data.records.activities.filter(a => a.id !== id);
    this.save();
  }

  // ============ 阅读记录 ============

  getReadings(childId = null) {
    let readings = this.data.records.readings;
    if (childId) {
      readings = readings.filter(r => r.childId === childId);
    }
    return readings.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addReading(reading) {
    const record = {
      id: storeGenerateId('read'),
      createdAt: getNow(),
      ...reading
    };
    this.data.records.readings.unshift(record);
    this.save();
    return record;
  }

  updateReading(id, updates) {
    const index = this.data.records.readings.findIndex(r => r.id === id);
    if (index !== -1) {
      this.data.records.readings[index] = {
        ...this.data.records.readings[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.records.readings[index];
    }
    return null;
  }

  deleteReading(id) {
    this.data.records.readings = this.data.records.readings.filter(r => r.id !== id);
    this.save();
  }

  // ============ 困惑记录 ============

  getConfusions(childId = null) {
    let confusions = this.data.records.confusions;
    if (childId) {
      confusions = confusions.filter(c => c.childId === childId);
    }
    return confusions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addConfusion(confusion) {
    const record = {
      id: storeGenerateId('conf'),
      createdAt: getNow(),
      status: '待解决',
      ...confusion
    };
    this.data.records.confusions.unshift(record);
    this.save();
    return record;
  }

  updateConfusion(id, updates) {
    const index = this.data.records.confusions.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.records.confusions[index] = {
        ...this.data.records.confusions[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.records.confusions[index];
    }
    return null;
  }

  deleteConfusion(id) {
    this.data.records.confusions = this.data.records.confusions.filter(c => c.id !== id);
    this.save();
  }

  // ============ 进步记录 ============

  getProgresses(childId = null) {
    let progresses = this.data.records.progresses;
    if (childId) {
      progresses = progresses.filter(p => p.childId === childId);
    }
    return progresses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addProgress(progress) {
    const record = {
      id: storeGenerateId('prog'),
      createdAt: getNow(),
      ...progress
    };
    this.data.records.progresses.unshift(record);
    this.save();
    return record;
  }

  updateProgress(id, updates) {
    const index = this.data.records.progresses.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.records.progresses[index] = {
        ...this.data.records.progresses[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.records.progresses[index];
    }
    return null;
  }

  deleteProgress(id) {
    this.data.records.progresses = this.data.records.progresses.filter(p => p.id !== id);
    this.save();
  }

  // ============ 评估 ============

  getAssessments(childId = null) {
    let assessments = this.data.assessments;
    if (childId) {
      assessments = assessments.filter(a => a.childId === childId);
    }
    return assessments.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addAssessment(assessment) {
    const record = {
      id: storeGenerateId('assess'),
      createdAt: getNow(),
      ...assessment
    };
    this.data.assessments.unshift(record);
    this.save();
    return record;
  }

  updateAssessment(id, updates) {
    const index = this.data.assessments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.assessments[index] = {
        ...this.data.assessments[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.assessments[index];
    }
    return null;
  }

  deleteAssessment(id) {
    this.data.assessments = this.data.assessments.filter(a => a.id !== id);
    this.save();
  }

  // ============ 反思 ============

  getReflections(childId = null) {
    let reflections = this.data.reflections;
    if (childId) {
      reflections = reflections.filter(r => r.childId === childId);
    }
    return reflections.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addReflection(reflection) {
    const record = {
      id: storeGenerateId('refl'),
      createdAt: getNow(),
      ...reflection
    };
    this.data.reflections.unshift(record);
    this.save();
    return record;
  }

  updateReflection(id, updates) {
    const index = this.data.reflections.findIndex(r => r.id === id);
    if (index !== -1) {
      this.data.reflections[index] = {
        ...this.data.reflections[index],
        ...updates,
        updatedAt: getNow()
      };
      this.save();
      return this.data.reflections[index];
    }
    return null;
  }

  deleteReflection(id) {
    this.data.reflections = this.data.reflections.filter(r => r.id !== id);
    this.save();
  }

  // ============ 成就 ============

  getAchievements(childId = null) {
    let achievements = this.data.achievements;
    if (childId) {
      achievements = achievements.filter(a => a.childId === childId);
    }
    return achievements;
  }

  unlockAchievement(childId, badgeId, name, description, icon) {
    const existing = this.data.achievements.find(
      a => a.childId === childId && a.badgeId === badgeId
    );
    if (existing) return existing;

    const record = {
      id: storeGenerateId('badge'),
      childId,
      badgeId,
      name,
      description,
      icon,
      unlockedAt: storeGetToday()
    };
    this.data.achievements.push(record);
    this.save();
    return record;
  }

  // ============ 统计 ============

  getStats(childId = null) {
    const activities = this.getActivities(childId);
    const readings = this.getReadings(childId);
    const confusions = this.getConfusions(childId);
    const progresses = this.getProgresses(childId);
    const reflections = this.getReflections(childId);
    const achievements = this.getAchievements(childId);

    const monthlyStats = {};
    const allRecords = [
      ...activities.map(a => ({ ...a, type: 'activity' })),
      ...readings.map(r => ({ ...r, type: 'reading' })),
      ...confusions.map(c => ({ ...c, type: 'confusion' })),
      ...progresses.map(p => ({ ...p, type: 'progress' }))
    ];

    allRecords.forEach(record => {
      const month = record.date.substring(0, 7);
      if (!monthlyStats[month]) {
        monthlyStats[month] = { activities: 0, readings: 0, confusions: 0, progresses: 0 };
      }
      monthlyStats[month][record.type + 's']++;
    });

    return {
      totalActivities: activities.length,
      totalReadings: readings.length,
      totalConfusions: confusions.length,
      totalProgresses: progresses.length,
      totalReflections: reflections.length,
      totalAchievements: achievements.length,
      monthlyStats,
      recentActivities: activities.slice(0, 5),
      recentReadings: readings.slice(0, 5)
    };
  }

  // ============ 导出 ============

  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.data = this.mergeWithDefaults(imported);
      this.save();
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }

  // 清除所有数据
  clearAll() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.removeItem(STORAGE_KEY);
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.save();
      return true;
    }
    return false;
  }
}

var store = new Store();

// ============================================
// [8/16] js/router.js - 路由系统
// ============================================

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.onRouteChange = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...paramParts] = hash.split('/').filter(Boolean);
    const routePath = '/' + (path || '');

    const params = {};
    if (paramParts.length > 0) {
      params.id = paramParts.join('/');
    }

    if (this.routes[routePath]) {
      this.currentRoute = routePath;
      this.routes[routePath](params);

      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.route === routePath);
      });

      // 更新页面标题
      const titles = {
        '/': '首页',
        '/records': '成长记录',
        '/assessment': '成长评估',
        '/timeline': '时间轴',
        '/reflection': '反思空间',
        '/achievements': '成就殿堂',
        '/statistics': '数据统计'
      };

      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.textContent = titles[routePath] || '成长档案';
      }

      if (this.onRouteChange) {
        this.onRouteChange(routePath, params);
      }
    }
  }

  start() {
    this.handleRoute();
    return this;
  }
}

var router = new Router();

// ============================================
// [9/16] js/modules/dashboard.js - 首页仪表盘
// ============================================

var _dashboardCurrentChild = null;

function initDashboard() {
  _dashboardRender();
}

function _dashboardRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const stats = store.getStats();

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      <div class="child-tab child-1 ${!_dashboardCurrentChild ? 'active' : ''}" data-child="">
        <span>${children[0]?.avatar || '🌸'} ${children[0]?.name || '女儿'}</span>
      </div>
      <div class="child-tab child-2 ${_dashboardCurrentChild === 'child_2' ? 'active' : ''}" data-child="child_2">
        <span>${children[1]?.avatar || '🌟'} ${children[1]?.name || '儿子'}</span>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon activities">🌱</div>
        <div class="stat-value">${_dashboardCurrentChild ? _dashboardGetFilteredStats('activities') : stats.totalActivities}</div>
        <div class="stat-label">活动记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reading">📚</div>
        <div class="stat-value">${_dashboardCurrentChild ? _dashboardGetFilteredStats('readings') : stats.totalReadings}</div>
        <div class="stat-label">阅读记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon achievements">⭐</div>
        <div class="stat-value">${_dashboardCurrentChild ? _dashboardGetFilteredStats('achievements') : stats.totalAchievements}</div>
        <div class="stat-label">成就徽章</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reflections">💭</div>
        <div class="stat-value">${_dashboardCurrentChild ? _dashboardGetFilteredStats('reflections') : stats.totalReflections}</div>
        <div class="stat-label">反思记录</div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <div class="quick-action" data-action="add-activity">
        <div class="quick-action-icon">🌱</div>
        <div class="quick-action-label">记录活动</div>
      </div>
      <div class="quick-action" data-action="add-reading">
        <div class="quick-action-icon">📚</div>
        <div class="quick-action-label">记录阅读</div>
      </div>
      <div class="quick-action" data-action="add-reflection">
        <div class="quick-action-icon">💭</div>
        <div class="quick-action-label">今日反思</div>
      </div>
      <div class="quick-action" data-action="add-progress">
        <div class="quick-action-icon">⭐</div>
        <div class="quick-action-label">记录进步</div>
      </div>
    </div>

    <!-- 最近记录 -->
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">最近活动</h3>
          <button class="btn btn-ghost btn-sm" data-navigate="/records">查看全部</button>
        </div>
        <div class="card-body">
          ${_dashboardRenderRecentList(_dashboardGetRecentActivities())}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">最近阅读</h3>
          <button class="btn btn-ghost btn-sm" data-navigate="/records">查看全部</button>
        </div>
        <div class="card-body">
          ${_dashboardRenderRecentReadings(_dashboardGetRecentReadings())}
        </div>
      </div>
    </div>

    <!-- 孩子卡片 -->
    <div class="grid grid-2" style="margin-top: var(--space-6);">
      ${children.map(child => _dashboardRenderChildCard(child)).join('')}
    </div>
  `;

  _dashboardBindEvents();
}

function _dashboardGetFilteredStats(type) {
  if (!_dashboardCurrentChild) {
    return store.getStats()[`total${type.charAt(0).toUpperCase() + type.slice(1)}`];
  }
  switch (type) {
    case 'activities': return store.getActivities(_dashboardCurrentChild).length;
    case 'readings': return store.getReadings(_dashboardCurrentChild).length;
    case 'achievements': return store.getAchievements(_dashboardCurrentChild).length;
    case 'reflections': return store.getReflections(_dashboardCurrentChild).length;
    default: return 0;
  }
}

function _dashboardGetRecentActivities() {
  const activities = store.getActivities(_dashboardCurrentChild);
  return activities.slice(0, 5);
}

function _dashboardGetRecentReadings() {
  const readings = store.getReadings(_dashboardCurrentChild);
  return readings.slice(0, 5);
}

function _dashboardRenderRecentList(activities) {
  if (activities.length === 0) {
    return `
      <div class="empty-state" style="padding: var(--space-6);">
        <div class="empty-state-icon">🌱</div>
        <div class="empty-state-title">还没有活动记录</div>
        <div class="empty-state-text">点击上方"记录活动"开始吧</div>
      </div>
    `;
  }

  return `
    <div class="record-list">
      ${activities.map(a => `
        <div class="record-item" data-id="${a.id}">
          <div class="record-icon activity">🌱</div>
          <div class="record-content">
            <div class="record-title">${escapeHtml(a.title || '未命名活动')}</div>
            <div class="record-meta">
              <span>${formatDate(a.date, 'short')}</span>
              <span>${escapeHtml(a.category || '')}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function _dashboardRenderRecentReadings(readings) {
  if (readings.length === 0) {
    return `
      <div class="empty-state" style="padding: var(--space-6);">
        <div class="empty-state-icon">📚</div>
        <div class="empty-state-title">还没有阅读记录</div>
        <div class="empty-state-text">点击上方"记录阅读"开始吧</div>
      </div>
    `;
  }

  return `
    <div class="record-list">
      ${readings.map(r => `
        <div class="record-item" data-id="${r.id}">
          <div class="record-icon reading">📚</div>
          <div class="record-content">
            <div class="record-title">${escapeHtml(r.title || '未命名书籍')}</div>
            <div class="record-meta">
              <span>${escapeHtml(r.author || '')}</span>
              <span>${r.status || '在读'}</span>
              ${r.rating ? `<span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function _dashboardRenderChildCard(child) {
  const activities = store.getActivities(child.id);
  const readings = store.getReadings(child.id);
  const achievements = store.getAchievements(child.id);

  const monthActivities = activities.filter(a => isThisMonth(a.date)).length;
  const monthReadings = readings.filter(r => isThisMonth(r.date)).length;
  const monthAchievements = achievements.filter(a => {
    const unlocked = new Date(a.unlockedAt);
    const now = new Date();
    return unlocked.getMonth() === now.getMonth() && unlocked.getFullYear() === now.getFullYear();
  }).length;

  return `
    <div class="child-card child-${child.id === 'child_1' ? '1' : '2'}">
      <div class="child-card-header">
        <div class="child-avatar">${child.avatar}</div>
        <div>
          <div class="child-name">${escapeHtml(child.name)}</div>
          <div class="child-age">${child.age}岁</div>
        </div>
      </div>
      <div class="child-stats">
        <div class="child-stat">
          <div class="child-stat-value" style="color: var(--color-primary);">${monthActivities}</div>
          <div class="child-stat-label">本月活动</div>
        </div>
        <div class="child-stat">
          <div class="child-stat-value" style="color: var(--color-cognitive);">${monthReadings}</div>
          <div class="child-stat-label">本月阅读</div>
        </div>
        <div class="child-stat">
          <div class="child-stat-value" style="color: var(--color-gold);">${monthAchievements}</div>
          <div class="child-stat-label">本月成就</div>
        </div>
      </div>
    </div>
  `;
}

function _dashboardBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _dashboardCurrentChild = tab.dataset.child || null;
      _dashboardRender();
    });
  });

  document.querySelectorAll('.quick-action').forEach(action => {
    action.addEventListener('click', () => {
      const type = action.dataset.action;
      switch (type) {
        case 'add-activity':
          window.location.hash = '/records?type=activity';
          break;
        case 'add-reading':
          window.location.hash = '/records?type=reading';
          break;
        case 'add-reflection':
          window.location.hash = '/reflection';
          break;
        case 'add-progress':
          window.location.hash = '/records?type=progress';
          break;
      }
    });
  });

  document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.navigate;
    });
  });
}

// ============================================
// [10/16] js/modules/records.js - 记录模块
// ============================================

var _recordsCurrentType = 'activity';
var _recordsCurrentChild = 'child_1';
var _recordsEditingId = null;

function initRecords(params = {}) {
  if (params.type) _recordsCurrentType = params.type;
  if (params.id) _recordsEditingId = params.id;
  _recordsRender();
}

function _recordsRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_recordsCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 记录类型切换 -->
    <div class="filter-bar">
      <div class="filter-chip ${_recordsCurrentType === 'activity' ? 'active' : ''}" data-type="activity">🌱 活动</div>
      <div class="filter-chip ${_recordsCurrentType === 'reading' ? 'active' : ''}" data-type="reading">📚 阅读</div>
      <div class="filter-chip ${_recordsCurrentType === 'confusion' ? 'active' : ''}" data-type="confusion">❓ 困惑</div>
      <div class="filter-chip ${_recordsCurrentType === 'progress' ? 'active' : ''}" data-type="progress">⭐ 进步</div>
      <div style="flex: 1;"></div>
      <button class="btn btn-primary btn-sm" id="add-record-btn">+ 添加记录</button>
    </div>

    <!-- 记录列表 -->
    <div id="record-list-container">
      ${_recordsRenderRecordList()}
    </div>

    <!-- 添加/编辑表单弹窗 -->
    <div class="modal-overlay" id="record-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">添加${_recordsGetTypeName(_recordsCurrentType)}记录</h3>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="record-form">
            ${_recordsRenderForm()}
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-btn">取消</button>
          <button class="btn btn-primary" id="save-btn">保存</button>
        </div>
      </div>
    </div>
  `;

  _recordsBindEvents();
}

function _recordsGetTypeName(type) {
  const names = { activity: '活动', reading: '阅读', confusion: '困惑', progress: '进步' };
  return names[type] || type;
}

function _recordsRenderRecordList() {
  let records = [];
  switch (_recordsCurrentType) {
    case 'activity': records = store.getActivities(_recordsCurrentChild); break;
    case 'reading': records = store.getReadings(_recordsCurrentChild); break;
    case 'confusion': records = store.getConfusions(_recordsCurrentChild); break;
    case 'progress': records = store.getProgresses(_recordsCurrentChild); break;
  }

  if (records.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${_recordsGetIcon(_recordsCurrentType)}</div>
        <div class="empty-state-title">还没有${_recordsGetTypeName(_recordsCurrentType)}记录</div>
        <div class="empty-state-text">点击"添加记录"开始记录吧</div>
      </div>
    `;
  }

  return `
    <div class="record-list">
      ${records.map(record => _recordsRenderRecordItem(record)).join('')}
    </div>
  `;
}

function _recordsGetIcon(type) {
  const icons = { activity: '🌱', reading: '📚', confusion: '❓', progress: '⭐' };
  return icons[type] || '📝';
}

function _recordsRenderRecordItem(record) {
  let meta = '';
  let extra = '';

  switch (_recordsCurrentType) {
    case 'activity':
      meta = `${record.category || ''}`;
      extra = record.mood ? `<span>${MOOD_OPTIONS.find(m => m.value === record.mood)?.icon || ''} ${record.mood}</span>` : '';
      break;
    case 'reading':
      meta = `${record.author || ''} · ${record.status || '在读'}`;
      extra = record.rating ? `<span>${'★'.repeat(record.rating)}${'☆'.repeat(5 - record.rating)}</span>` : '';
      break;
    case 'confusion':
      meta = `${record.category || ''} · ${record.status || '待解决'}`;
      break;
    case 'progress':
      meta = `${record.category || ''}`;
      break;
  }

  return `
    <div class="record-item" data-id="${record.id}">
      <div class="record-icon ${_recordsCurrentType}">${_recordsGetIcon(_recordsCurrentType)}</div>
      <div class="record-content">
        <div class="record-title">${escapeHtml(record.title || '未命名')}</div>
        <div class="record-meta">
          <span>${formatDate(record.date, 'short')}</span>
          <span>${meta}</span>
          ${extra}
        </div>
        ${record.description ? `<div style="margin-top: var(--space-2); font-size: var(--text-sm); color: var(--color-text-secondary);">${escapeHtml(record.description).substring(0, 80)}${record.description.length > 80 ? '...' : ''}</div>` : ''}
        ${record.tags && record.tags.length > 0 ? `
          <div class="record-tags">
            ${record.tags.map(tag => `<span class="tag tag-primary">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <div style="display: flex; gap: var(--space-2);">
        <button class="btn btn-ghost btn-sm edit-btn" data-id="${record.id}">编辑</button>
        <button class="btn btn-ghost btn-sm delete-btn" data-id="${record.id}" style="color: var(--color-error);">删除</button>
      </div>
    </div>
  `;
}

function _recordsRenderForm() {
  const children = store.getChildren();
  const child = children.find(c => c.id === _recordsCurrentChild);

  switch (_recordsCurrentType) {
    case 'activity': return _recordsRenderActivityForm(child);
    case 'reading': return _recordsRenderReadingForm(child);
    case 'confusion': return _recordsRenderConfusionForm(child);
    case 'progress': return _recordsRenderProgressForm(child);
    default: return '';
  }
}

function _recordsRenderActivityForm(child) {
  return `
    <input type="hidden" name="childId" value="${_recordsCurrentChild}">
    <div class="form-group">
      <label class="form-label">活动标题 *</label>
      <input type="text" name="title" class="form-input" placeholder="例如：社区植物观察" required>
    </div>
    <div class="form-group">
      <label class="form-label">日期 *</label>
      <input type="date" name="date" class="form-input" value="${getToday()}" required>
    </div>
    <div class="form-group">
      <label class="form-label">分类</label>
      <select name="category" class="form-select">
        ${ACTIVITY_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">详细描述</label>
      <textarea name="description" class="form-textarea" placeholder="记录活动的详细过程和收获..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">心情</label>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        ${MOOD_OPTIONS.map(m => `
          <label style="display: flex; align-items: center; gap: var(--space-1); padding: var(--space-2) var(--space-3); border-radius: var(--radius-full); border: 1px solid var(--color-border); cursor: pointer;">
            <input type="radio" name="mood" value="${m.value}" style="display: none;">
            <span>${m.icon}</span>
            <span>${m.value}</span>
          </label>
        `).join('')}
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">技能标签</label>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        ${SKILL_TAGS.map(tag => `
          <label style="display: flex; align-items: center; gap: var(--space-1); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); border: 1px solid var(--color-border); cursor: pointer; font-size: var(--text-sm);">
            <input type="checkbox" name="skills" value="${tag}" style="display: none;">
            <span>${tag}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function _recordsRenderReadingForm(child) {
  return `
    <input type="hidden" name="childId" value="${_recordsCurrentChild}">
    <div class="form-group">
      <label class="form-label">书名 *</label>
      <input type="text" name="title" class="form-input" placeholder="例如：小王子" required>
    </div>
    <div class="form-group">
      <label class="form-label">作者</label>
      <input type="text" name="author" class="form-input" placeholder="例如：圣埃克苏佩里">
    </div>
    <div class="form-group">
      <label class="form-label">日期 *</label>
      <input type="date" name="date" class="form-input" value="${getToday()}" required>
    </div>
    <div class="form-group">
      <label class="form-label">阅读状态</label>
      <select name="status" class="form-select">
        ${READING_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">阅读进度（%）</label>
      <input type="range" name="progress" class="slider" min="0" max="100" value="0">
      <div class="slider-value">0%</div>
    </div>
    <div class="form-group">
      <label class="form-label">评分</label>
      <div style="display: flex; gap: var(--space-2);">
        ${[1,2,3,4,5].map(n => `
          <label style="cursor: pointer; font-size: 24px;">
            <input type="radio" name="rating" value="${n}" style="display: none;">
            <span class="star" data-value="${n}">☆</span>
          </label>
        `).join('')}
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">阅读感想</label>
      <textarea name="thoughts" class="form-textarea" placeholder="读这本书有什么感受？"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">反思收获</label>
      <textarea name="reflection" class="form-textarea" placeholder="从这本书中学到了什么？"></textarea>
    </div>
  `;
}

function _recordsRenderConfusionForm(child) {
  return `
    <input type="hidden" name="childId" value="${_recordsCurrentChild}">
    <div class="form-group">
      <label class="form-label">困惑标题 *</label>
      <input type="text" name="title" class="form-input" placeholder="例如：为什么天空是蓝色的" required>
    </div>
    <div class="form-group">
      <label class="form-label">日期 *</label>
      <input type="date" name="date" class="form-input" value="${getToday()}" required>
    </div>
    <div class="form-group">
      <label class="form-label">分类</label>
      <select name="category" class="form-select">
        ${CONFUSION_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">详细描述</label>
      <textarea name="description" class="form-textarea" placeholder="描述这个困惑的具体内容..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">状态</label>
      <select name="status" class="form-select">
        <option value="待解决">待解决</option>
        <option value="探索中">探索中</option>
        <option value="已解决">已解决</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">解决方案（已解决时填写）</label>
      <textarea name="resolution" class="form-textarea" placeholder="这个问题是怎么解决的？"></textarea>
    </div>
  `;
}

function _recordsRenderProgressForm(child) {
  return `
    <input type="hidden" name="childId" value="${_recordsCurrentChild}">
    <div class="form-group">
      <label class="form-label">进步标题 *</label>
      <input type="text" name="title" class="form-input" placeholder="例如：独立完成科学实验" required>
    </div>
    <div class="form-group">
      <label class="form-label">日期 *</label>
      <input type="date" name="date" class="form-input" value="${getToday()}" required>
    </div>
    <div class="form-group">
      <label class="form-label">分类</label>
      <select name="category" class="form-select">
        ${PROGRESS_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">详细描述</label>
      <textarea name="description" class="form-textarea" placeholder="描述这次进步的具体表现..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">成长领域</label>
      <input type="text" name="growthArea" class="form-input" placeholder="例如：独立性、科学探究">
    </div>
  `;
}

function _recordsBindEvents() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _recordsCurrentType = chip.dataset.type;
      _recordsEditingId = null;
      _recordsRender();
    });
  });

  document.getElementById('add-record-btn')?.addEventListener('click', () => {
    _recordsEditingId = null;
    _recordsOpenModal();
  });

  document.getElementById('modal-close')?.addEventListener('click', _recordsCloseModal);
  document.getElementById('cancel-btn')?.addEventListener('click', _recordsCloseModal);
  document.getElementById('save-btn')?.addEventListener('click', _recordsSaveRecord);

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      _recordsEditingId = btn.dataset.id;
      _recordsOpenModal();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('确定要删除这条记录吗？')) {
        _recordsDeleteRecord(btn.dataset.id);
      }
    });
  });

  document.querySelector('input[name="progress"]')?.addEventListener('input', (e) => {
    e.target.nextElementSibling.textContent = e.target.value + '%';
  });

  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      document.querySelectorAll('.star').forEach((s, i) => {
        s.textContent = i < value ? '★' : '☆';
      });
    });
  });

  document.querySelectorAll('input[name="mood"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name="mood"]').forEach(r => {
        r.parentElement.style.borderColor = r.checked ? 'var(--color-primary)' : 'var(--color-border)';
      });
    });
  });

  document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      checkbox.parentElement.style.borderColor = checkbox.checked ? 'var(--color-primary)' : 'var(--color-border)';
      checkbox.parentElement.style.background = checkbox.checked ? 'var(--color-primary-bg)' : '';
    });
  });
}

function _recordsOpenModal() {
  const modal = document.getElementById('record-modal');
  const title = document.getElementById('modal-title');

  if (_recordsEditingId) {
    title.textContent = `编辑${_recordsGetTypeName(_recordsCurrentType)}记录`;
    const record = _recordsGetRecordById(_recordsEditingId);
    if (record) {
      setTimeout(() => _recordsFillForm(record), 100);
    }
  } else {
    title.textContent = `添加${_recordsGetTypeName(_recordsCurrentType)}记录`;
  }

  modal.classList.add('active');
}

function _recordsCloseModal() {
  document.getElementById('record-modal').classList.remove('active');
  _recordsEditingId = null;
}

function _recordsGetRecordById(id) {
  switch (_recordsCurrentType) {
    case 'activity': return store.getActivities().find(a => a.id === id);
    case 'reading': return store.getReadings().find(r => r.id === id);
    case 'confusion': return store.getConfusions().find(c => c.id === id);
    case 'progress': return store.getProgresses().find(p => p.id === id);
    default: return null;
  }
}

function _recordsFillForm(record) {
  const form = document.getElementById('record-form');
  if (!form) return;

  Object.keys(record).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      if (input.type === 'radio') {
        if (input.value === record[key]) {
          input.checked = true;
          input.parentElement.style.borderColor = 'var(--color-primary)';
        }
      } else if (input.type === 'checkbox') {
        if (record[key]?.includes(input.value)) {
          input.checked = true;
          input.parentElement.style.borderColor = 'var(--color-primary)';
          input.parentElement.style.background = 'var(--color-primary-bg)';
        }
      } else if (input.type === 'range') {
        input.value = record[key] || 0;
        input.nextElementSibling.textContent = (record[key] || 0) + '%';
      } else {
        input.value = record[key] || '';
      }
    }
  });
}

function _recordsSaveRecord() {
  const form = document.getElementById('record-form');
  if (!form) return;

  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'skills') {
      if (!data.skills) data.skills = [];
      data.skills.push(value);
    } else {
      data[key] = value;
    }
  }

  const skillCheckboxes = form.querySelectorAll('input[name="skills"]:checked');
  data.skills = Array.from(skillCheckboxes).map(cb => cb.value);

  if (!data.title || !data.date) {
    showToast('请填写标题和日期', 'error');
    return;
  }

  if (_recordsEditingId) {
    _recordsUpdateRecord(_recordsEditingId, data);
  } else {
    _recordsAddRecord(data);
  }

  _recordsCloseModal();
  _recordsRender();
}

function _recordsAddRecord(data) {
  switch (_recordsCurrentType) {
    case 'activity': store.addActivity(data); break;
    case 'reading': store.addReading(data); break;
    case 'confusion': store.addConfusion(data); break;
    case 'progress': store.addProgress(data); break;
  }
  showToast('记录添加成功', 'success');
}

function _recordsUpdateRecord(id, data) {
  switch (_recordsCurrentType) {
    case 'activity': store.updateActivity(id, data); break;
    case 'reading': store.updateReading(id, data); break;
    case 'confusion': store.updateConfusion(id, data); break;
    case 'progress': store.updateProgress(id, data); break;
  }
  showToast('记录更新成功', 'success');
}

function _recordsDeleteRecord(id) {
  switch (_recordsCurrentType) {
    case 'activity': store.deleteActivity(id); break;
    case 'reading': store.deleteReading(id); break;
    case 'confusion': store.deleteConfusion(id); break;
    case 'progress': store.deleteProgress(id); break;
  }
  showToast('记录已删除', 'success');
  _recordsRender();
}

// ============================================
// [11/16] js/modules/timeline.js - 时间轴模块
// ============================================

var _timelineCurrentChild = null;
var _timelineCurrentFilter = 'all';

function initTimeline() {
  _timelineRender();
}

function _timelineRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();

  container.innerHTML = `
    <div class="child-tabs">
      <div class="child-tab child-1 ${!_timelineCurrentChild ? 'active' : ''}" data-child="">
        <span>全部</span>
      </div>
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_timelineCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <div class="filter-bar">
      <div class="filter-chip ${_timelineCurrentFilter === 'all' ? 'active' : ''}" data-filter="all">全部</div>
      <div class="filter-chip ${_timelineCurrentFilter === 'activity' ? 'active' : ''}" data-filter="activity">🌱 活动</div>
      <div class="filter-chip ${_timelineCurrentFilter === 'reading' ? 'active' : ''}" data-filter="reading">📚 阅读</div>
      <div class="filter-chip ${_timelineCurrentFilter === 'confusion' ? 'active' : ''}" data-filter="confusion">❓ 困惑</div>
      <div class="filter-chip ${_timelineCurrentFilter === 'progress' ? 'active' : ''}" data-filter="progress">⭐ 进步</div>
      <div class="filter-chip ${_timelineCurrentFilter === 'reflection' ? 'active' : ''}" data-filter="reflection">💭 反思</div>
    </div>

    <div class="timeline" id="timeline-container">
      ${_timelineRenderTimeline()}
    </div>
  `;

  _timelineBindEvents();
}

function _timelineRenderTimeline() {
  const records = _timelineGetAllRecords();

  if (records.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <div class="empty-state-title">还没有记录</div>
        <div class="empty-state-text">开始记录孩子的成长轨迹吧</div>
      </div>
    `;
  }

  const grouped = {};
  records.forEach(record => {
    const date = record.date;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(record);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return sortedDates.map(date => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${formatDate(date)}</div>
      <div class="timeline-card">
        ${grouped[date].map(record => _timelineRenderRecord(record)).join('')}
      </div>
    </div>
  `).join('');
}

function _timelineGetAllRecords() {
  let records = [];

  if (_timelineCurrentFilter === 'all' || _timelineCurrentFilter === 'activity') {
    records = records.concat(store.getActivities(_timelineCurrentChild).map(r => ({ ...r, type: 'activity' })));
  }
  if (_timelineCurrentFilter === 'all' || _timelineCurrentFilter === 'reading') {
    records = records.concat(store.getReadings(_timelineCurrentChild).map(r => ({ ...r, type: 'reading' })));
  }
  if (_timelineCurrentFilter === 'all' || _timelineCurrentFilter === 'confusion') {
    records = records.concat(store.getConfusions(_timelineCurrentChild).map(r => ({ ...r, type: 'confusion' })));
  }
  if (_timelineCurrentFilter === 'all' || _timelineCurrentFilter === 'progress') {
    records = records.concat(store.getProgresses(_timelineCurrentChild).map(r => ({ ...r, type: 'progress' })));
  }
  if (_timelineCurrentFilter === 'all' || _timelineCurrentFilter === 'reflection') {
    records = records.concat(store.getReflections(_timelineCurrentChild).map(r => ({ ...r, type: 'reflection' })));
  }

  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function _timelineRenderRecord(record) {
  const children = store.getChildren();
  const child = children.find(c => c.id === record.childId);
  const icon = _timelineGetTypeIcon(record.type);
  const typeName = _timelineGetTypeName(record.type);

  return `
    <div style="display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3) 0;">
      <div class="record-icon ${record.type}" style="width: 32px; height: 32px; font-size: 16px;">${icon}</div>
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1);">
          <span class="tag tag-primary" style="font-size: 10px;">${typeName}</span>
          <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${child?.avatar || ''} ${child?.name || ''}</span>
        </div>
        <div style="font-weight: 500; margin-bottom: var(--space-1);">${escapeHtml(record.title || '未命名')}</div>
        ${record.description ? `<div style="font-size: var(--text-sm); color: var(--color-text-secondary);">${escapeHtml(record.description).substring(0, 100)}${record.description.length > 100 ? '...' : ''}</div>` : ''}
        ${record.tags && record.tags.length > 0 ? `
          <div style="display: flex; gap: var(--space-1); margin-top: var(--space-2); flex-wrap: wrap;">
            ${record.tags.map(tag => `<span class="tag tag-primary" style="font-size: 10px;">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function _timelineGetTypeIcon(type) {
  const icons = { activity: '🌱', reading: '📚', confusion: '❓', progress: '⭐', reflection: '💭' };
  return icons[type] || '📝';
}

function _timelineGetTypeName(type) {
  const names = { activity: '活动', reading: '阅读', confusion: '困惑', progress: '进步', reflection: '反思' };
  return names[type] || type;
}

function _timelineBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _timelineCurrentChild = tab.dataset.child || null;
      _timelineRender();
    });
  });

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _timelineCurrentFilter = chip.dataset.filter;
      _timelineRender();
    });
  });
}

// ============================================
// [12/16] js/modules/reflection.js - 反思模块
// ============================================

var _reflectionCurrentChild = 'child_1';
var _reflectionCurrentQuestion = null;
var _reflectionEditingId = null;

function initReflection() {
  _reflectionCurrentQuestion = getRandomQuestion();
  _reflectionRender();
}

function _reflectionRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const reflections = store.getReflections(_reflectionCurrentChild);

  container.innerHTML = `
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_reflectionCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <h3 class="card-title">💭 今日反思</h3>
        <button class="btn btn-ghost btn-sm" id="refresh-question">换个问题</button>
      </div>
      <div class="card-body">
        <div class="reflection-question">
          ${escapeHtml(_reflectionCurrentQuestion)}
        </div>
        <div style="margin-top: var(--space-4);">
          <textarea id="reflection-answer" class="form-textarea" placeholder="写下你的想法..." style="min-height: 120px;"></textarea>
        </div>
        <div style="margin-top: var(--space-4); display: flex; gap: var(--space-3); align-items: center;">
          <div style="display: flex; gap: var(--space-2);">
            ${MOOD_OPTIONS.map(m => `
              <label style="cursor: pointer; font-size: 20px; padding: var(--space-1); border-radius: var(--radius-full); border: 1px solid transparent; transition: all 0.2s;" data-mood="${m.value}">
                <input type="radio" name="mood" value="${m.value}" style="display: none;">
                <span>${m.icon}</span>
              </label>
            `).join('')}
          </div>
          <div style="flex: 1;"></div>
          <button class="btn btn-primary" id="save-reflection">保存反思</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📝 反思记录</h3>
        <span class="text-muted" style="font-size: var(--text-sm);">共 ${reflections.length} 条</span>
      </div>
      <div class="card-body">
        ${reflections.length === 0 ? `
          <div class="empty-state" style="padding: var(--space-6);">
            <div class="empty-state-icon">💭</div>
            <div class="empty-state-title">还没有反思记录</div>
            <div class="empty-state-text">开始今天的反思吧</div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${reflections.map(r => _reflectionRenderItem(r)).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  _reflectionBindEvents();
}

function _reflectionRenderItem(reflection) {
  const children = store.getChildren();
  const child = children.find(c => c.id === reflection.childId);

  return `
    <div class="reflection-card">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${child?.avatar || ''} ${child?.name || ''}</span>
          <span style="font-size: var(--text-xs); color: var(--color-text-muted);">·</span>
          <span style="font-size: var(--text-xs); color: var(--color-text-muted);">${formatDate(reflection.date, 'short')}</span>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          ${reflection.mood ? `<span>${MOOD_OPTIONS.find(m => m.value === reflection.mood)?.icon || ''}</span>` : ''}
          <button class="btn btn-ghost btn-sm delete-reflection" data-id="${reflection.id}" style="color: var(--color-error); font-size: var(--text-xs);">删除</button>
        </div>
      </div>
      <div class="reflection-question" style="font-size: var(--text-sm); padding: var(--space-3);">
        ${escapeHtml(reflection.question)}
      </div>
      ${reflection.answer ? `
        <div class="reflection-answer">
          <div style="font-size: var(--text-sm);">${escapeHtml(reflection.answer)}</div>
        </div>
      ` : ''}
      ${reflection.momComment ? `
        <div class="reflection-comment">
          <div style="font-size: var(--text-xs); color: var(--color-child1); margin-bottom: var(--space-1);">妈妈的回复</div>
          <div style="font-size: var(--text-sm);">${escapeHtml(reflection.momComment)}</div>
        </div>
      ` : ''}
      <div style="margin-top: var(--space-3);">
        <button class="btn btn-ghost btn-sm add-comment-btn" data-id="${reflection.id}">添加妈妈点评</button>
      </div>
    </div>
  `;
}

function _reflectionBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _reflectionCurrentChild = tab.dataset.child;
      _reflectionRender();
    });
  });

  document.getElementById('refresh-question')?.addEventListener('click', () => {
    _reflectionCurrentQuestion = getRandomQuestion();
    document.querySelector('.reflection-question').textContent = _reflectionCurrentQuestion;
  });

  document.querySelectorAll('[data-mood]').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('[data-mood]').forEach(l => {
        l.style.borderColor = 'transparent';
      });
      label.style.borderColor = 'var(--color-primary)';
      label.querySelector('input').checked = true;
    });
  });

  document.getElementById('save-reflection')?.addEventListener('click', _reflectionSave);

  document.querySelectorAll('.delete-reflection').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('确定要删除这条反思吗？')) {
        store.deleteReflection(btn.dataset.id);
        showToast('反思已删除', 'success');
        _reflectionRender();
      }
    });
  });

  document.querySelectorAll('.add-comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _reflectionShowCommentModal(btn.dataset.id);
    });
  });
}

function _reflectionSave() {
  const answer = document.getElementById('reflection-answer')?.value;
  const moodInput = document.querySelector('input[name="mood"]:checked');

  if (!answer?.trim()) {
    showToast('请写下你的想法', 'error');
    return;
  }

  store.addReflection({
    childId: _reflectionCurrentChild,
    date: getToday(),
    question: _reflectionCurrentQuestion,
    answer: answer.trim(),
    mood: moodInput?.value || ''
  });

  showToast('反思保存成功', 'success');
  _reflectionCurrentQuestion = getRandomQuestion();
  _reflectionRender();
}

function _reflectionShowCommentModal(reflectionId) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">妈妈点评</h3>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">写下你的回复</label>
          <textarea id="comment-text" class="form-textarea" placeholder="鼓励孩子、分享你的感受..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-comment">取消</button>
        <button class="btn btn-primary" id="save-comment">保存</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('#cancel-comment').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector('#save-comment').addEventListener('click', () => {
    const comment = modal.querySelector('#comment-text').value;
    if (!comment.trim()) {
      showToast('请写下点评内容', 'error');
      return;
    }

    store.updateReflection(reflectionId, { momComment: comment.trim() });
    showToast('点评保存成功', 'success');
    modal.remove();
    _reflectionRender();
  });
}

// ============================================
// [13/16] js/modules/assessment.js - 评估模块（雷达图）
// ============================================

var _assessmentCurrentChild = 'child_1';
var _assessmentEditingId = null;

function initAssessment(params = {}) {
  if (params.id) _assessmentEditingId = params.id;
  _assessmentRender();
}

function _assessmentRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const assessments = store.getAssessments(_assessmentCurrentChild);
  const latest = assessments[0];

  container.innerHTML = `
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_assessmentCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <h3 class="card-title">📊 成长评估</h3>
        <button class="btn btn-primary btn-sm" id="add-assessment-btn">+ 新建评估</button>
      </div>
      <div class="card-body">
        ${latest ? `
          <div style="display: flex; gap: var(--space-8); align-items: flex-start;">
            <div class="radar-chart-container">
              <canvas id="radar-chart"></canvas>
            </div>
            <div style="flex: 1;">
              <div style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-3);">
                评估时间：${formatDate(latest.date, 'short')} · ${latest.period || ''}
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-4);">
                ${ASSESSMENT_DIMENSIONS.map(dim => `
                  <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <span>${dim.icon}</span>
                    <span style="font-size: var(--text-sm);">${dim.name}</span>
                    <span style="margin-left: auto; font-weight: 600; color: ${dim.color};">${latest.scores?.[dim.key] || 0}</span>
                  </div>
                `).join('')}
              </div>
              ${latest.strengths?.length > 0 ? `
                <div style="margin-bottom: var(--space-3);">
                  <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">优势</div>
                  <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                    ${latest.strengths.map(s => `<span class="tag tag-success">${escapeHtml(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${latest.areasToImprove?.length > 0 ? `
                <div>
                  <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-1);">待提升</div>
                  <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                    ${latest.areasToImprove.map(s => `<span class="tag tag-warning">${escapeHtml(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <div class="empty-state-title">还没有评估记录</div>
            <div class="empty-state-text">点击"新建评估"开始</div>
          </div>
        `}
      </div>
    </div>

    ${assessments.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📋 评估历史</h3>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${assessments.map(a => _assessmentRenderItem(a)).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    <div class="modal-overlay" id="assessment-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">新建成长评估</h3>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="assessment-form">
            <input type="hidden" name="childId" value="${_assessmentCurrentChild}">
            <div class="form-group">
              <label class="form-label">评估周期</label>
              <input type="text" name="period" class="form-input" placeholder="例如：2026年6月" value="${new Date().getFullYear()}年${new Date().getMonth() + 1}月">
            </div>
            <div class="form-group">
              <label class="form-label">评估日期</label>
              <input type="date" name="date" class="form-input" value="${getToday()}">
            </div>
            ${ASSESSMENT_DIMENSIONS.map(dim => `
              <div class="form-group">
                <label class="form-label">${dim.icon} ${dim.name}（${Math.round(dim.weight * 100)}%）</label>
                <div class="slider-container">
                  <input type="range" name="score_${dim.key}" class="slider" min="0" max="100" value="70" data-key="${dim.key}">
                  <div class="slider-value">70</div>
                </div>
              </div>
            `).join('')}
            <div class="form-group">
              <label class="form-label">优势</label>
              <input type="text" name="strengths" class="form-input" placeholder="用逗号分隔，例如：观察力强,善于提问">
            </div>
            <div class="form-group">
              <label class="form-label">待提升</label>
              <input type="text" name="areasToImprove" class="form-input" placeholder="用逗号分隔，例如：情绪表达,耐心">
            </div>
            <div class="form-group">
              <label class="form-label">评估备注</label>
              <textarea name="notes" class="form-textarea" placeholder="其他观察和记录..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-btn">取消</button>
          <button class="btn btn-primary" id="save-btn">保存评估</button>
        </div>
      </div>
    </div>
  `;

  _assessmentBindEvents();

  if (latest) {
    setTimeout(() => _assessmentDrawRadarChart(latest.scores), 100);
  }
}

function _assessmentRenderItem(assessment) {
  return `
    <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
      <div style="flex: 1;">
        <div style="font-weight: 500;">${escapeHtml(assessment.period || formatDate(assessment.date, 'short'))}</div>
        <div style="font-size: var(--text-xs); color: var(--color-text-muted);">${formatDate(assessment.date)}</div>
      </div>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        ${ASSESSMENT_DIMENSIONS.slice(0, 3).map(dim => `
          <span class="tag" style="background: ${dim.color}20; color: ${dim.color};">${dim.name}: ${assessment.scores?.[dim.key] || 0}</span>
        `).join('')}
      </div>
      <button class="btn btn-ghost btn-sm delete-assessment" data-id="${assessment.id}" style="color: var(--color-error);">删除</button>
    </div>
  `;
}

function _assessmentDrawRadarChart(scores) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const size = 400;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const dimensions = ASSESSMENT_DIMENSIONS;
  const angleStep = (Math.PI * 2) / dimensions.length;

  ctx.clearRect(0, 0, size, size);

  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    ctx.beginPath();
    for (let i = 0; i <= dimensions.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#e8e6e1';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  dimensions.forEach((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.strokeStyle = '#e8e6e1';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.beginPath();
  dimensions.forEach((dim, i) => {
    const value = (scores[dim.key] || 0) / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * value * Math.cos(angle);
    const y = centerY + radius * value * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(74, 122, 89, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#4a7a59';
  ctx.lineWidth = 2;
  ctx.stroke();

  dimensions.forEach((dim, i) => {
    const value = (scores[dim.key] || 0) / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * value * Math.cos(angle);
    const y = centerY + radius * value * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = dim.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  dimensions.forEach((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);

    ctx.fillStyle = '#2c3e2d';
    ctx.font = '14px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${dim.icon} ${dim.name}`, x, y);
  });
}

function _assessmentBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _assessmentCurrentChild = tab.dataset.child;
      _assessmentRender();
    });
  });

  document.getElementById('add-assessment-btn')?.addEventListener('click', () => {
    document.getElementById('assessment-modal').classList.add('active');
  });

  document.getElementById('modal-close')?.addEventListener('click', _assessmentCloseModal);
  document.getElementById('cancel-btn')?.addEventListener('click', _assessmentCloseModal);
  document.getElementById('save-btn')?.addEventListener('click', _assessmentSave);

  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      e.target.nextElementSibling.textContent = e.target.value;
    });
  });

  document.querySelectorAll('.delete-assessment').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('确定要删除这条评估吗？')) {
        store.deleteAssessment(btn.dataset.id);
        showToast('评估已删除', 'success');
        _assessmentRender();
      }
    });
  });
}

function _assessmentCloseModal() {
  document.getElementById('assessment-modal').classList.remove('active');
}

function _assessmentSave() {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  const formData = new FormData(form);
  const scores = {};

  ASSESSMENT_DIMENSIONS.forEach(dim => {
    const key = `score_${dim.key}`;
    scores[dim.key] = parseInt(formData.get(key)) || 70;
  });

  const strengths = formData.get('strengths')?.split(/[,，]/).map(s => s.trim()).filter(Boolean) || [];
  const areasToImprove = formData.get('areasToImprove')?.split(/[,，]/).map(s => s.trim()).filter(Boolean) || [];

  store.addAssessment({
    childId: _assessmentCurrentChild,
    date: formData.get('date') || getToday(),
    period: formData.get('period'),
    scores,
    strengths,
    areasToImprove,
    notes: formData.get('notes')
  });

  showToast('评估保存成功', 'success');
  _assessmentCloseModal();
  _assessmentRender();
}

// ============================================
// [14/16] js/modules/achievements.js - 成就徽章系统
// ============================================

var _achievementsCurrentChild = 'child_1';

function initAchievements() {
  _achievementsRender();
}

function _achievementsRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const unlocked = store.getAchievements(_achievementsCurrentChild);
  const unlockedIds = new Set(unlocked.map(a => a.badgeId));

  container.innerHTML = `
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_achievementsCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-body">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary);">
              ${unlocked.length} / ${ACHIEVEMENTS.length}
            </div>
            <div style="font-size: var(--text-sm); color: var(--color-text-muted);">已解锁成就</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-gold);">
              ${Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
            </div>
            <div style="font-size: var(--text-sm); color: var(--color-text-muted);">完成度</div>
          </div>
        </div>
        <div class="progress" style="margin-top: var(--space-4);">
          <div class="progress-bar" style="width: ${(unlocked.length / ACHIEVEMENTS.length) * 100}%; background: linear-gradient(90deg, var(--color-primary), var(--color-gold));"></div>
        </div>
      </div>
    </div>

    ${ACHIEVEMENT_CATEGORIES.map(category => {
      const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category.id);
      const categoryUnlocked = categoryAchievements.filter(a => unlockedIds.has(a.id));

      return `
        <div class="card" style="margin-bottom: var(--space-4);">
          <div class="card-header">
            <h3 class="card-title">${category.icon} ${category.name}</h3>
            <span class="text-muted" style="font-size: var(--text-sm);">${categoryUnlocked.length} / ${categoryAchievements.length}</span>
          </div>
          <div class="card-body">
            <div class="achievement-grid">
              ${categoryAchievements.map(achievement => {
                const isUnlocked = unlockedIds.has(achievement.id);
                const record = unlocked.find(a => a.badgeId === achievement.id);

                return `
                  <div class="achievement-item ${isUnlocked ? '' : 'locked'}" data-id="${achievement.id}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${escapeHtml(achievement.name)}</div>
                    <div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-1);">
                      ${escapeHtml(achievement.description)}
                    </div>
                    ${isUnlocked && record?.unlockedAt ? `
                      <div style="font-size: 10px; color: var(--color-success); margin-top: var(--space-2);">
                        ✓ ${record.unlockedAt}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;

  _achievementsBindEvents();
}

function _achievementsBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _achievementsCurrentChild = tab.dataset.child;
      _achievementsRender();
    });
  });

  document.querySelectorAll('.achievement-item:not(.locked)').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(1.1)';
      setTimeout(() => {
        item.style.transform = '';
      }, 200);
    });
  });
}

// 检查并解锁成就
function checkAchievements(childId) {
  const activities = store.getActivities(childId);
  const readings = store.getReadings(childId);
  const confusions = store.getConfusions(childId);
  const progresses = store.getProgresses(childId);
  const reflections = store.getReflections(childId);

  const newAchievements = [];

  const completedReadings = readings.filter(r => r.status === '已完成');
  const readingsWithThoughts = readings.filter(r => r.thoughts?.trim());

  _achievementsCheckAndUnlock(childId, 'bookworm_1', completedReadings.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'bookworm_5', completedReadings.length >= 5, newAchievements);
  _achievementsCheckAndUnlock(childId, 'bookworm_10', completedReadings.length >= 10, newAchievements);
  _achievementsCheckAndUnlock(childId, 'bookworm_20', completedReadings.length >= 20, newAchievements);
  _achievementsCheckAndUnlock(childId, 'reviewer_3', readingsWithThoughts.length >= 3, newAchievements);

  const explorationActivities = activities.filter(a => a.category === '社区探索');
  const scienceActivities = activities.filter(a => a.category === '科学实验');

  _achievementsCheckAndUnlock(childId, 'explorer_1', explorationActivities.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'explorer_5', explorationActivities.length >= 5, newAchievements);
  _achievementsCheckAndUnlock(childId, 'explorer_10', explorationActivities.length >= 10, newAchievements);
  _achievementsCheckAndUnlock(childId, 'scientist_1', scienceActivities.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'scientist_5', scienceActivities.length >= 5, newAchievements);

  _achievementsCheckAndUnlock(childId, 'progress_1', progresses.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'progress_5', progresses.length >= 5, newAchievements);
  _achievementsCheckAndUnlock(childId, 'progress_10', progresses.length >= 10, newAchievements);

  const independentProgress = progresses.filter(p => p.category === '独立性');
  _achievementsCheckAndUnlock(childId, 'independent_3', independentProgress.length >= 3, newAchievements);

  _achievementsCheckAndUnlock(childId, 'thinker_1', reflections.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'thinker_5', reflections.length >= 5, newAchievements);
  _achievementsCheckAndUnlock(childId, 'thinker_10', reflections.length >= 10, newAchievements);

  _achievementsCheckAndUnlock(childId, 'questioner_1', confusions.length >= 1, newAchievements);
  _achievementsCheckAndUnlock(childId, 'questioner_5', confusions.length >= 5, newAchievements);

  const resolvedConfusions = confusions.filter(c => c.status === '已解决');
  _achievementsCheckAndUnlock(childId, 'resolver_3', resolvedConfusions.length >= 3, newAchievements);

  if (newAchievements.length > 0) {
    _achievementsShowNotification(newAchievements);
  }

  return newAchievements;
}

function _achievementsCheckAndUnlock(childId, badgeId, condition, newAchievements) {
  if (!condition) return;

  const achievement = ACHIEVEMENTS.find(a => a.id === badgeId);
  if (!achievement) return;

  const existing = store.getAchievements(childId).find(a => a.badgeId === badgeId);
  if (existing) return;

  const record = store.unlockAchievement(
    childId,
    badgeId,
    achievement.name,
    achievement.description,
    achievement.icon
  );

  if (record) {
    newAchievements.push(achievement);
  }
}

function _achievementsShowNotification(achievements) {
  achievements.forEach((achievement, index) => {
    setTimeout(() => {
      const notification = document.createElement('div');
      notification.className = 'achievement-notification';
      notification.innerHTML = `
        <div class="achievement-notification-icon">${achievement.icon}</div>
        <div class="achievement-notification-content">
          <div class="achievement-notification-title">成就解锁！</div>
          <div class="achievement-notification-name">${escapeHtml(achievement.name)}</div>
          <div class="achievement-notification-desc">${escapeHtml(achievement.description)}</div>
        </div>
      `;

      notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #fff9e6, #fff3cc);
        border: 2px solid var(--color-gold);
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }, 4000);
    }, index * 1000);
  });
}

// ============================================
// [15/16] js/modules/statistics.js - 数据统计模块
// ============================================

var _statisticsCurrentChild = null;

function initStatistics() {
  _statisticsRender();
}

function _statisticsRender() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const stats = store.getStats(_statisticsCurrentChild);

  container.innerHTML = `
    <div class="child-tabs">
      <div class="child-tab child-1 ${!_statisticsCurrentChild ? 'active' : ''}" data-child="">
        <span>全部</span>
      </div>
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${_statisticsCurrentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon activities">🌱</div>
        <div class="stat-value">${stats.totalActivities}</div>
        <div class="stat-label">活动总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reading">📚</div>
        <div class="stat-value">${stats.totalReadings}</div>
        <div class="stat-label">阅读总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon achievements">⭐</div>
        <div class="stat-value">${stats.totalProgresses}</div>
        <div class="stat-label">进步记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reflections">💭</div>
        <div class="stat-value">${stats.totalReflections}</div>
        <div class="stat-label">反思记录</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">📈 月度趋势</h3>
        </div>
        <canvas id="trend-chart" class="chart-canvas"></canvas>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">🎯 活动类型分布</h3>
        </div>
        <canvas id="category-chart" class="chart-canvas"></canvas>
      </div>
    </div>

    <div class="card" style="margin-top: var(--space-6);">
      <div class="card-header">
        <h3 class="card-title">📝 最近活动</h3>
      </div>
      <div class="card-body">
        ${stats.recentActivities.length === 0 ? `
          <div class="empty-state" style="padding: var(--space-4);">
            <div class="empty-state-text">暂无活动记录</div>
          </div>
        ` : `
          <div class="record-list">
            ${stats.recentActivities.map(a => `
              <div class="record-item">
                <div class="record-icon activity">🌱</div>
                <div class="record-content">
                  <div class="record-title">${escapeHtml(a.title || '未命名')}</div>
                  <div class="record-meta">
                    <span>${formatDate(a.date, 'short')}</span>
                    <span>${escapeHtml(a.category || '')}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <div class="card" style="margin-top: var(--space-4);">
      <div class="card-header">
        <h3 class="card-title">📚 最近阅读</h3>
      </div>
      <div class="card-body">
        ${stats.recentReadings.length === 0 ? `
          <div class="empty-state" style="padding: var(--space-4);">
            <div class="empty-state-text">暂无阅读记录</div>
          </div>
        ` : `
          <div class="record-list">
            ${stats.recentReadings.map(r => `
              <div class="record-item">
                <div class="record-icon reading">📚</div>
                <div class="record-content">
                  <div class="record-title">${escapeHtml(r.title || '未命名')}</div>
                  <div class="record-meta">
                    <span>${escapeHtml(r.author || '')}</span>
                    <span>${r.status || '在读'}</span>
                    ${r.rating ? `<span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  _statisticsBindEvents();

  setTimeout(() => {
    _statisticsDrawTrendChart(stats.monthlyStats);
    _statisticsDrawCategoryChart(stats);
  }, 100);
}

function _statisticsDrawTrendChart(monthlyStats) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.clientWidth - 48;
  const height = 300;
  canvas.width = width;
  canvas.height = height;

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: getMonthName(date.getMonth())
    });
  }

  const data = months.map(m => ({
    label: m.label,
    activities: monthlyStats[m.key]?.activities || 0,
    readings: monthlyStats[m.key]?.readings || 0
  }));

  const maxValue = Math.max(...data.map(d => Math.max(d.activities, d.readings)), 1);

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = '#e8e6e1';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = '#9ca89e';
    ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxValue - (maxValue / 4) * i), padding.left - 8, y + 4);
  }

  const drawLine = (dataKey, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const y = padding.top + chartHeight - (d[dataKey] / maxValue) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    data.forEach((d, i) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const y = padding.top + chartHeight - (d[dataKey] / maxValue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  drawLine('activities', '#4a7a59');
  drawLine('readings', '#5c6bc0');

  ctx.fillStyle = '#9ca89e';
  ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  data.forEach((d, i) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * i;
    ctx.fillText(d.label, x, height - 10);
  });

  ctx.fillStyle = '#4a7a59';
  ctx.fillRect(width - 120, 10, 12, 12);
  ctx.fillStyle = '#2c3e2d';
  ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('活动', width - 104, 20);

  ctx.fillStyle = '#5c6bc0';
  ctx.fillRect(width - 120, 28, 12, 12);
  ctx.fillStyle = '#2c3e2d';
  ctx.fillText('阅读', width - 104, 38);
}

function _statisticsDrawCategoryChart(stats) {
  const canvas = document.getElementById('category-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.clientWidth - 48;
  const height = 300;
  canvas.width = width;
  canvas.height = height;

  const activities = store.getActivities(_statisticsCurrentChild);
  const categoryCount = {};
  activities.forEach(a => {
    const cat = a.category || '其他';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const categories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  const total = categories.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    ctx.fillStyle = '#9ca89e';
    ctx.font = '14px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', width / 2, height / 2);
    return;
  }

  const colors = ['#4a7a59', '#5c6bc0', '#ec407a', '#ff9800', '#9c27b0', '#00bcd4', '#607d8b'];
  const centerX = width * 0.35;
  const centerY = height / 2;
  const radius = Math.min(width * 0.3, height * 0.4);

  let startAngle = -Math.PI / 2;

  categories.forEach(([name, count], i) => {
    const sliceAngle = (count / total) * Math.PI * 2;
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    startAngle += sliceAngle;
  });

  const legendX = width * 0.7;
  let legendY = 30;

  categories.forEach(([name, count], i) => {
    const color = colors[i % colors.length];

    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY, 12, 12);

    ctx.fillStyle = '#2c3e2d';
    ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${name} (${count})`, legendX + 20, legendY + 10);

    legendY += 24;
  });
}

function _statisticsBindEvents() {
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _statisticsCurrentChild = tab.dataset.child || null;
      _statisticsRender();
    });
  });
}

// ============================================
// [16/16] js/app.js - 主入口
// ============================================

// 初始化应用
function init() {
  // 渲染侧边栏
  _appRenderSidebar();

  // 注册路由
  router
    .register('/', () => initDashboard())
    .register('/records', (params) => initRecords(params))
    .register('/assessment', (params) => initAssessment(params))
    .register('/timeline', () => initTimeline())
    .register('/reflection', () => initReflection())
    .register('/achievements', () => initAchievements())
    .register('/statistics', () => initStatistics());

  // 监听路由变化，更新导航状态
  router.onRouteChange = (path) => {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === path);
    });
  };

  // 启动路由
  router.start();

  // 绑定移动端菜单
  _appBindMobileMenu();
}

// 渲染侧边栏
function _appRenderSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">🌱</div>
        <div class="sidebar-logo-text">成长档案</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">总览</div>
        <a class="nav-item active" data-route="/" href="#/">
          <span class="nav-item-icon">🏠</span>
          <span>首页</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">记录</div>
        <a class="nav-item" data-route="/records" href="#/records">
          <span class="nav-item-icon">📝</span>
          <span>成长记录</span>
        </a>
        <a class="nav-item" data-route="/timeline" href="#/timeline">
          <span class="nav-item-icon">📅</span>
          <span>时间轴</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">成长</div>
        <a class="nav-item" data-route="/assessment" href="#/assessment">
          <span class="nav-item-icon">📊</span>
          <span>成长评估</span>
        </a>
        <a class="nav-item" data-route="/reflection" href="#/reflection">
          <span class="nav-item-icon">💭</span>
          <span>反思空间</span>
        </a>
        <a class="nav-item" data-route="/achievements" href="#/achievements">
          <span class="nav-item-icon">🏆</span>
          <span>成就殿堂</span>
        </a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">分析</div>
        <a class="nav-item" data-route="/statistics" href="#/statistics">
          <span class="nav-item-icon">📈</span>
          <span>数据统计</span>
        </a>
      </div>
      <div class="nav-section" style="margin-top: auto; padding-top: var(--space-4); border-top: 1px solid var(--color-border-light);">
        <a class="nav-item" id="child-view-link" href="child.html" target="_blank">
          <span class="nav-item-icon">👶</span>
          <span>孩子视图</span>
        </a>
        <a class="nav-item" id="export-link" href="#">
          <span class="nav-item-icon">💾</span>
          <span>导出数据</span>
        </a>
      </div>
    </nav>
  `;

  // 绑定导出事件
  document.getElementById('export-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    _appShowExportMenu();
  });
}

// 显示导出菜单
function _appShowExportMenu() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">导出数据</h3>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: var(--space-4);" id="export-json">
            <span>📄</span>
            <span>导出为 JSON（完整数据备份）</span>
          </button>
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: var(--space-4);" id="export-csv">
            <span>📊</span>
            <span>导出为 CSV（可用 Excel 打开）</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // 直接调用全局函数，不再需要动态 import
  modal.querySelector('#export-json').addEventListener('click', () => {
    exportAsJSON();
    modal.remove();
  });

  modal.querySelector('#export-csv').addEventListener('click', () => {
    exportAsCSV();
    modal.remove();
  });
}

// 移动端菜单
function _appBindMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);

})(); // end IIFE
