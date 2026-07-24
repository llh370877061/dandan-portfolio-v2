// ============================================
// 成长档案 - 首页仪表盘
// ============================================

import { store } from '../store.js';
import { formatDate, relativeTime, escapeHtml } from '../utils/helpers.js';
import { getToday, isThisWeek, isThisMonth } from '../utils/date.js';

let currentChild = null;

export function initDashboard() {
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const stats = store.getStats();

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      <div class="child-tab child-1 ${!currentChild ? 'active' : ''}" data-child="">
        <span>${children[0]?.avatar || '🌸'} ${children[0]?.name || '女儿'}</span>
      </div>
      <div class="child-tab child-2 ${currentChild === 'child_2' ? 'active' : ''}" data-child="child_2">
        <span>${children[1]?.avatar || '🌟'} ${children[1]?.name || '儿子'}</span>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon activities">🌱</div>
        <div class="stat-value">${currentChild ? getFilteredStats('activities') : stats.totalActivities}</div>
        <div class="stat-label">活动记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reading">📚</div>
        <div class="stat-value">${currentChild ? getFilteredStats('readings') : stats.totalReadings}</div>
        <div class="stat-label">阅读记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon achievements">⭐</div>
        <div class="stat-value">${currentChild ? getFilteredStats('achievements') : stats.totalAchievements}</div>
        <div class="stat-label">成就徽章</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon reflections">💭</div>
        <div class="stat-value">${currentChild ? getFilteredStats('reflections') : stats.totalReflections}</div>
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
          ${renderRecentList(getRecentActivities())}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">最近阅读</h3>
          <button class="btn btn-ghost btn-sm" data-navigate="/records">查看全部</button>
        </div>
        <div class="card-body">
          ${renderRecentReadings(getRecentReadings())}
        </div>
      </div>
    </div>

    <!-- 孩子卡片 -->
    <div class="grid grid-2" style="margin-top: var(--space-6);">
      ${children.map(child => renderChildCard(child)).join('')}
    </div>
  `;

  bindEvents();
}

function getFilteredStats(type) {
  if (!currentChild) {
    return store.getStats()[`total${type.charAt(0).toUpperCase() + type.slice(1)}`];
  }
  switch (type) {
    case 'activities': return store.getActivities(currentChild).length;
    case 'readings': return store.getReadings(currentChild).length;
    case 'achievements': return store.getAchievements(currentChild).length;
    case 'reflections': return store.getReflections(currentChild).length;
    default: return 0;
  }
}

function getRecentActivities() {
  const activities = store.getActivities(currentChild);
  return activities.slice(0, 5);
}

function getRecentReadings() {
  const readings = store.getReadings(currentChild);
  return readings.slice(0, 5);
}

function renderRecentList(activities) {
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

function renderRecentReadings(readings) {
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

function renderChildCard(child) {
  const activities = store.getActivities(child.id);
  const readings = store.getReadings(child.id);
  const achievements = store.getAchievements(child.id);

  // 本月统计
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

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child || null;
      render();
    });
  });

  // 快速操作
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

  // 导航按钮
  document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.navigate;
    });
  });
}

export default { initDashboard };
