// ============================================
// 成长档案 - 评估模块（雷达图）
// ============================================

import { store } from '../store.js';
import { formatDate, escapeHtml, showToast } from '../utils/helpers.js';
import { getToday } from '../utils/date.js';
import { ASSESSMENT_DIMENSIONS } from '../data/config.js';

let currentChild = 'child_1';
let editingId = null;

export function initAssessment(params = {}) {
  if (params.id) editingId = params.id;
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const assessments = store.getAssessments(currentChild);
  const latest = assessments[0];

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${currentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 雷达图 -->
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

    <!-- 评估历史 -->
    ${assessments.length > 0 ? `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📋 评估历史</h3>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${assessments.map(a => renderAssessmentItem(a)).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    <!-- 评估表单弹窗 -->
    <div class="modal-overlay" id="assessment-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">新建成长评估</h3>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <form id="assessment-form">
            <input type="hidden" name="childId" value="${currentChild}">
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

  bindEvents();

  // 绘制雷达图
  if (latest) {
    setTimeout(() => drawRadarChart(latest.scores), 100);
  }
}

function renderAssessmentItem(assessment) {
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

function drawRadarChart(scores) {
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

  // 清空画布
  ctx.clearRect(0, 0, size, size);

  // 绘制背景网格
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

  // 绘制轴线
  dimensions.forEach((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.strokeStyle = '#e8e6e1';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // 绘制数据区域
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

  // 绘制数据点
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

  // 绘制标签
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

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child;
      render();
    });
  });

  // 打开弹窗
  document.getElementById('add-assessment-btn')?.addEventListener('click', () => {
    document.getElementById('assessment-modal').classList.add('active');
  });

  // 关闭弹窗
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal);

  // 保存
  document.getElementById('save-btn')?.addEventListener('click', saveAssessment);

  // 滑块实时显示
  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      e.target.nextElementSibling.textContent = e.target.value;
    });
  });

  // 删除评估
  document.querySelectorAll('.delete-assessment').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('确定要删除这条评估吗？')) {
        store.deleteAssessment(btn.dataset.id);
        showToast('评估已删除', 'success');
        render();
      }
    });
  });
}

function closeModal() {
  document.getElementById('assessment-modal').classList.remove('active');
}

function saveAssessment() {
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
    childId: currentChild,
    date: formData.get('date') || getToday(),
    period: formData.get('period'),
    scores,
    strengths,
    areasToImprove,
    notes: formData.get('notes')
  });

  showToast('评估保存成功', 'success');
  closeModal();
  render();
}

export default { initAssessment };
