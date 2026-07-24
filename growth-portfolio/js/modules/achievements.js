// ============================================
// 成长档案 - 成就徽章系统
// ============================================

import { store } from '../store.js';
import { escapeHtml, showToast } from '../utils/helpers.js';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '../data/achievements.js';

let currentChild = 'child_1';

export function initAchievements() {
  render();
}

function render() {
  const container = document.getElementById('page-content');
  if (!container) return;

  const children = store.getChildren();
  const unlocked = store.getAchievements(currentChild);
  const unlockedIds = new Set(unlocked.map(a => a.badgeId));

  container.innerHTML = `
    <!-- 孩子切换 -->
    <div class="child-tabs">
      ${children.map(child => `
        <div class="child-tab child-${child.id === 'child_1' ? '1' : '2'} ${currentChild === child.id ? 'active' : ''}" data-child="${child.id}">
          <span>${child.avatar} ${child.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- 成就统计 -->
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

    <!-- 按分类展示 -->
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

  bindEvents();
}

function bindEvents() {
  // 孩子切换
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentChild = tab.dataset.child;
      render();
    });
  });

  // 成就点击动画
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
export function checkAchievements(childId) {
  const activities = store.getActivities(childId);
  const readings = store.getReadings(childId);
  const confusions = store.getConfusions(childId);
  const progresses = store.getProgresses(childId);
  const reflections = store.getReflections(childId);

  const newAchievements = [];

  // 阅读类成就
  const completedReadings = readings.filter(r => r.status === '已完成');
  const readingsWithThoughts = readings.filter(r => r.thoughts?.trim());

  checkAndUnlock(childId, 'bookworm_1', completedReadings.length >= 1, newAchievements);
  checkAndUnlock(childId, 'bookworm_5', completedReadings.length >= 5, newAchievements);
  checkAndUnlock(childId, 'bookworm_10', completedReadings.length >= 10, newAchievements);
  checkAndUnlock(childId, 'bookworm_20', completedReadings.length >= 20, newAchievements);
  checkAndUnlock(childId, 'reviewer_3', readingsWithThoughts.length >= 3, newAchievements);

  // 探索类成就
  const explorationActivities = activities.filter(a => a.category === '社区探索');
  const scienceActivities = activities.filter(a => a.category === '科学实验');

  checkAndUnlock(childId, 'explorer_1', explorationActivities.length >= 1, newAchievements);
  checkAndUnlock(childId, 'explorer_5', explorationActivities.length >= 5, newAchievements);
  checkAndUnlock(childId, 'explorer_10', explorationActivities.length >= 10, newAchievements);
  checkAndUnlock(childId, 'scientist_1', scienceActivities.length >= 1, newAchievements);
  checkAndUnlock(childId, 'scientist_5', scienceActivities.length >= 5, newAchievements);

  // 成长类成就
  checkAndUnlock(childId, 'progress_1', progresses.length >= 1, newAchievements);
  checkAndUnlock(childId, 'progress_5', progresses.length >= 5, newAchievements);
  checkAndUnlock(childId, 'progress_10', progresses.length >= 10, newAchievements);

  const independentProgress = progresses.filter(p => p.category === '独立性');
  checkAndUnlock(childId, 'independent_3', independentProgress.length >= 3, newAchievements);

  // 反思类成就
  checkAndUnlock(childId, 'thinker_1', reflections.length >= 1, newAchievements);
  checkAndUnlock(childId, 'thinker_5', reflections.length >= 5, newAchievements);
  checkAndUnlock(childId, 'thinker_10', reflections.length >= 10, newAchievements);

  // 困惑类成就
  checkAndUnlock(childId, 'questioner_1', confusions.length >= 1, newAchievements);
  checkAndUnlock(childId, 'questioner_5', confusions.length >= 5, newAchievements);

  const resolvedConfusions = confusions.filter(c => c.status === '已解决');
  checkAndUnlock(childId, 'resolver_3', resolvedConfusions.length >= 3, newAchievements);

  // 如果有新成就解锁，显示通知
  if (newAchievements.length > 0) {
    showAchievementNotification(newAchievements);
  }

  return newAchievements;
}

function checkAndUnlock(childId, badgeId, condition, newAchievements) {
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

function showAchievementNotification(achievements) {
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

export default { initAchievements, checkAchievements };
