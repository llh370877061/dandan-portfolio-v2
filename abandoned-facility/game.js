// ===== 公寓 - 游戏核心逻辑 =====

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');

// ===== 常量 =====
const TILE = 40;
const PLAYER_SIZE = 16;
const PLAYER_SPEED = 3;
const DODGE_SPEED = 8;
const DODGE_DURATION = 8;
const DODGE_COOLDOWN = 30;
const INTERACT_RANGE = 40;

// ===== 武器定义 =====
const WEAPONS = {
  fist:     { name: '拳头',   damage: 8,  cooldown: 12, range: 22, spread: 0 },
  knife:    { name: '匕首',   damage: 15, cooldown: 12, range: 22, spread: 0 },
  pistol:   { name: '手枪',   damage: 25, cooldown: 20, range: 60, spread: 0 },
  shotgun:  { name: '霰弹枪', damage: 40, cooldown: 35, range: 45, spread: 0.5 },
};

// ===== 地图数据 =====
// 0=地板, 1=墙, 5=互动点, 6=地面武器
let MAP = [];

// ===== 叙事内容 =====
const NARRATIVES = {
  '醒来': {
    title: '你的房间',
    content: '你在一间狭小的房间里醒来。头痛欲裂。\n\n窗外是黑夜。你不记得自己是谁，也不知道这里是哪。\n\n你低头看了看手腕——上面有一个模糊的编号纹身。'
  },
  '墙上的字': {
    title: '墙上的涂鸦',
    content: '红色记号笔写的字，笔迹很急：\n\n"Don\'t trust IT"\n\n"IT"被画了个圈，旁边还有一个箭头，指向楼下。'
  },
  '神秘信件': {
    title: '信件',
    content: '沙发缝里塞着一封皱巴巴的信：\n\n"如果你读到这封信，说明你已经开始了。别相信你看到的记忆。往下走，答案在最底下。"\n\n没有署名。'
  },
  '设施平面图': {
    title: '平面图',
    content: '地下室入口的墙上贴着一张公寓平面图。\n\n大部分楼层被涂黑了，只有你当前所在的位置是清晰的。\n\n最底层标注着：\"地下车库 - 禁止进入\"。'
  },
  '匕首': {
    title: '发现武器',
    content: '桌上有一把匕首。刀刃还算锋利。\n\n你拿起了它。'
  },
  '手枪': {
    title: '发现武器',
    content: '走廊尽头的柜子里，有一把手枪。\n\n弹匣里还有子弹。'
  },
  '霰弹枪': {
    title: '发现武器',
    content: '客厅的壁柜后面，藏着一把霰弹枪。\n\n枪管还是热的。'
  },
  '离开': {
    title: '下楼',
    content: '你走出了房间，踏入黑暗的走廊。'
  },
  '结局': {
    title: '你回到了现实',
    content: '公寓守卫倒下了。\n\n周围的一切开始崩塌——墙壁碎裂，天花板坠落，黑暗退去。\n\n当你再次睁开眼睛，你站在一片草地上。阳光温暖，鸟鸣清脆。\n\n你深吸一口气。空气里有花的味道。\n\n你回来了。'
  },
};

// ===== 游戏状态 =====
let gameStarted = false;
let showingNarrative = false;
let showingTransition = false;
let showingIntro = false;
let pendingLevelComplete = false;
let gameWon = false;  // 胜利状态
let cameraX = 0, cameraY = 0;
let screenShake = 0;
let frameCount = 0;
let currentLevel = 0;

// ===== 关卡定义 =====
const LEVELS = [
  // ---- 0: 5楼·你的房间 ----
  {
    name: '5楼 · 你的房间',
    intro: '你在一间狭小的房间里醒来。头痛欲裂。窗外是黑夜。',
    spawnX: 6, spawnY: 5,
    items: [
      { x: 3, y: 3, type: 'narrative', key: '醒来', id: 'wake' },
      { x: 8, y: 7, type: 'weapon', weapon: 'knife', id: 'w_knife' },
    ],
    enemies: [],
    requiredPickups: ['wake'],
    nextNarrative: '你走出了房间。',
    nextLevel: 1,
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,5,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,6,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ],
  },
  // ---- 1: 4楼·走廊 ----
  {
    name: '4楼 · 走廊',
    intro: '昏暗的走廊。墙上有奇怪的涂鸦。远处有什么在动。',
    spawnX: 2, spawnY: 4,
    items: [
      { x: 22, y: 4, type: 'narrative', key: '墙上的字', id: 'graffiti' },
      { x: 26, y: 4, type: 'weapon', weapon: 'pistol', id: 'w_pistol' },
    ],
    enemies: [
      {
        type: 'patrol',
        x: 14, y: 4,
        hp: 60, maxHp: 60, speed: 1, damage: 12,
        patrolPoints: [{x: 8, y: 4}, {x: 24, y: 4}],
        currentTarget: 0, alertLevel: 0, dir: 0, attackCooldown: 0,
        size: 14, color: '#a44',
      },
    ],
    requiredPickups: ['graffiti'],
    nextNarrative: '走廊尽头有一扇门，通向下一层。',
    nextLevel: 2,
    map: (() => {
      const m = [];
      for (let y = 0; y < 9; y++) {
        const row = [];
        for (let x = 0; x < 30; x++) {
          if (y === 0 || y === 8 || x === 0 || x === 29) row.push(1);
          else row.push(0);
        }
        m.push(row);
      }
      return m;
    })(),
  },
  // ---- 2: 3楼·客厅 ----
  {
    name: '3楼 · 客厅',
    intro: '一间宽敞的客厅。家具东倒西歪，地上散落着碎玻璃。',
    spawnX: 2, spawnY: 6,
    items: [
      { x: 18, y: 3, type: 'narrative', key: '神秘信件', id: 'letter' },
      { x: 20, y: 8, type: 'weapon', weapon: 'shotgun', id: 'w_shotgun' },
    ],
    enemies: [
      {
        type: 'patrol',
        x: 12, y: 5,
        hp: 70, maxHp: 70, speed: 1.2, damage: 14,
        patrolPoints: [{x: 5, y: 5}, {x: 20, y: 5}],
        currentTarget: 0, alertLevel: 0, dir: 0, attackCooldown: 0,
        size: 14, color: '#a44',
      },
      {
        type: 'lurker',
        x: 15, y: 9,
        hp: 45, maxHp: 45, speed: 2, damage: 18,
        homeX: 15, homeY: 9,
        ambushRange: 80, isHidden: true, alertLevel: 0, dir: 0, attackCooldown: 0,
        size: 12, color: '#662',
      },
    ],
    requiredPickups: ['letter'],
    nextNarrative: '信上的字在你脑海里回响。继续往下走。',
    nextLevel: 3,
    map: (() => {
      const m = [];
      for (let y = 0; y < 12; y++) {
        const row = [];
        for (let x = 0; x < 25; x++) {
          if (y === 0 || y === 11 || x === 0 || x === 24) row.push(1);
          else row.push(0);
        }
        m.push(row);
      }
      return m;
    })(),
  },
  // ---- 3: 2楼·地下室入口 ----
  {
    name: '2楼 · 地下室入口',
    intro: '楼梯间通向地下室。墙上贴着一张发黄的平面图。',
    spawnX: 2, spawnY: 5,
    items: [
      { x: 18, y: 3, type: 'narrative', key: '设施平面图', id: 'blueprint' },
    ],
    enemies: [
      {
        type: 'guard',
        x: 18, y: 5,
        hp: 120, maxHp: 120, speed: 1.3, damage: 20,
        homeX: 18, homeY: 5,
        guardRange: 100, alertLevel: 0, dir: 0, attackCooldown: 0,
        size: 18, color: '#a22',
      },
    ],
    requiredPickups: ['blueprint'],
    nextNarrative: '你打开地下室的门，一股冷气扑面而来。',
    nextLevel: 4,
    map: (() => {
      const m = [];
      for (let y = 0; y < 10; y++) {
        const row = [];
        for (let x = 0; x < 25; x++) {
          if (y === 0 || y === 9 || x === 0 || x === 24) row.push(1);
          else row.push(0);
        }
        m.push(row);
      }
      return m;
    })(),
  },
  // ---- 4: 1楼·地下车库 Boss ----
  {
    name: '地下车库',
    intro: '巨大的地下车库。灯光闪烁，影子在墙上晃动。\n\n有什么东西在黑暗深处等着你。',
    spawnX: 2, spawnY: 7,
    items: [],
    enemies: [
      {
        type: 'boss',
        x: 28, y: 7,
        hp: 400, maxHp: 400, speed: 1.5, damage: 30,
        homeX: 28, homeY: 7,
        guardRange: 180, alertLevel: 0, dir: 0, attackCooldown: 0,
        chargeTimer: 0, chargeDir: {x:0, y:0},
        size: 30, color: '#a22',
      },
    ],
    requiredPickups: [],  // 击败Boss即可
    nextNarrative: null,
    nextLevel: 5,  // Boss击败后进入胜利场景
    bossLevel: true,  // 特殊标记：打完Boss触发结局
    map: (() => {
      const m = [];
      for (let y = 0; y < 14; y++) {
        const row = [];
        for (let x = 0; x < 35; x++) {
          if (y === 0 || y === 13 || x === 0 || x === 34) {
            row.push(1);
          } else if (y === 3 && x >= 8 && x <= 12) {
            row.push(1); // 车柱
          } else if (y === 3 && x >= 22 && x <= 26) {
            row.push(1); // 车柱
          } else if (y === 10 && x >= 8 && x <= 12) {
            row.push(1); // 车柱
          } else if (y === 10 && x >= 22 && x <= 26) {
            row.push(1); // 车柱
          } else {
            row.push(0);
          }
        }
        m.push(row);
      }
      return m;
    })(),
  },
  // ---- 5: 胜利场景 ----
  {
    name: '阳光草地',
    intro: '',
    spawnX: 20, spawnY: 10,
    items: [],
    enemies: [],
    requiredPickups: [],
    nextNarrative: null,
    nextLevel: -1,
    victoryLevel: true,
    map: (() => {
      // 40x20 草地，全开放
      const m = [];
      for (let y = 0; y < 20; y++) {
        const row = [];
        for (let x = 0; x < 40; x++) {
          if (y === 0 || y === 19 || x === 0 || x === 39) row.push(1);
          else row.push(0);
        }
        m.push(row);
      }
      return m;
    })(),
  },
];

// ===== 玩家 =====
let player = {
  x: 6 * TILE + TILE/2,
  y: 5 * TILE + TILE/2,
  hp: 100,
  maxHp: 100,
  vx: 0, vy: 0,
  dir: 0,
  isDodging: false,
  dodgeTimer: 0,
  dodgeCooldown: 0,
  dodgeDir: {x:0, y:0},
  attackCooldown: 0,
  isAttacking: false,
  attackTimer: 0,
  weapon: 'fist',
  invincible: 0,
};

// ===== 输入 =====
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (showingNarrative) {
    hideNarrative();
    e.preventDefault();
  }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

// 手机触摸控制
let touchStart = null;
let touchMove = null;
let joystickActive = false;

const joystick = document.getElementById('joystick');
const joystickKnob = document.getElementById('joystick-knob');
const btnAttack = document.getElementById('btn-attack');
const btnDodge = document.getElementById('btn-dodge');
const btnInteract = document.getElementById('btn-interact');

if (joystick) {
  joystick.addEventListener('touchstart', e => {
    joystickActive = true;
    const rect = joystick.getBoundingClientRect();
    touchStart = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    };
    e.preventDefault();
  });
  document.addEventListener('touchmove', e => {
    if (!joystickActive || !touchStart) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 40;
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;
    joystickKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
    touchMove = { x: dx/maxDist, y: dy/maxDist };
    e.preventDefault();
  });
  document.addEventListener('touchend', () => {
    joystickActive = false;
    touchStart = null;
    touchMove = null;
    joystickKnob.style.transform = 'translate(-50%, -50%)';
  });
}

if (btnAttack) btnAttack.addEventListener('touchstart', e => { keys['Space'] = true; e.preventDefault(); });
if (btnAttack) btnAttack.addEventListener('touchend', e => { keys['Space'] = false; e.preventDefault(); });
if (btnDodge) btnDodge.addEventListener('touchstart', e => { keys['ShiftLeft'] = true; e.preventDefault(); });
if (btnDodge) btnDodge.addEventListener('touchend', e => { keys['ShiftLeft'] = false; e.preventDefault(); });
if (btnInteract) btnInteract.addEventListener('touchstart', e => { keys['KeyE'] = true; e.preventDefault(); });
if (btnInteract) btnInteract.addEventListener('touchend', e => { keys['KeyE'] = false; e.preventDefault(); });

// ===== 地图工具函数 =====
function getTile(tx, ty) {
  if (ty < 0 || ty >= MAP.length || tx < 0 || tx >= MAP[0].length) return 1;
  return MAP[ty][tx];
}

function isWalkable(px, py) {
  const margin = PLAYER_SIZE * 0.4;
  const corners = [
    {x: px - margin, y: py - margin},
    {x: px + margin, y: py - margin},
    {x: px - margin, y: py + margin},
    {x: px + margin, y: py + margin},
  ];
  for (const c of corners) {
    const tx = Math.floor(c.x / TILE);
    const ty = Math.floor(c.y / TILE);
    const tile = getTile(tx, ty);
    if (tile === 1 || tile === 2) return false;
  }
  return true;
}

// ===== 碰撞检测 =====
function circlesCollide(a, b, r1, r2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy) < r1 + r2;
}

// ===== 叙事系统 =====
function showNarrative(key) {
  const n = NARRATIVES[key];
  if (!n) return;
  document.querySelector('#narrative-popup .title').textContent = n.title;
  document.querySelector('#narrative-popup .content').textContent = n.content;
  document.getElementById('narrative-popup').style.display = 'block';
  showingNarrative = true;
}

function showCustomNarrative(title, content) {
  document.querySelector('#narrative-popup .title').textContent = title;
  document.querySelector('#narrative-popup .content').textContent = content;
  document.getElementById('narrative-popup').style.display = 'block';
  showingNarrative = true;
}

function hideNarrative() {
  document.getElementById('narrative-popup').style.display = 'none';
  showingNarrative = false;

  if (showingIntro) {
    showingIntro = false;
    return;
  }

  if (showingTransition) {
    showingTransition = false;
    const level = LEVELS[currentLevel];
    if (level.nextLevel >= 0) {
      loadLevel(level.nextLevel);
    }
    return;
  }

  // 普通关收集完必需品后，等当前弹窗关闭再触发传送
  if (pendingLevelComplete) {
    pendingLevelComplete = false;
    const level = LEVELS[currentLevel];
    if (level.nextLevel >= 0 && level.nextNarrative) {
      showingTransition = true;
      showingNarrative = true;
      document.querySelector('#narrative-popup .title').textContent = '...';
      document.querySelector('#narrative-popup .content').textContent = level.nextNarrative;
      document.getElementById('narrative-popup').style.display = 'block';
    }
  }
}

// ===== 敌人系统 =====
let enemies = [];

function updateEnemies() {
  for (const e of enemies) {
    if (e.hp <= 0) continue;

    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (e.type === 'patrol') {
      if (e.alertLevel === 0) {
        const target = e.patrolPoints[e.currentTarget];
        const tdx = target.x - e.x;
        const tdy = target.y - e.y;
        const tdist = Math.sqrt(tdx*tdx + tdy*tdy);
        if (tdist < 5) {
          e.currentTarget = (e.currentTarget + 1) % e.patrolPoints.length;
        } else {
          e.x += (tdx/tdist) * e.speed;
          e.y += (tdy/tdist) * e.speed;
          e.dir = Math.atan2(tdy, tdx);
        }
        if (dist < 150) e.alertLevel = 1;
      } else if (e.alertLevel === 1) {
        if (dist > 200) e.alertLevel = 0;
        else if (dist < 100) e.alertLevel = 2;
      } else if (e.alertLevel === 2) {
        if (dist > 300) e.alertLevel = 0;
        else if (dist < WEAPONS[player.weapon].range) {
          if (e.attackCooldown <= 0) {
            attackPlayer(e.damage);
            e.attackCooldown = 40;
          }
        } else {
          e.x += (dx/dist) * e.speed * 1.5;
          e.y += (dy/dist) * e.speed * 1.5;
        }
      }
    }

    if (e.type === 'lurker') {
      if (e.isHidden) {
        if (dist < e.ambushRange) {
          e.isHidden = false;
          e.alertLevel = 2;
        }
      } else {
        if (e.alertLevel === 2) {
          if (dist < WEAPONS[player.weapon].range) {
            if (e.attackCooldown <= 0) {
              attackPlayer(e.damage);
              e.attackCooldown = 30;
            }
          } else {
            e.x += (dx/dist) * e.speed;
            e.y += (dy/dist) * e.speed;
          }
          if (dist > 200) e.alertLevel = 0;
        }
      }
    }

    if (e.type === 'guard') {
      if (e.alertLevel === 0) {
        if (dist < e.guardRange) e.alertLevel = 2;
      } else if (e.alertLevel === 2) {
        if (dist < WEAPONS[player.weapon].range) {
          if (e.attackCooldown <= 0) {
            attackPlayer(e.damage);
            e.attackCooldown = 50;
          }
        } else {
          e.x += (dx/dist) * e.speed;
          e.y += (dy/dist) * e.speed;
        }
      }
    }

    if (e.type === 'swarm') {
      if (e.alertLevel === 0) {
        const homeDx = e.homeX - e.x;
        const homeDy = e.homeY - e.y;
        const homeDist = Math.sqrt(homeDx*homeDx + homeDy*homeDy);
        if (homeDist > 5) {
          e.x += (homeDx/homeDist) * e.speed * 0.5;
          e.y += (homeDy/homeDist) * e.speed * 0.5;
        }
        e.angle = (e.angle || 0) + 0.05;
        e.x += Math.cos(e.angle) * 0.3;
        e.y += Math.sin(e.angle) * 0.3;
        if (dist < 120) e.alertLevel = 2;
      } else if (e.alertLevel === 2) {
        if (dist > 250) {
          e.alertLevel = 0;
        } else if (dist < WEAPONS[player.weapon].range + 5) {
          if (e.attackCooldown <= 0) {
            attackPlayer(e.damage);
            e.attackCooldown = 35;
          }
        } else {
          const perpX = -dy/dist;
          const perpY = dx/dist;
          const side = e.sideDir || 1;
          e.x += (dx/dist * 0.7 + perpX * 0.5 * side) * e.speed;
          e.y += (dy/dist * 0.7 + perpY * 0.5 * side) * e.speed;
          if (Math.random() < 0.02) e.sideDir = -side;
        }
      }
    }

    if (e.type === 'boss') {
      if (e.alertLevel === 0) {
        if (dist < 150) e.alertLevel = 1;
      } else if (e.alertLevel === 1) {
        if (dist < 100) e.alertLevel = 2;
        else {
          e.x += (dx/dist) * e.speed * 0.5;
          e.y += (dy/dist) * e.speed * 0.5;
        }
      } else if (e.alertLevel === 2) {
        const hpRatio = e.hp / e.maxHp;
        if (hpRatio > 0.5) {
          // 阶段1：追击+重击
          if (dist < WEAPONS[player.weapon].range) {
            if (e.attackCooldown <= 0) {
              attackPlayer(e.damage);
              e.attackCooldown = 60;
            }
          } else {
            e.x += (dx/dist) * e.speed;
            e.y += (dy/dist) * e.speed;
          }
        } else {
          // 阶段2：冲锋
          if (!e.chargeTimer || e.chargeTimer <= 0) {
            e.chargeTimer = 90;
            e.chargeDir = {x: dx/dist, y: dy/dist};
          } else if (e.chargeTimer > 30) {
            e.x += e.chargeDir.x * e.speed * 2.5;
            e.y += e.chargeDir.y * e.speed * 2.5;
          } else {
            if (dist < WEAPONS[player.weapon].range) {
              if (e.attackCooldown <= 0) {
                attackPlayer(e.damage * 1.5);
                e.attackCooldown = 30;
              }
            }
          }
          e.chargeTimer--;
        }
      }
    }

    if (e.attackCooldown > 0) e.attackCooldown--;
  }
}

function attackPlayer(damage) {
  if (player.invincible > 0) return;
  player.hp -= damage;
  player.invincible = 30;
  screenShake = 10;
  if (player.hp <= 0) {
    player.hp = player.maxHp;
    const level = LEVELS[currentLevel];
    player.x = level.spawnX * TILE + TILE/2;
    player.y = level.spawnY * TILE + TILE/2;
  }
}

// ===== 道具系统 =====
let items = [];
let pickups = [];

function initItems() {
  const level = LEVELS[currentLevel];
  items = level.items.map(it => ({
    x: it.x * TILE + TILE/2,
    y: it.y * TILE + TILE/2,
    type: it.type,
    key: it.key,
    weapon: it.weapon,
    id: it.id,
  }));
  pickups = [];
}

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  const level = LEVELS[currentLevel];

  player.x = level.spawnX * TILE + TILE/2;
  player.y = level.spawnY * TILE + TILE/2;

  MAP = level.map;
  initItems();

  enemies = level.enemies.map(e => ({
    ...e,
    x: e.x * TILE + TILE/2,
    y: e.y * TILE + TILE/2,
    patrolPoints: e.patrolPoints ? e.patrolPoints.map(p => ({x: p.x * TILE + TILE/2, y: p.y * TILE + TILE/2})) : undefined,
    homeX: e.homeX * TILE + TILE/2,
    homeY: e.homeY * TILE + TILE/2,
  }));

  // 胜利场景特殊处理
  if (level.victoryLevel) {
    gameWon = true;
    document.getElementById('victory-text').style.display = 'block';
    document.getElementById('hud').style.display = 'none';
    return;
  }

  gameWon = false;
  document.getElementById('victory-text').style.display = 'none';
  document.getElementById('hud').style.display = '';

  // 显示关卡介绍
  if (level.intro) {
    showingIntro = true;
    showingNarrative = true;
    showingTransition = false;
    document.querySelector('#narrative-popup .title').textContent = level.name;
    document.querySelector('#narrative-popup .content').textContent = level.intro;
    document.getElementById('narrative-popup').style.display = 'block';
  }
}

// ===== 互动系统 =====
let nearbyInteractable = null;

function checkInteractions() {
  nearbyInteractable = null;
  for (const item of items) {
    if (pickups.includes(item.id)) continue;
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    if (Math.sqrt(dx*dx + dy*dy) < INTERACT_RANGE) {
      nearbyInteractable = item;
      break;
    }
  }
}

function interact() {
  if (!nearbyInteractable) return;
  const item = nearbyInteractable;

  if (item.type === 'narrative') {
    showNarrative(item.key);
    pickups.push(item.id);
  }

  if (item.type === 'weapon') {
    player.weapon = item.weapon;
    pickups.push(item.id);
    showNarrative(item.weapon);
  }

  // 检查Boss击败
  checkLevelComplete();
}

function checkLevelComplete() {
  const level = LEVELS[currentLevel];

  // Boss关：Boss死亡即触发结局
  if (level.bossLevel) {
    if (pendingLevelComplete) return; // 已经触发过了
    const bossAlive = enemies.some(e => e.type === 'boss' && e.hp > 0);
    if (bossAlive) return;
    // Boss死了，直接弹出结局
    pendingLevelComplete = true;
    showingTransition = true;
    showingNarrative = true;
    document.querySelector('#narrative-popup .title').textContent = '结局';
    document.querySelector('#narrative-popup .content').textContent = NARRATIVES['结局'].content;
    document.getElementById('narrative-popup').style.display = 'block';
    return;
  }

  // 普通关：收集完必需品
  if (!level.requiredPickups || level.requiredPickups.length === 0) return;
  const allCollected = level.requiredPickups.every(id => pickups.includes(id));
  if (!allCollected) return;

  pendingLevelComplete = true;
}

// ===== 玩家更新 =====
function updatePlayer() {
  if (player.isDodging) {
    player.dodgeTimer--;
    player.x += player.dodgeDir.x * DODGE_SPEED;
    player.y += player.dodgeDir.y * DODGE_SPEED;
    if (player.dodgeTimer <= 0) {
      player.isDodging = false;
      player.dodgeCooldown = DODGE_COOLDOWN;
    }
  } else {
    let mx = 0, my = 0;

    if (keys['KeyW'] || keys['ArrowUp']) my = -1;
    if (keys['KeyS'] || keys['ArrowDown']) my = 1;
    if (keys['KeyA'] || keys['ArrowLeft']) mx = -1;
    if (keys['KeyD'] || keys['ArrowRight']) mx = 1;

    if (touchMove) {
      mx = touchMove.x;
      my = touchMove.y;
    }

    const len = Math.sqrt(mx*mx + my*my);
    if (len > 0.1) {
      mx /= len;
      my /= len;
      player.dir = Math.atan2(my, mx);
    }

    player.vx = mx * PLAYER_SPEED;
    player.vy = my * PLAYER_SPEED;

    const newX = player.x + player.vx;
    const newY = player.y + player.vy;

    if (isWalkable(newX, player.y)) player.x = newX;
    if (isWalkable(player.x, newY)) player.y = newY;

    if ((keys['ShiftLeft'] || keys['ShiftRight']) && player.dodgeCooldown <= 0 && len > 0.1) {
      player.isDodging = true;
      player.dodgeTimer = DODGE_DURATION;
      player.dodgeDir = {x: mx, y: my};
      player.invincible = DODGE_DURATION;
    }
  }

  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.dodgeCooldown > 0) player.dodgeCooldown--;
  if (player.invincible > 0) player.invincible--;

  if (keys['Space'] && player.attackCooldown <= 0 && !player.isDodging) {
    performAttack();
  }

  if (keys['KeyE']) {
    interact();
    keys['KeyE'] = false;
  }

  checkInteractions();

  // 检查Boss击败（每帧）
  if (LEVELS[currentLevel].bossLevel) {
    checkLevelComplete();
  }
}

function performAttack() {
  const w = WEAPONS[player.weapon];
  player.attackCooldown = w.cooldown;
  player.isAttacking = true;
  player.attackTimer = 8;

  for (const e of enemies) {
    if (e.hp <= 0) continue;
    if (e.type === 'lurker' && e.isHidden) continue;

    // 霰弹枪：扇形多点检测
    if (w.spread > 0) {
      for (let angle = -w.spread; angle <= w.spread; angle += w.spread) {
        const ax = player.x + Math.cos(player.dir + angle) * w.range;
        const ay = player.y + Math.sin(player.dir + angle) * w.range;
        const dx = ax - e.x;
        const dy = ay - e.y;
        if (Math.sqrt(dx*dx + dy*dy) < e.size + 15) {
          e.hp -= w.damage;
          screenShake = 8;
          if (e.hp <= 0) e.hp = 0;
          break;
        }
      }
    } else {
      // 直线检测
      const ax = player.x + Math.cos(player.dir) * w.range;
      const ay = player.y + Math.sin(player.dir) * w.range;
      const dx = ax - e.x;
      const dy = ay - e.y;
      if (Math.sqrt(dx*dx + dy*dy) < e.size + 10) {
        e.hp -= w.damage;
        screenShake = 5;
        if (e.hp <= 0) e.hp = 0;
      }
    }
  }

  setTimeout(() => { player.isAttacking = false; }, 150);
}

// ===== 摄像机 =====
function updateCamera() {
  const targetX = player.x - canvas.width / 2;
  const targetY = player.y - canvas.height / 2;
  cameraX += (targetX - cameraX) * 0.1;
  cameraY += (targetY - cameraY) * 0.1;
}

// ===== 渲染 =====
function render() {
  // 胜利场景：绿色背景
  if (gameWon) {
    ctx.fillStyle = '#2d5a1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.save();

  // 屏幕震动
  if (screenShake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * screenShake,
      (Math.random() - 0.5) * screenShake
    );
    screenShake *= 0.8;
    if (screenShake < 0.5) screenShake = 0;
  }

  ctx.translate(-cameraX, -cameraY);

  // 绘制地图
  const startTX = Math.floor(cameraX / TILE);
  const startTY = Math.floor(cameraY / TILE);
  const endTX = startTX + Math.ceil(canvas.width / TILE) + 2;
  const endTY = startTY + Math.ceil(canvas.height / TILE) + 2;

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      const tile = getTile(tx, ty);
      const x = tx * TILE;
      const y = ty * TILE;

      if (gameWon) {
        // 胜利场景渲染
        if (tile === 1) {
          // 树木/灌木
          ctx.fillStyle = '#1a4a12';
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = '#2a6a1e';
          ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
        } else {
          // 草地
          ctx.fillStyle = '#3a7a2e';
          ctx.fillRect(x, y, TILE, TILE);
          ctx.strokeStyle = '#4a8a3e';
          ctx.strokeRect(x, y, TILE, TILE);
          // 随机小花
          const seed = (tx * 7 + ty * 13) % 10;
          if (seed === 0) {
            ctx.fillStyle = '#ff6';
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (seed === 1) {
            ctx.fillStyle = '#f88';
            ctx.beginPath();
            ctx.arc(x + 15, y + 25, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (seed === 2) {
            ctx.fillStyle = '#aaf';
            ctx.beginPath();
            ctx.arc(x + 25, y + 15, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // 正常游戏场景
        if (tile === 1) {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(x, y, TILE, TILE);
          ctx.strokeStyle = '#252540';
          ctx.strokeRect(x, y, TILE, TILE);
        } else if (tile === 0 || tile === 5 || tile === 6) {
          ctx.fillStyle = '#111';
          ctx.fillRect(x, y, TILE, TILE);
          ctx.strokeStyle = '#1a1a1a';
          ctx.strokeRect(x, y, TILE, TILE);
          if ((tx + ty) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.01)';
            ctx.fillRect(x, y, TILE, TILE);
          }
        }
      }
    }
  }

  // 绘制互动点和武器
  for (const item of items) {
    if (pickups.includes(item.id)) continue;
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    if (Math.sqrt(dx*dx + dy*dy) > 400) continue;

    if (item.type === 'weapon') {
      // 武器在地上发光
      ctx.fillStyle = 'rgba(200, 150, 50, 0.4)';
      ctx.beginPath();
      ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
      ctx.fill();
      // 武器名称
      ctx.fillStyle = '#ca8';
      ctx.font = '11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(WEAPONS[item.weapon].name, item.x, item.y - 15);
    } else {
      ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
      ctx.beginPath();
      ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    if (nearbyInteractable === item) {
      ctx.fillStyle = '#8c8';
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      const label = item.type === 'weapon' ? '[E] 拾取' : '[E] 互动';
      ctx.fillText(label, item.x, item.y - 20);
    }
  }

  // 绘制敌人
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    if (e.type === 'lurker' && e.isHidden) continue;

    // Boss特殊渲染
    if (e.type === 'boss') {
      // 阴影
      ctx.fillStyle = 'rgba(100, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(e.x, e.y + 5, e.size + 3, 0, Math.PI * 2);
      ctx.fill();
      // 身体
      ctx.fillStyle = e.alertLevel >= 2 ? '#d33' : e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
      // 眼睛
      ctx.fillStyle = e.alertLevel >= 1 ? '#ff0' : '#800';
      const bEyeX = Math.cos(e.dir || 0) * 8;
      const bEyeY = Math.sin(e.dir || 0) * 8;
      ctx.beginPath();
      ctx.arc(e.x + bEyeX - 6, e.y + bEyeY - 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(e.x + bEyeX + 6, e.y + bEyeY - 4, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 警觉指示
    if (e.alertLevel === 1) {
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.alertLevel === 2) {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 血条（Boss始终显示）
    if (e.hp < e.maxHp || e.type === 'boss') {
      const barW = e.type === 'boss' ? 60 : e.size * 2;
      ctx.fillStyle = '#300';
      ctx.fillRect(e.x - barW/2, e.y - e.size - 10, barW, 4);
      ctx.fillStyle = e.type === 'boss' ? '#d44' : '#c44';
      ctx.fillRect(e.x - barW/2, e.y - e.size - 10, barW * (e.hp/e.maxHp), 4);
    }
  }

  // 绘制玩家
  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.invincible > 0 && Math.floor(player.invincible / 3) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }
  if (player.isDodging) {
    ctx.globalAlpha = 0.3;
  }

  // 身体
  ctx.fillStyle = player.isDodging ? '#888' : '#ddd';
  ctx.beginPath();
  ctx.arc(0, 0, PLAYER_SIZE, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#000';
  const eyeX = Math.cos(player.dir) * 4;
  const eyeY = Math.sin(player.dir) * 4;
  ctx.beginPath();
  ctx.arc(eyeX - 3, eyeY - 2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX + 3, eyeY - 2, 2, 0, Math.PI * 2);
  ctx.fill();

  // 武器攻击动画
  if (player.isAttacking) {
    const w = WEAPONS[player.weapon];
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    if (w.spread > 0) {
      // 霰弹枪扇形
      ctx.beginPath();
      const startAngle = player.dir - w.spread;
      const endAngle = player.dir + w.spread;
      ctx.arc(0, 0, w.range * 0.6, startAngle, endAngle);
      ctx.stroke();
    } else {
      // 直线武器
      const ax = Math.cos(player.dir) * (PLAYER_SIZE + 8);
      const ay = Math.sin(player.dir) * (PLAYER_SIZE + 8);
      ctx.beginPath();
      ctx.arc(ax, ay, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();

  ctx.restore();

  // 更新HUD
  if (!gameWon) {
    document.getElementById('hp-fill').style.width = (player.hp / player.maxHp * 100) + '%';
    document.getElementById('hp-text').textContent = `HP ${player.hp}/${player.maxHp}`;

    const weaponName = WEAPONS[player.weapon].name;
    const weaponInfo = WEAPONS[player.weapon];
    document.getElementById('weapon-display').innerHTML =
      `<span class="weapon">${weaponName}</span> <span style="color:#666">伤害${weaponInfo.damage}</span>`;
  }

  // 小地图
  renderMinimap();
}

function renderMinimap() {
  minimapCtx.fillStyle = gameWon ? '#2d5a1e' : '#000';
  minimapCtx.fillRect(0, 0, 120, 120);

  const scale = 2.5;
  const offsetX = 60 - player.x * scale / TILE;
  const offsetY = 60 - player.y * scale / TILE;

  for (let ty = 0; ty < MAP.length; ty++) {
    for (let tx = 0; tx < MAP[0].length; tx++) {
      const tile = getTile(tx, ty);
      if (tile === 0 || tile === 5 || tile === 6) {
        const sx = tx * TILE * scale / TILE + offsetX;
        const sy = ty * TILE * scale / TILE + offsetY;
        minimapCtx.fillStyle = gameWon ? '#4a8a3e' : '#222';
        minimapCtx.fillRect(sx, sy, TILE * scale / TILE, TILE * scale / TILE);
      }
    }
  }

  // 敌人
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    if (e.type === 'lurker' && e.isHidden) continue;
    minimapCtx.fillStyle = e.type === 'boss' ? '#f44' : '#c44';
    minimapCtx.fillRect(
      e.x * scale / TILE + offsetX - 1,
      e.y * scale / TILE + offsetY - 1,
      e.type === 'boss' ? 5 : 3,
      e.type === 'boss' ? 5 : 3
    );
  }

  // 玩家
  minimapCtx.fillStyle = '#4f4';
  minimapCtx.fillRect(
    player.x * scale / TILE + offsetX - 2,
    player.y * scale / TILE + offsetY - 2,
    4, 4
  );
}

// ===== 游戏循环 =====
function gameLoop() {
  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!showingNarrative && !showingTransition && !gameWon) {
    updatePlayer();
    updateEnemies();
  } else if (gameWon) {
    // 胜利场景：只更新移动
    if (!showingNarrative) {
      let mx = 0, my = 0;
      if (keys['KeyW'] || keys['ArrowUp']) my = -1;
      if (keys['KeyS'] || keys['ArrowDown']) my = 1;
      if (keys['KeyA'] || keys['ArrowLeft']) mx = -1;
      if (keys['KeyD'] || keys['ArrowRight']) mx = 1;
      if (touchMove) { mx = touchMove.x; my = touchMove.y; }
      const len = Math.sqrt(mx*mx + my*my);
      if (len > 0.1) {
        mx /= len; my /= len;
        player.dir = Math.atan2(my, mx);
      }
      const newX = player.x + mx * PLAYER_SPEED;
      const newY = player.y + my * PLAYER_SPEED;
      if (isWalkable(newX, player.y)) player.x = newX;
      if (isWalkable(player.x, newY)) player.y = newY;
    }
  }

  updateCamera();
  frameCount++;
  render();

  requestAnimationFrame(gameLoop);
}

// ===== 启动 =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

if ('ontouchstart' in window) {
  document.getElementById('mobile-controls').style.display = 'block';
}

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  gameStarted = true;
  loadLevel(0);
});

gameLoop();
