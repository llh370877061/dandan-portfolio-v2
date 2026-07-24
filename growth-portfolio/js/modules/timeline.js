// ============================================
// 成长档案 - 时间轴模块
// ============================================

import { store } from '../store.js';
import { formatDate, escapeHtml } from '../utils/helpers.js';

let currentChild = null;
let currentFilter = 'all';

export function initTimeline() {
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      <div class="child-tab child-1 ${!currentChild ? 'active' : ''}" data-child="">
        <span>全部</span>
      </div>
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${currentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-chip ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">全部</div>
      <div class="filter-chip ${currentFilter === 'activity' ? 'active' : ''}" data-filter="activity">🌱 活动</div>
      <div class="filter-chip ${currentFilter === 'reading' ? 'active' : ''}" data-filter="reading">📚 阅读</div>
      <div class="filter-chip ${currentFilter === 'confusion' ? 'active' : ''}" data-filter="confusion">❓ 困惑</div>
      <div class="filter-chip ${currentFilter === 'progress' ? 'active' : ''}" data-filter="progress">⭐ 进步</div>
      <div class="filter-chip ${currentFilter === 'reflection' ? 'active' : ''}" data-filter="reflection">💭 反思</div>
    </div>

    <!-- 时间轴 -->
    <div class="timeline" id="timeline-container">
      ${renderTimeline()}
    </div>
  `;

  bindEvents();
}

function renderTimeline() {
  const records = getAllRecords();

  if (records.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <div class="empty-state-title">还没有记录</div>
        <div class="empty-state-text">开始记录孩子的成长轨迹吧</div>
      </div>
    `;
  }

  // 按日期分组
  const grouped = {};
  records.forEach(record => {
    const date = record.date;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(record);
  });

  // 按日期倒序排列
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return sortedDates.map(date => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${formatDate(date)}</div>
      <div class="timeline-card">
        ${grouped[date].map(record => renderTimelineRecord(record)).join('')}
      </div>
    </div>
  `).join('');
}

function getAllRecords() {
  let records = [];

  if (currentFilter === 'all' || currentFilter === 'activity') {
    records = records.concat(store.getActivities(currentChild).map(r => ({ ...r, type: 'activity' })));
  }
  if (currentFilter === 'all' || currentFilter === 'reading') {
    records = records.concat(store.getReadings(currentChild).map(r => ({ ...r, type: 'reading' })));
  }
  if (currentFilter === 'all' || currentFilter === 'confusion') {
    records = records.concat(store.getConfusions(currentChild).map(r => ({ ...r, type: 'confusion' })));
  }
  if (currentFilter === 'all' || currentFilter === 'progress') {
    records = records.concat(store.getProgresses(currentChild).map(r => ({ ...r, type: 'progress' })));
  }
  if (currentFilter === 'all' || currentFilter === 'reflection') {
    records = records.concat(store.getReflections(currentChild).map(r => ({ ...r, type: 'reflection' })));
  }

  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderTimelineRecord(record) {
  const children = store.getChildren();
  const child = children.find(c => c.id === record.childId);
  const icon = getTypeIcon(record.type);
  const typeName = getTypeName(record.type);

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

function getTypeIcon(type) {
  const icons = { activity: '🌱', reading: '📚', confusion: '❓', progress: '⭐', reflection: '💭' };
  return icons[type] || '📝';
}

function getTypeName(type) {
  const names = { activity: '活动', reading: '阅读', confusion: '困惑', progress: '进步', reflection: '反思' };
  return names[type] || type;
}

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child || null;
      render();
    });
  });

  // 筛选
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentFilter = chip.dataset.filter;
      render();
    });
  });
}

export default { initTimeline };
