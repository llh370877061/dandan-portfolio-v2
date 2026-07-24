// ========== 武器数据 ==========
const WEAPONS = {
  sniper: [
    { id: 'awp', name: 'AWP', type: 'sniper', damage: 150, fireRate: 42, magSize: 10, recoil: 95, range: 100, zoom: 8, special: '一击必杀（爆头）' },
    { id: 'barrett', name: 'Barrett M82', type: 'sniper', damage: 200, fireRate: 33, magSize: 10, recoil: 98, range: 100, zoom: 10, special: '穿透墙壁' },
    { id: 'svd', name: 'SVD Dragunov', type: 'sniper', damage: 90, fireRate: 70, magSize: 10, recoil: 75, range: 85, zoom: 6, special: '半自动' },
  ],
  rifle: [
    { id: 'ak47', name: 'AK-47', type: 'rifle', damage: 36, fireRate: 600, magSize: 30, recoil: 70, range: 70, zoom: 2, special: '高伤害' },
    { id: 'm4a1', name: 'M4A1', type: 'rifle', damage: 33, fireRate: 800, magSize: 30, recoil: 45, range: 72, zoom: 2, special: '稳定' },
    { id: 'scar', name: 'SCAR-H', type: 'rifle', damage: 40, fireRate: 625, magSize: 20, recoil: 50, range: 75, zoom: 2, special: '高单发' },
    { id: 'famas', name: 'FAMAS', type: 'rifle', damage: 30, fireRate: 900, magSize: 25, recoil: 40, range: 60, zoom: 2, special: '三连发' },
    { id: 'g36c', name: 'G36C', type: 'rifle', damage: 34, fireRate: 750, magSize: 30, recoil: 30, range: 70, zoom: 2, special: '易控制' },
    { id: 'aug', name: 'AUG', type: 'rifle', damage: 35, fireRate: 700, magSize: 30, recoil: 28, range: 72, zoom: 3, special: '开镜精准' },
    { id: 'sg556', name: 'SG556', type: 'rifle', damage: 35, fireRate: 700, magSize: 30, recoil: 42, range: 70, zoom: 3, special: '瞄准镜' },
    { id: 'tar21', name: 'TAR-21', type: 'rifle', damage: 33, fireRate: 800, magSize: 30, recoil: 38, range: 65, zoom: 2, special: '紧凑快速' },
    { id: 'qbz95', name: 'QBZ-95', type: 'rifle', damage: 34, fireRate: 750, magSize: 30, recoil: 40, range: 70, zoom: 2, special: '均衡' },
    { id: 'an94', name: 'AN-94', type: 'rifle', damage: 38, fireRate: 600, magSize: 30, recoil: 65, range: 72, zoom: 2, special: '二连发' },
  ],
  smg: [
    { id: 'mp5', name: 'MP5', type: 'smg', damage: 26, fireRate: 800, magSize: 30, recoil: 20, range: 45, zoom: 1.5, special: '经典稳定' },
    { id: 'uzi', name: 'UZI', type: 'smg', damage: 24, fireRate: 1200, magSize: 32, recoil: 50, range: 35, zoom: 1, special: '极速射' },
    { id: 'p90', name: 'P90', type: 'smg', damage: 26, fireRate: 857, magSize: 50, recoil: 35, range: 40, zoom: 1.5, special: '50发弹鼓' },
    { id: 'ump45', name: 'UMP45', type: 'smg', damage: 30, fireRate: 666, magSize: 25, recoil: 18, range: 50, zoom: 1.5, special: '高单发' },
    { id: 'bizon', name: 'PP-Bizon', type: 'smg', damage: 22, fireRate: 750, magSize: 64, recoil: 15, range: 35, zoom: 1, special: '64发弹鼓' },
    { id: 'vector', name: 'Vector', type: 'smg', damage: 24, fireRate: 1200, magSize: 25, recoil: 60, range: 30, zoom: 1, special: '极高射速' },
    { id: 'mac10', name: 'MAC-10', type: 'smg', damage: 22, fireRate: 1090, magSize: 30, recoil: 55, range: 25, zoom: 1, special: '便携腰射' },
    { id: 'kriss', name: 'Kriss Vector', type: 'smg', damage: 25, fireRate: 1100, magSize: 25, recoil: 45, range: 32, zoom: 1, special: '后坐抑制' },
  ],
  pistol: [
    { id: 'deagle', name: 'Desert Eagle', type: 'pistol', damage: 63, fireRate: 267, magSize: 7, recoil: 85, range: 50, zoom: 1.5, special: '高伤害' },
    { id: 'glock', name: 'Glock-18', type: 'pistol', damage: 22, fireRate: 1000, magSize: 20, recoil: 15, range: 30, zoom: 1, special: '三连发' },
    { id: 'usp', name: 'USP-S', type: 'pistol', damage: 35, fireRate: 350, magSize: 12, recoil: 12, range: 40, zoom: 1, special: '消音精准' },
    { id: 'p250', name: 'P250', type: 'pistol', damage: 38, fireRate: 400, magSize: 13, recoil: 30, range: 35, zoom: 1, special: '均衡' },
    { id: 'fiveseven', name: 'Five-Seven', type: 'pistol', damage: 32, fireRate: 400, magSize: 20, recoil: 10, range: 38, zoom: 1, special: '穿甲' },
  ],
};

const KNIVES = [
  { id: 'army', name: '军刀', icon: '🗡️', damage: 55, speed: 1.1, range: 2.5, desc: '标准军用匕首' },
  { id: 'dagger', name: '匕首', icon: '🔪', damage: 50, speed: 1.3, range: 2, desc: '攻速最快' },
  { id: 'butterfly', name: '蝴蝶刀', icon: '🦋', damage: 55, speed: 1.1, range: 2.5, desc: '甩刀特效' },
  { id: 'karambit', name: '爪刀', icon: '🦅', damage: 60, speed: 0.9, range: 2.5, desc: '伤害最高' },
  { id: 'cleaver', name: '砍刀', icon: '🪓', damage: 65, speed: 0.7, range: 3.5, desc: '范围最大' },
];

// 辅助：获取武器伤害倍率（命中区域）
function getHitMultiplier(bone) {
  if (bone === 'head') return 2.5;
  if (bone === 'torso') return 1.0;
  return 0.75; // limbs
}

// 辅助：根据射速算攻击间隔（毫秒）
function getFireInterval(weapon) {
  return 60000 / weapon.fireRate;
}
