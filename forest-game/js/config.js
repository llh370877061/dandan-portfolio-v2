// 全局配置
export const CONFIG = {
  // 地图
  WORLD_SIZE: 400,
  BOUNDARY: 195,

  // 玩家
  PLAYER_HEIGHT: 1.7,
  PLAYER_SPEED: 5,
  PLAYER_SPRINT_SPEED: 9,
  PLAYER_EYE_HEIGHT: 1.6,

  // 相机
  MOUSE_SENSITIVITY: 0.002,
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 300,

  // 交互
  INTERACT_RANGE: 3.5,
  LADDER_RANGE: 6,       // 梯子交互范围更大
  ATTACK_RANGE: 4,

  // 树木
  TREE_COUNT: 300,
  FOREST_RADIUS: 180,
  MIN_TREE_SPACING: 5.5,
  SPECIAL_TREE_COUNT: 20,

  // 动物
  ANIMAL_COUNT: 15,

  // 生存
  SURVIVAL: {
    TEMPERATURE_START: 70,
    HUNGER_START: 80,
    STAMINA_START: 100,
    TEMPERATURE_DECAY: 0.25,
    HUNGER_DECAY: 0.12,
    STAMINA_DECAY: 0.04,
    NIGHT_TEMP_MULTIPLIER: 2.0,
    NEAR_FIRE_HEAL: 1.2,
    DEATH_THRESHOLD: 0,
    WARNING_THRESHOLD: 30,
    DANGER_THRESHOLD: 20,
  },

  // 时间
  TIME: {
    DAY_LENGTH: 300,    // 一个昼夜循环的秒数（5分钟）
    NIGHT_START: 0.6,   // 0.6=下午6点开始天黑
    NIGHT_END: 0.85,    // 0.85=凌晨5点多天亮
    SLEEP_RESTORE: 100,
  },

  // 雾
  FOG: {
    DENSITY_DAY: 0.018,
    DENSITY_NIGHT: 0.032,
    COLOR_DAY: 0x8899aa,
    COLOR_NIGHT: 0x223344,
  },

  // 按键绑定
  KEYS: {
    FORWARD: 'KeyW',
    BACKWARD: 'KeyS',
    LEFT: 'KeyA',
    RIGHT: 'KeyD',
    SPRINT: 'ShiftLeft',
    INVENTORY: 'Tab',
    DIARY: 'KeyJ',
    // 数字键功能
    SHOOT: 'Digit1',      // 1: 开枪
    PICKUP: 'Digit2',     // 2: 拾取
    VIEW: 'Digit3',       // 3: 查看
    CRAFT: 'Digit4',      // 4: 烹饪
    INTERACT: 'Digit5',   // 5: 所有互动（爬梯子、开箱子等）
    ATTACK: 0, // mouse left
  },
};
