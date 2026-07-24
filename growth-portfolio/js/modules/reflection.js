// ============================================
// 成长档案 - 反思模块
// ============================================

import { store } from '../store.js';
import { formatDate, escapeHtml, showToast } from '../utils/helpers.js';
import { getToday } from '../utils/date.js';
import { REFLECTION_QUESTIONS, getRandomQuestion, getCategories } from '../data/reflections.js';
import { MOOD_OPTIONS } from '../data/config.js';

let currentChild = 'child_1';
let currentQuestion = null;
let editingId = null;

export function initReflection() {
  currentQuestion = getRandomQuestion();
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const reflections = store.getReflections(currentChild);

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${currentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 今日反思 -->
    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <h3 class="card-title">💭 今日反思</h3>
        <button class="btn btn-ghost btn-sm" id="refresh-question">换个问题</button>
      </div>
      <div class="card-body">
        <div class="reflection-question">
          ${escapeHtml(currentQuestion)}
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

    <!-- 反思历史 -->
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
            ${reflections.map(r => renderReflectionItem(r)).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  bindEvents();
}

function renderReflectionItem(reflection) {
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

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child;
      render();
    });
  });

  // 换个问题
  document.getElementById('refresh-question')?.addEventListener('click', () => {
    currentQuestion = getRandomQuestion();
    document.querySelector('.reflection-question').textContent = currentQuestion;
  });

  // 心情选择
  document.querySelectorAll('[data-mood]').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('[data-mood]').forEach(l => {
        l.style.borderColor = 'transparent';
      });
      label.style.borderColor = 'var(--color-primary)';
      label.querySelector('input').checked = true;
    });
  });

  // 保存反思
  document.getElementById('save-reflection')?.addEventListener('click', saveReflection);

  // 删除反思
  document.querySelectorAll('.delete-reflection').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('确定要删除这条反思吗？')) {
        store.deleteReflection(btn.dataset.id);
        showToast('反思已删除', 'success');
        render();
      }
    });
  });

  // 添加妈妈点评
  document.querySelectorAll('.add-comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showCommentModal(btn.dataset.id);
    });
  });
}

function saveReflection() {
  const answer = document.getElementById('reflection-answer')?.value;
  const moodInput = document.querySelector('input[name="mood"]:checked');

  if (!answer?.trim()) {
    showToast('请写下你的想法', 'error');
    return;
  }

  store.addReflection({
    childId: currentChild,
    date: getToday(),
    question: currentQuestion,
    answer: answer.trim(),
    mood: moodInput?.value || ''
  });

  showToast('反思保存成功', 'success');
  currentQuestion = getRandomQuestion();
  render();
}

function showCommentModal(reflectionId) {
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

  // 关闭
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('#cancel-comment').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // 保存
  modal.querySelector('#save-comment').addEventListener('click', () => {
    const comment = modal.querySelector('#comment-text').value;
    if (!comment.trim()) {
      showToast('请写下点评内容', 'error');
      return;
    }

    store.updateReflection(reflectionId, { momComment: comment.trim() });
    showToast('点评保存成功', 'success');
    modal.remove();
    render();
  });
}

export default { initReflection };
