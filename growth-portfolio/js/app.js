// ============================================
// 成长档案 - 主入口
// ============================================

import router from './router.js';
import { store } from './store.js';
import { initDashboard } from './modules/dashboard.js';
import { initRecords } from './modules/records.js';
import { initAssessment } from './modules/assessment.js';
import { initTimeline } from './modules/timeline.js';
import { initReflection } from './modules/reflection.js';
import { initAchievements } from './modules/achievements.js';
import { initStatistics } from './modules/statistics.js';

// 初始化应用
function init() {
  // 渲染侧边栏
  renderSidebar();

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
  bindMobileMenu();
}

// 渲染侧边栏
function renderSidebar() {
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
    showExportMenu();
  });
}

// 显示导出菜单
function showExportMenu() {
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

  // 关闭弹窗
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // 导出 JSON
  modal.querySelector('#export-json').addEventListener('click', async () => {
    const { exportAsJSON } = await import('./utils/export.js');
    exportAsJSON();
    modal.remove();
  });

  // 导出 CSV
  modal.querySelector('#export-csv').addEventListener('click', async () => {
    const { exportAsCSV } = await import('./utils/export.js');
    exportAsCSV();
    modal.remove();
  });
}

// 移动端菜单
function bindMobileMenu() {
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
