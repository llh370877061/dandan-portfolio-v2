// ========== UI 管理 ==========
class GameUI {
  constructor() {
    this.currentScreen = 'main-menu';
    this.selectedMap = 'city';
    this.selectedGun = null;
    this.selectedKnife = null;
    this.gameState = 'menu'; // menu, playing, paused, result

    this.init();
  }

  init() {
    // 主菜单
    document.getElementById('btn-start').addEventListener('click', () => this.showScreen('map-select'));
    document.getElementById('btn-how').addEventListener('click', () => this.showScreen('how-to-play'));
    document.getElementById('btn-back-menu').addEventListener('click', () => this.showScreen('main-menu'));

    // 地图选择
    document.querySelectorAll('.map-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.map-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedMap = card.dataset.map;
      });
    });
    document.getElementById('btn-back-map').addEventListener('click', () => this.showScreen('main-menu'));
    document.getElementById('btn-to-equip').addEventListener('click', () => {
      this.populateWeapons();
      this.showScreen('equip');
    });

    // 武器选择
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.populateGunList(tab.dataset.category);
      });
    });
    document.getElementById('btn-back-equip').addEventListener('click', () => this.showScreen('map-select'));
    document.getElementById('btn-go').addEventListener('click', () => this.startGame());

    // 暂停
    document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-quit').addEventListener('click', () => this.quitToMenu());

    // 结算
    document.getElementById('btn-result-menu').addEventListener('click', () => this.quitToMenu());

    // 初始填充
    this.populateGunList('sniper');
    this.populateKnifeList();
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    this.currentScreen = screenId;
  }

  populateWeapons() {
    this.populateGunList('sniper');
    this.populateKnifeList();
    this.updatePreview();
  }

  populateGunList(category) {
    const list = document.getElementById('gun-list');
    list.innerHTML = '';
    const weapons = WEAPONS[category];

    weapons.forEach(w => {
      const card = document.createElement('div');
      card.className = 'weapon-card' + (this.selectedGun && this.selectedGun.id === w.id ? ' selected' : '');
      card.dataset.id = w.id;

      const maxDmg = 200, maxRate = 1200, maxRecoil = 100, maxRange = 100;
      card.innerHTML = `
        <div class="weapon-name">${w.name}</div>
        <div class="weapon-type">${w.special}</div>
        <div class="weapon-stats">
          <div class="stat-bar">
            <div class="stat-label">伤害</div>
            <div class="stat-track"><div class="stat-fill damage" style="width:${(w.damage/maxDmg)*100}%"></div></div>
          </div>
          <div class="stat-bar">
            <div class="stat-label">射速</div>
            <div class="stat-track"><div class="stat-fill speed" style="width:${(w.fireRate/maxRate)*100}%"></div></div>
          </div>
          <div class="stat-bar">
            <div class="stat-label">精准</div>
            <div class="stat-track"><div class="stat-fill accuracy" style="width:${100 - (w.recoil/maxRecoil)*100}%"></div></div>
          </div>
          <div class="stat-bar">
            <div class="stat-label">射程</div>
            <div class="stat-track"><div class="stat-fill portability" style="width:${w.range}%"></div></div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:#666;">弹容 ${w.magSize}</div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.weapon-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedGun = w;
        this.updatePreview();
      });

      list.appendChild(card);
    });
  }

  populateKnifeList() {
    const list = document.getElementById('knife-list');
    list.innerHTML = '';

    KNIVES.forEach(k => {
      const card = document.createElement('div');
      card.className = 'knife-card' + (this.selectedKnife && this.selectedKnife.id === k.id ? ' selected' : '');
      card.innerHTML = `
        <div class="knife-icon">${k.icon}</div>
        <div class="knife-info">
          <div class="knife-name">${k.name}</div>
          <div class="knife-desc">${k.desc}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.knife-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedKnife = k;
        this.updatePreview();
      });

      list.appendChild(card);
    });
  }

  updatePreview() {
    const gunSlot = document.querySelector('#preview-gun .slot-content');
    const knifeSlot = document.querySelector('#preview-knife .slot-content');
    const goBtn = document.getElementById('btn-go');

    gunSlot.textContent = this.selectedGun ? this.selectedGun.name : '未选择';
    knifeSlot.textContent = this.selectedKnife ? this.selectedKnife.name : '未选择';

    goBtn.disabled = !(this.selectedGun && this.selectedKnife);
  }

  startGame() {
    if (!this.selectedGun || !this.selectedKnife) return;
    this.gameState = 'playing';
    this.showScreen('game');
    if (typeof game !== 'undefined' && game.start) {
      game.start(this.selectedMap, this.selectedGun, this.selectedKnife);
    }
  }

  resumeGame() {
    this.gameState = 'playing';
    document.getElementById('pause-menu').style.display = 'none';
    if (typeof game !== 'undefined' && game.resume) game.resume();
  }

  quitToMenu() {
    this.gameState = 'menu';
    document.getElementById('pause-menu').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    this.showScreen('main-menu');
    if (typeof game !== 'undefined' && game.stop) game.stop();
  }

  updateHUD(player, enemyCount, wave, totalWaves, teammates) {
    // HP
    const hpPct = (player.hp / player.maxHp) * 100;
    document.getElementById('hp-bar').style.width = hpPct + '%';
    document.getElementById('hp-text').textContent = Math.ceil(player.hp);

    // 护甲
    const armorPct = (player.armor / player.maxArmor) * 100;
    document.getElementById('armor-bar').style.width = armorPct + '%';
    document.getElementById('armor-text').textContent = Math.ceil(player.armor);

    // 弹药
    if (player.currentWeapon) {
      document.getElementById('ammo-current').textContent = player.ammo;
      document.getElementById('ammo-reserve').textContent = player.reserveAmmo;
      document.getElementById('weapon-name').textContent = player.currentWeapon.name;
    } else {
      document.getElementById('ammo-current').textContent = '--';
      document.getElementById('ammo-reserve').textContent = '--';
      document.getElementById('weapon-name').textContent = player.currentKnife ? player.currentKnife.name + ' (刀)' : '';
    }

    // 波次
    document.getElementById('wave-text').textContent = `波次 ${wave}/${totalWaves} | 敌人: ${enemyCount}`;

    // 队友状态
    if (teammates) {
      teammates.forEach(tm => {
        if (tm.type === 'shield') {
          const pct = (tm.hp / tm.maxHp) * 100;
          document.getElementById('tm-shield-bar').style.width = pct + '%';
        } else if (tm.type === 'rocket') {
          document.getElementById('tm-rocket-ammo').textContent = tm.ammo;
        } else if (tm.type === 'c4') {
          document.getElementById('tm-c4-ammo').textContent = tm.ammo;
        }
      });
    }
  }

  showWaveAnnounce(waveNum) {
    const el = document.getElementById('wave-announce');
    const numEl = document.getElementById('announce-wave-num');
    numEl.textContent = `第 ${waveNum} 波`;
    el.style.display = 'flex';
    el.style.animation = 'none';
    el.offsetHeight; // 触发重绘
    el.style.animation = '';
    setTimeout(() => { el.style.display = 'none'; }, 2500);
  }

  showResult(victory, stats) {
    this.gameState = 'result';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-title').textContent = victory ? '胜利' : '失败';
    document.getElementById('result-title').style.color = victory ? '#4ecdc4' : '#e94560';
    document.getElementById('result-stats').innerHTML = `
      <div>击杀数: ${stats.kills}</div>
      <div>爆头数: ${stats.headshots}</div>
      <div>波次: ${stats.wave}/${stats.totalWaves}</div>
      <div>总伤害: ${stats.totalDamage}</div>
    `;
  }

  showHitMarker() {
    const marker = document.createElement('div');
    marker.className = 'hit-marker';
    marker.textContent = '✕';
    document.getElementById('game').appendChild(marker);
    setTimeout(() => marker.remove(), 300);
  }

  showDamageNumber(x, y, damage, isHeadshot) {
    const el = document.createElement('div');
    el.className = 'damage-number';
    el.textContent = Math.round(damage);
    el.style.left = (window.innerWidth / 2 + x) + 'px';
    el.style.top = (window.innerHeight / 2 + y) + 'px';
    if (isHeadshot) {
      el.style.color = '#ff0';
      el.style.fontSize = '24px';
      el.textContent = '爆头! ' + Math.round(damage);
    }
    document.getElementById('game').appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}
