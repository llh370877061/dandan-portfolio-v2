// ============================================
// 成长档案 - 数据统计模块
// ============================================

import { store } from '../store.js';
import { formatDate, escapeHtml } from '../utils/helpers.js';
import { getMonthName } from '../utils/date.js';

let currentChild = null;

export function initStatistics() {
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const stats = store.getStats(currentChild);

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

    <!-- 总览统计 -->
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

    <!-- 图表 -->
    <div class="grid grid-2">
      <!-- 月度趋势 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">📈 月度趋势</h3>
        </div>
        <canvas id="trend-chart" class="chart-canvas"></canvas>
      </div>

      <!-- 活动类型分布 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">🎯 活动类型分布</h3>
        </div>
        <canvas id="category-chart" class="chart-canvas"></canvas>
      </div>
    </div>

    <!-- 最近活动 -->
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

    <!-- 最近阅读 -->
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

  bindEvents();

  // 绘制图表
  setTimeout(() => {
    drawTrendChart(stats.monthlyStats);
    drawCategoryChart(stats);
  }, 100);
}

function drawTrendChart(monthlyStats) {
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

  // 获取最近6个月
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: getMonthName(date.getMonth())
    });
  }

  // 收集数据
  const data = months.map(m => ({
    label: m.label,
    activities: monthlyStats[m.key]?.activities || 0,
    readings: monthlyStats[m.key]?.readings || 0
  }));

  const maxValue = Math.max(...data.map(d => Math.max(d.activities, d.readings)), 1);

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制网格线
  ctx.strokeStyle = '#e8e6e1';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Y轴标签
    ctx.fillStyle = '#9ca89e';
    ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxValue - (maxValue / 4) * i), padding.left - 8, y + 4);
  }

  // 绘制折线
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

    // 绘制数据点
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

  // 绘制X轴标签
  ctx.fillStyle = '#9ca89e';
  ctx.font = '12px -apple-system, "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  data.forEach((d, i) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * i;
    ctx.fillText(d.label, x, height - 10);
  });

  // 绘制图例
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

function drawCategoryChart(stats) {
  const canvas = document.getElementById('category-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.clientWidth - 48;
  const height = 300;
  canvas.width = width;
  canvas.height = height;

  // 统计活动类型
  const activities = store.getActivities(currentChild);
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

    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    startAngle += sliceAngle;
  });

  // 绘制图例
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

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child || null;
      render();
    });
  });
}

export default { initStatistics };
