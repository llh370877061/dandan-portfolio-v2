// ============================================
// 成长档案 - 记录模块
// ============================================

import { store } from '../store.js';
import { formatDate, escapeHtml, showToast } from '../utils/helpers.js';
import { getToday } from '../utils/date.js';
import {
  ACTIVITY_CATEGORIES,
  READING_STATUSES,
  CONFUSION_CATEGORIES,
  PROGRESS_CATEGORIES,
  MOOD_OPTIONS,
  SKILL_TAGS
} from '../data/config.js';

let currentType = 'activity';
let currentChild = 'child_1';
let editingId = null;

export function initRecords(params = {}) {
  if (params.type) currentType = params.type;
  if (params.id) editingId = params.id;
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${currentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 记录类型切换 -->
    <div class="filter-bar">
      <div class="filter-chip ${currentType === 'activity' ? 'active' : ''}" data-type="activity">🌱 活动</div>
      <div class="filter-chip ${currentType === 'reading' ? 'active' : ''}" data-type="reading">📚 阅读</div>
      <div class="filter-chip ${currentType === 'confusion' ? 'active' : ''}" data-type="confusion">❓ 困惑</div>
      <div class="filter-chip ${currentType === 'progress' ? 'active' : ''}" data-type="progress">⭐ 进步</div>
      <div style="flex: 1;"></div>
      <button class="btn btn-primary btn-sm" id="add-record-btn">+ 添加记录</button>
    </div>

    <!-- 记录列表 -->
    <div id="record-list-container">
      ${renderRecordList()}
    </div>

    <!-- 添加/编辑表单弹窗 -->
    <div class="modal-overlay" id="record-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">添加${getTypeName(currentType)}记录</h3>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="record-form">
            ${renderForm()}
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-btn">取消</button>
          <button class="btn btn-primary" id="save-btn">保存</button>
        </div>
      </div>
    </div>
  `;

  bindEvents();
}

function getTypeName(type) {
  const names = { activity: '活动', reading: '阅读', confusion: '困惑', progress: '进步' };
  return names[type] || type;
}

function renderRecordList() {
  let records = [];
  switch (currentType) {
    case 'activity': records = store.getActivities(currentChild); break;
    case 'reading': records = store.getReadings(currentChild); break;
    case 'confusion': records = store.getConfusions(currentChild); break;
    case 'progress': records = store.getProgresses(currentChild); break;
  }

  if (records.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${getIcon(currentType)}</div>
        <div class="empty-state-title">还没有${getTypeName(currentType)}记录</div>
        <div class="empty-state-text">点击"添加记录"开始记录吧</div>
      </div>
    `;
  }

  return `
    <div class="record-list">
      ${records.map(record => renderRecordItem(record)).join('')}
    </div>
  `;
}

function getIcon(type) {
  const icons = { activity: '🌱', reading: '📚', confusion: '❓', progress: '⭐' };
  return icons[type] || '📝';
}

function renderRecordItem(record) {
  let meta = '';
  let extra = '';

  switch (currentType) {
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
      <div class="record-icon ${currentType}">${getIcon(currentType)}</div>
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

function renderForm() {
  const children = store.getChildren();
  const child = children.find(c => c.id === currentChild);

  switch (currentType) {
    case 'activity': return renderActivityForm(child);
    case 'reading': return renderReadingForm(child);
    case 'confusion': return renderConfusionForm(child);
    case 'progress': return renderProgressForm(child);
    default: return '';
  }
}

function renderActivityForm(child) {
  return `
    <input type="hidden" name="childId" value="${currentChild}">
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

function renderReadingForm(child) {
  return `
    <input type="hidden" name="childId" value="${currentChild}">
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

function renderConfusionForm(child) {
  return `
    <input type="hidden" name="childId" value="${currentChild}">
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

function renderProgressForm(child) {
  return `
    <input type="hidden" name="childId" value="${currentChild}">
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

function bindEvents() {
  // 类型切换
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentType = chip.dataset.type;
      editingId = null;
      render();
    });
  });

  // 打开添加弹窗
  document.getElementById('add-record-btn')?.addEventListener('click', () => {
    editingId = null;
    openModal();
  });

  // 关闭弹窗
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal);

  // 保存
  document.getElementById('save-btn')?.addEventListener('click', saveRecord);

  // 编辑和删除
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      editingId = btn.dataset.id;
      openModal();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('确定要删除这条记录吗？')) {
        deleteRecord(btn.dataset.id);
      }
    });
  });

  // 滑块进度显示
  document.querySelector('input[name="progress"]')?.addEventListener('input', (e) => {
    e.target.nextElementSibling.textContent = e.target.value + '%';
  });

  // 评分星星
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      document.querySelectorAll('.star').forEach((s, i) => {
        s.textContent = i < value ? '★' : '☆';
      });
    });
  });

  // 心情选择
  document.querySelectorAll('input[name="mood"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name="mood"]').forEach(r => {
        r.parentElement.style.borderColor = r.checked ? 'var(--color-primary)' : 'var(--color-border)';
      });
    });
  });

  // 技能标签选择
  document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      checkbox.parentElement.style.borderColor = checkbox.checked ? 'var(--color-primary)' : 'var(--color-border)';
      checkbox.parentElement.style.background = checkbox.checked ? 'var(--color-primary-bg)' : '';
    });
  });
}

function openModal() {
  const modal = document.getElementById('record-modal');
  const title = document.getElementById('modal-title');

  if (editingId) {
    title.textContent = `编辑${getTypeName(currentType)}记录`;
    // 填充表单数据
    const record = getRecordById(editingId);
    if (record) {
      setTimeout(() => fillForm(record), 100);
    }
  } else {
    title.textContent = `添加${getTypeName(currentType)}记录`;
  }

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('record-modal').classList.remove('active');
  editingId = null;
}

function getRecordById(id) {
  switch (currentType) {
    case 'activity': return store.getActivities().find(a => a.id === id);
    case 'reading': return store.getReadings().find(r => r.id === id);
    case 'confusion': return store.getConfusions().find(c => c.id === id);
    case 'progress': return store.getProgresses().find(p => p.id === id);
    default: return null;
  }
}

function fillForm(record) {
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

function saveRecord() {
  const form = document.getElementById('record-form');
  if (!form) return;

  const formData = new FormData(form);
  const data = {};

  // 处理普通字段
  for (const [key, value] of formData.entries()) {
    if (key === 'skills') {
      if (!data.skills) data.skills = [];
      data.skills.push(value);
    } else {
      data[key] = value;
    }
  }

  // 处理技能标签
  const skillCheckboxes = form.querySelectorAll('input[name="skills"]:checked');
  data.skills = Array.from(skillCheckboxes).map(cb => cb.value);

  // 验证必填字段
  if (!data.title || !data.date) {
    showToast('请填写标题和日期', 'error');
    return;
  }

  // 保存
  if (editingId) {
    updateRecord(editingId, data);
  } else {
    addRecord(data);
  }

  closeModal();
  render();
}

function addRecord(data) {
  switch (currentType) {
    case 'activity': store.addActivity(data); break;
    case 'reading': store.addReading(data); break;
    case 'confusion': store.addConfusion(data); break;
    case 'progress': store.addProgress(data); break;
  }
  showToast('记录添加成功', 'success');
}

function updateRecord(id, data) {
  switch (currentType) {
    case 'activity': store.updateActivity(id, data); break;
    case 'reading': store.updateReading(id, data); break;
    case 'confusion': store.updateConfusion(id, data); break;
    case 'progress': store.updateProgress(id, data); break;
  }
  showToast('记录更新成功', 'success');
}

function deleteRecord(id) {
  switch (currentType) {
    case 'activity': store.deleteActivity(id); break;
    case 'reading': store.deleteReading(id); break;
    case 'confusion': store.deleteConfusion(id); break;
    case 'progress': store.deleteProgress(id); break;
  }
  showToast('记录已删除', 'success');
  render();
}

export default { initRecords };
