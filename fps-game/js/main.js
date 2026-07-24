// ========== 主游戏模块 ==========
let game;
let enemyManager;

class Game {
  constructor() {
    this.running = false;
    this.paused = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.enemyManager = null;
    this.teammateManager = null;
    this.ui = null;
    this.currentWave = 0;
    this.totalWaves = WAVES.length;
    this.stats = { kills: 0, headshots: 0, totalDamage: 0, wave: 0 };
    this.locked = false;
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.ui = new GameUI();

    // Three.js 基础
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 30, 80);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('game-canvas'),
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 光照
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    dirLight.position.set(20, 30, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);

    // 半球光
    const hemiLight = new THREE.HemisphereLight(0x8888aa, 0x444422, 0.4);
    this.scene.add(hemiLight);

    // 窗口大小
    window.addEventListener('resize', () => this.onResize());

    // 指针锁定
    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('click', () => {
      if (this.running && !this.paused) {
        canvas.requestPointerLock();
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (this.player) this.player.locked = this.locked;
    });

    // 开始渲染循环（菜单时也渲染，但画面静止）
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  start(mapId, gun, knife) {
    this.running = true;
    this.paused = false;
    this.currentWave = 0;
    this.stats = { kills: 0, headshots: 0, totalDamage: 0, wave: 0 };

    // 清理旧场景
    this.clearScene();

    // 创建地图
    this.currentMap = mapId;
    createMap(this.scene, mapId);

    // 创建玩家
    const spawn = getSpawnPoint(mapId);
    this.player = new Player(this.scene, this.camera);
    this.player.position.set(spawn.x, spawn.y, spawn.z);
    this.scene.add(this.camera);
    this.player.equipWeapon(gun);
    this.player.equipKnife(knife);

    // 创建敌人管理器
    this.enemyManager = new EnemyManager(this.scene);
    this.enemyManager.setMap(mapId);

    // 创建队友
    this.teammateManager = new TeammateManager(this.scene);
    this.teammateManager.spawnRandom(spawn);

    // 开始第一波
    this.startWave(0);

    // 请求指针锁定
    document.getElementById('game-canvas').requestPointerLock();
  }

  startWave(waveNum) {
    this.currentWave = waveNum;
    this.stats.wave = waveNum + 1;
    this.enemyManager.spawnWave(waveNum);
    this.ui.showWaveAnnounce(waveNum + 1);
  }

  clearScene() {
    // 移除地图、敌人、队友
    const toRemove = [];
    this.scene.traverse(child => {
      if (child.name === 'map') toRemove.push(child);
    });
    toRemove.forEach(c => this.scene.remove(c));

    if (this.enemyManager) this.enemyManager.clear();
    if (this.teammateManager) this.teammateManager.clear();
    if (this.player && this.camera) {
      this.scene.remove(this.camera);
    }
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const dt = Math.min((time - (this.lastTime || time)) / 1000, 0.05);
    this.lastTime = time;

    if (this.running && !this.paused) {
      this.update(dt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  update(dt) {
    if (!this.player || !this.player.alive) {
      if (this.player && !this.player.alive) {
        this.ui.showResult(false, this.stats);
        this.running = false;
        document.exitPointerLock();
      }
      return;
    }

    // 玩家更新
    this.player.update(dt);

    // 射击
    if (this.player.isShooting && this.locked) {
      const raycaster = this.player.shoot();
      if (raycaster) {
        const hits = this.enemyManager.checkPlayerShooting(raycaster, this.player.currentWeapon.damage);
        hits.forEach(hit => {
          this.stats.totalDamage += hit.damage;
          if (hit.bone === 'head') this.stats.headshots++;
          this.ui.showHitMarker();
          const offsetX = (Math.random() - 0.5) * 60;
          const offsetY = (Math.random() - 0.5) * 40;
          this.ui.showDamageNumber(offsetX, offsetY, hit.damage, hit.bone === 'head');
        });
      }
    }

    // 近战
    if (this.player.meleeReady && this.player.currentKnife) {
      this.player.meleeReady = false;
      const raycaster = this.player.meleeAttack();
      if (raycaster) {
        const hits = this.enemyManager.checkMelee(raycaster, this.player.currentKnife.damage);
        hits.forEach(hit => {
          this.stats.totalDamage += hit.damage;
          this.ui.showHitMarker();
        });
      }
    }

    // 右键瞄准已由 Player 类处理

    // 敌人更新
    const aliveEnemies = this.enemyManager.update(dt, this.player.position);

    // 敌人射击玩家
    this.enemyManager.enemies.forEach(enemy => {
      if (enemy.alive && enemy.shooting) {
        enemy.shooting = false;
        // 简化命中判定
        const dist = enemy.distanceTo(this.player.position);
        if (dist < enemy.attackRange) {
          const hitChance = Math.max(0.1, 1 - dist / enemy.attackRange);
          if (Math.random() < hitChance * 0.3) {
            this.player.takeDamage(enemy.damage);
          }
        }
      }
    });

    // 队友更新
    this.teammateManager.update(dt, this.player.position, this.enemyManager.enemies);

    // 检查队友击杀
    this.enemyManager.enemies.forEach(e => {
      if (!e.alive && !e.counted) {
        e.counted = true;
        this.stats.kills++;
      }
    });

    // 检查波次完成
    if (aliveEnemies === 0) {
      if (this.currentWave < this.totalWaves - 1) {
        // 下一波
        setTimeout(() => {
          this.startWave(this.currentWave + 1);
        }, 3000);
      } else {
        // 胜利
        this.ui.showResult(true, this.stats);
        this.running = false;
        document.exitPointerLock();
      }
    }

    // 更新 HUD
    this.ui.updateHUD(
      this.player,
      aliveEnemies,
      this.currentWave + 1,
      this.totalWaves,
      this.teammateManager.getStatus()
    );
  }

  pause() {
    this.paused = true;
    document.getElementById('pause-menu').style.display = 'block';
    document.exitPointerLock();
  }

  resume() {
    this.paused = false;
    document.getElementById('pause-menu').style.display = 'none';
    document.getElementById('game-canvas').requestPointerLock();
  }

  stop() {
    this.running = false;
    this.paused = false;
    this.clearScene();
    document.exitPointerLock();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// 暂停功能
function togglePause() {
  if (game) {
    if (game.paused) game.resume();
    else game.pause();
  }
}

// 启动
window.addEventListener('DOMContentLoaded', () => {
  game = new Game();
});
