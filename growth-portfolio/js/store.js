// ============================================
// 成长档案 - 数据存储管理
// ============================================

const STORAGE_KEY = 'growth_archive';

// 生成唯一 ID
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// 获取当前时间戳
function getNow() {
  return new Date().toISOString();
}

// 获取今天日期
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 默认数据结构
const DEFAULT_DATA = {
  config: {
    familyName: '我们的家庭',
    children: [
      {
        id: 'child_1',
        name: '女儿',
        age: 11,
        avatar: '🌸',
        color: '#e8a0bf',
        createdAt: getToday()
      },
      {
        id: 'child_2',
        name: '儿子',
        age: 9,
        avatar: '🌟',
        color: '#7eb8da',
        createdAt: getToday()
      }
    ],
    createdAt: getToday()
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
        // 合并默认数据，确保新字段存在
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

    // 深度合并配置
    if (stored.config) {
      defaults.config = { ...defaults.config, ...stored.config };
      if (stored.config.children) {
        defaults.config.children = stored.config.children;
      }
    }

    // 合并记录
    if (stored.records) {
      defaults.records = { ...defaults.records, ...stored.records };
    }

    // 合并其他数组
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
    const id = generateId('listener');
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
      id: generateId('act'),
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
      id: generateId('read'),
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
      id: generateId('conf'),
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
      id: generateId('prog'),
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
      id: generateId('assess'),
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
      id: generateId('refl'),
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
    // 检查是否已解锁
    const existing = this.data.achievements.find(
      a => a.childId === childId && a.badgeId === badgeId
    );
    if (existing) return existing;

    const record = {
      id: generateId('badge'),
      childId,
      badgeId,
      name,
      description,
      icon,
      unlockedAt: getToday()
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

    // 按月统计
    const monthlyStats = {};
    const allRecords = [
      ...activities.map(a => ({ ...a, type: 'activity' })),
      ...readings.map(r => ({ ...r, type: 'reading' })),
      ...confusions.map(c => ({ ...c, type: 'confusion' })),
      ...progresses.map(p => ({ ...p, type: 'progress' }))
    ];

    allRecords.forEach(record => {
      const month = record.date.substring(0, 7); // YYYY-MM
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

export const store = new Store();
export default store;
