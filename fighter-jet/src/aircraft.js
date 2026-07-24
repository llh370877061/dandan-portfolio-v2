/**
 * 飞机系统
 * 负责：8种飞机模型（简单几何体）、飞行参数、驾驶舱视角
 *
 * 集成方式：脚本加载后自动挂载到 GameEngine.prototype
 */

/* ================================================================
 * 飞行参数配置
 * ================================================================ */

const AIRCRAFT_CONFIGS = {
  j20: {
    name: '歼-20',
    maxSpeed: 3000,
    acceleration: 150,
    turnRate: 2.5,
    health: 100,
    missiles: 8,
    description: '第五代隐身战斗机'
  },
  j35: {
    name: '歼-35',
    maxSpeed: 2800,
    acceleration: 140,
    turnRate: 2.8,
    health: 100,
    missiles: 6,
    description: '第五代隐身舰载机'
  },
  j16: {
    name: '歼-16',
    maxSpeed: 2200,
    acceleration: 120,
    turnRate: 2.2,
    health: 120,
    missiles: 10,
    description: '多用途战斗机'
  },
  j10: {
    name: '歼-10',
    maxSpeed: 2000,
    acceleration: 130,
    turnRate: 3.0,
    health: 80,
    missiles: 6,
    description: '轻型战斗机'
  },
  mig25: {
    name: '米格-25',
    maxSpeed: 3000,
    acceleration: 100,
    turnRate: 1.8,
    health: 110,
    missiles: 4,
    description: '高空高速截击机'
  },
  mig27: {
    name: '米格-27',
    maxSpeed: 1800,
    acceleration: 110,
    turnRate: 2.4,
    health: 100,
    missiles: 6,
    description: '攻击机'
  },
  y20: {
    name: '运-20',
    maxSpeed: 800,
    acceleration: 60,
    turnRate: 1.2,
    health: 200,
    missiles: 0,
    description: '大型运输机'
  },
  bomber: {
    name: '轰炸机',
    maxSpeed: 1200,
    acceleration: 80,
    turnRate: 1.5,
    health: 150,
    missiles: 12,
    description: '战略轰炸机'
  }
};

/* ================================================================
 * 几何体构建工具
 * ================================================================ */

/**
 * 生成单个顶点 [x, y, z, w, r, g, b, a]
 */
function _vert(x, y, z, r, g, b) {
  return [x, y, z, 1, r, g, b, 1];
}

/**
 * 生成三角形（3个顶点）
 */
function _tri3(v1, v2, v3) {
  return v1.concat(v2, v3);
}

/**
 * 生成四边形（2个三角形）
 */
function _quad4(v1, v2, v3, v4) {
  return _tri3(v1, v2, v3).concat(_tri3(v1, v3, v4));
}

/**
 * 生成长方体 — 6个面，12个三角形
 * @param {number} cx 中心 x
 * @param {number} cy 中心 y
 * @param {number} cz 中心 z
 * @param {number} sx x 方向尺寸
 * @param {number} sy y 方向尺寸
 * @param {number} sz z 方向尺寸
 * @param {number} r 红
 * @param {number} g 绿
 * @param {number} b 蓝
 */
function _box(cx, cy, cz, sx, sy, sz, r, g, b) {
  const hx = sx / 2, hy = sy / 2, hz = sz / 2;
  const x0 = cx - hx, x1 = cx + hx;
  const y0 = cy - hy, y1 = cy + hy;
  const z0 = cz - hz, z1 = cz + hz;

  return []
    // 上面 (+y)
    .concat(_quad4(
      _vert(x0, y1, z1, r, g, b), _vert(x1, y1, z1, r, g, b),
      _vert(x1, y1, z0, r, g, b), _vert(x0, y1, z0, r, g, b)))
    // 下面 (-y)
    .concat(_quad4(
      _vert(x0, y0, z0, r, g, b), _vert(x1, y0, z0, r, g, b),
      _vert(x1, y0, z1, r, g, b), _vert(x0, y0, z1, r, g, b)))
    // 前面 (+z)
    .concat(_quad4(
      _vert(x0, y0, z1, r, g, b), _vert(x1, y0, z1, r, g, b),
      _vert(x1, y1, z1, r, g, b), _vert(x0, y1, z1, r, g, b)))
    // 后面 (-z)
    .concat(_quad4(
      _vert(x1, y0, z0, r, g, b), _vert(x0, y0, z0, r, g, b),
      _vert(x0, y1, z0, r, g, b), _vert(x1, y1, z0, r, g, b)))
    // 右面 (+x)
    .concat(_quad4(
      _vert(x1, y0, z1, r, g, b), _vert(x1, y0, z0, r, g, b),
      _vert(x1, y1, z0, r, g, b), _vert(x1, y1, z1, r, g, b)))
    // 左面 (-x)
    .concat(_quad4(
      _vert(x0, y0, z0, r, g, b), _vert(x0, y0, z1, r, g, b),
      _vert(x0, y1, z1, r, g, b), _vert(x0, y1, z0, r, g, b)));
}

/**
 * 生成棱锥体（4个侧面三角形 + 底面）
 * 底面在 z = baseZ，顶点在 (cx, cy, tipZ)
 */
function _pyramid(cx, cy, baseZ, baseW, baseH, tipZ, r, g, b) {
  const bx0 = cx - baseW / 2, bx1 = cx + baseW / 2;
  const by0 = cy - baseH / 2, by1 = cy + baseH / 2;
  const tip = _vert(cx, cy, tipZ, r, g, b);

  return []
    // 4个侧面
    .concat(_tri3(_vert(bx0, by0, baseZ, r, g, b), _vert(bx1, by0, baseZ, r, g, b), tip))
    .concat(_tri3(_vert(bx1, by0, baseZ, r, g, b), _vert(bx1, by1, baseZ, r, g, b), tip))
    .concat(_tri3(_vert(bx1, by1, baseZ, r, g, b), _vert(bx0, by1, baseZ, r, g, b), tip))
    .concat(_tri3(_vert(bx0, by1, baseZ, r, g, b), _vert(bx0, by0, baseZ, r, g, b), tip))
    // 底面
    .concat(_quad4(
      _vert(bx0, by0, baseZ, r, g, b), _vert(bx1, by0, baseZ, r, g, b),
      _vert(bx1, by1, baseZ, r, g, b), _vert(bx0, by1, baseZ, r, g, b)));
}

/**
 * 生成三角形翼面（用于机翼、尾翼）
 * 三个顶点定义一个三角形翼面
 */
function _wing(x1, y1, z1, x2, y2, z2, x3, y3, z3, r, g, b) {
  return _tri3(_vert(x1, y1, z1, r, g, b), _vert(x2, y2, z2, r, g, b), _vert(x3, y3, z3, r, g, b));
}

/* ================================================================
 * 8 种飞机 3D 模型生成器
 * ================================================================ */

const AircraftModelBuilders = {

  /**
   * 歼-20：隐身外形，菱形截面机身，三角翼，双外倾垂尾
   */
  buildJ20() {
    const v = [];
    const d = [0.15, 0.15, 0.18]; // 隐身深灰
    const p = [0.18, 0.18, 0.22]; // 面板色

    // 机头棱锥
    v.push(..._pyramid(0, 0, -2.2, 0.3, 0.2, -3.2, ...d));
    // 机身（菱形截面 — 窄长方体近似）
    v.push(..._box(0, 0, -0.5, 0.35, 0.22, 3.4, ...d));
    // 座舱盖（凸起）
    v.push(..._box(0, 0.14, -1.2, 0.18, 0.1, 0.5, 0.25, 0.3, 0.35));
    // 三角主翼 — 左
    v.push(..._wing(
      -0.18, 0, -0.3,   -2.8, 0, 0.6,   -0.18, 0, 1.6,  ...p));
    // 三角主翼 — 右
    v.push(..._wing(
      0.18, 0, -0.3,    0.18, 0, 1.6,    2.8, 0, 0.6,   ...p));
    // 双外倾垂尾 — 左
    v.push(..._tri3(
      _vert(-0.18, 0.11, 1.0, ...p),
      _vert(-0.55, 0.65, 1.5, ...p),
      _vert(-0.18, 0.11, 1.9, ...p)));
    // 双外倾垂尾 — 右
    v.push(..._tri3(
      _vert(0.18, 0.11, 1.0, ...p),
      _vert(0.18, 0.11, 1.9, ...p),
      _vert(0.55, 0.65, 1.5, ...p)));
    // 全动平尾 — 左
    v.push(..._wing(
      -0.15, 0, 1.0,   -1.3, 0, 1.7,   -0.15, 0, 1.9,  ...d));
    // 全动平尾 — 右
    v.push(..._wing(
      0.15, 0, 1.0,    0.15, 0, 1.9,    1.3, 0, 1.7,   ...d));
    // 发动机喷口 ×2
    v.push(..._box(-0.08, 0, 1.85, 0.1, 0.1, 0.35, 0.06, 0.06, 0.06));
    v.push(..._box(0.08, 0, 1.85, 0.1, 0.1, 0.35, 0.06, 0.06, 0.06));

    return new Float32Array(v);
  },

  /**
   * 歼-35：类似歼-20 但稍小，舰载机特征
   */
  buildJ35() {
    const v = [];
    const d = [0.18, 0.19, 0.22];
    const p = [0.22, 0.22, 0.26];

    // 机头棱锥（稍短）
    v.push(..._pyramid(0, 0, -1.8, 0.28, 0.18, -2.6, ...d));
    // 机身
    v.push(..._box(0, 0, -0.3, 0.32, 0.2, 2.8, ...d));
    // 座舱盖
    v.push(..._box(0, 0.12, -1.0, 0.16, 0.09, 0.45, 0.28, 0.32, 0.38));
    // 三角主翼 — 左
    v.push(..._wing(
      -0.16, 0, -0.2,   -2.3, 0, 0.5,   -0.16, 0, 1.3,  ...p));
    // 三角主翼 — 右
    v.push(..._wing(
      0.16, 0, -0.2,    0.16, 0, 1.3,    2.3, 0, 0.5,   ...p));
    // 双垂尾 — 左
    v.push(..._tri3(
      _vert(-0.16, 0.1, 0.8, ...p),
      _vert(-0.45, 0.55, 1.2, ...p),
      _vert(-0.16, 0.1, 1.5, ...p)));
    // 双垂尾 — 右
    v.push(..._tri3(
      _vert(0.16, 0.1, 0.8, ...p),
      _vert(0.16, 0.1, 1.5, ...p),
      _vert(0.45, 0.55, 1.2, ...p)));
    // 平尾 — 左
    v.push(..._wing(
      -0.14, 0, 0.8,   -1.0, 0, 1.4,   -0.14, 0, 1.5,  ...d));
    // 平尾 — 右
    v.push(..._wing(
      0.14, 0, 0.8,    0.14, 0, 1.5,    1.0, 0, 1.4,   ...d));
    // 发动机喷口
    v.push(..._box(-0.07, 0, 1.55, 0.09, 0.09, 0.3, 0.06, 0.06, 0.06));
    v.push(..._box(0.07, 0, 1.55, 0.09, 0.09, 0.3, 0.06, 0.06, 0.06));

    return new Float32Array(v);
  },

  /**
   * 歼-16：双发重型战斗机，宽机身，常规布局
   */
  buildJ16() {
    const v = [];
    const d = [0.38, 0.39, 0.42]; // 空优灰
    const p = [0.42, 0.43, 0.46];
    const e = [0.12, 0.12, 0.12]; // 发动机色

    // 机头
    v.push(..._pyramid(0, 0, -2.0, 0.35, 0.25, -1.2, ...d));
    // 机身（较宽）
    v.push(..._box(0, 0, -0.2, 0.42, 0.28, 3.2, ...d));
    // 座舱盖
    v.push(..._box(0, 0.16, -1.0, 0.2, 0.12, 0.5, 0.3, 0.35, 0.4));
    // 机翼 — 左（梯形）
    v.push(..._quad4(
      _vert(-0.21, 0, -0.4, ...p),
      _vert(-2.6, 0, 0.3, ...p),
      _vert(-2.4, 0, 1.2, ...p),
      _vert(-0.21, 0, 1.0, ...p)));
    // 机翼 — 右
    v.push(..._quad4(
      _vert(0.21, 0, -0.4, ...p),
      _vert(0.21, 0, 1.0, ...p),
      _vert(2.4, 0, 1.2, ...p),
      _vert(2.6, 0, 0.3, ...p)));
    // 垂尾
    v.push(..._tri3(
      _vert(0, 0.14, 1.0, ...p),
      _vert(0, 0.14, 2.0, ...p),
      _vert(0, 0.8, 1.5, ...p)));
    // 平尾 — 左
    v.push(..._wing(
      -0.18, 0, 1.0,   -1.4, 0, 1.7,   -0.18, 0, 1.8,  ...d));
    // 平尾 — 右
    v.push(..._wing(
      0.18, 0, 1.0,    0.18, 0, 1.8,    1.4, 0, 1.7,   ...d));
    // 发动机舱 ×2（机身两侧突出）
    v.push(..._box(-0.12, -0.08, 0.5, 0.18, 0.16, 1.8, ...e));
    v.push(..._box(0.12, -0.08, 0.5, 0.18, 0.16, 1.8, ...e));
    // 喷口
    v.push(..._box(-0.12, -0.08, 1.85, 0.1, 0.1, 0.25, 0.05, 0.05, 0.05));
    v.push(..._box(0.12, -0.08, 1.85, 0.1, 0.1, 0.25, 0.05, 0.05, 0.05));

    return new Float32Array(v);
  },

  /**
   * 歼-10：单发轻型战斗机，鸭式布局，三角翼
   */
  buildJ10() {
    const v = [];
    const d = [0.48, 0.49, 0.52]; // 浅灰
    const p = [0.52, 0.53, 0.56];
    const n = [0.55, 0.2, 0.15]; // 进气道暗色

    // 机头
    v.push(..._pyramid(0, 0, -1.8, 0.25, 0.2, -1.0, ...d));
    // 机身
    v.push(..._box(0, 0, -0.2, 0.28, 0.22, 2.6, ...d));
    // 座舱盖
    v.push(..._box(0, 0.13, -0.9, 0.15, 0.1, 0.4, 0.3, 0.38, 0.45));
    // 鸭翼 — 左（小三角翼在机头两侧）
    v.push(..._wing(
      -0.14, 0.05, -1.3,   -0.9, 0.05, -0.8,   -0.14, 0.05, -0.6,  ...p));
    // 鸭翼 — 右
    v.push(..._wing(
      0.14, 0.05, -1.3,    0.14, 0.05, -0.6,    0.9, 0.05, -0.8,   ...p));
    // 三角主翼 — 左
    v.push(..._tri3(
      _vert(-0.14, 0, -0.3, ...p),
      _vert(-2.2, 0, 0.8, ...p),
      _vert(-0.14, 0, 1.5, ...p)));
    // 三角主翼 — 右
    v.push(..._tri3(
      _vert(0.14, 0, -0.3, ...p),
      _vert(0.14, 0, 1.5, ...p),
      _vert(2.2, 0, 0.8, ...p)));
    // 垂尾
    v.push(..._tri3(
      _vert(0, 0.11, 0.8, ...p),
      _vert(0, 0.11, 1.7, ...p),
      _vert(0, 0.65, 1.2, ...p)));
    // 腹部进气道
    v.push(..._box(0, -0.12, -0.8, 0.22, 0.08, 0.5, ...n));
    // 发动机喷口
    v.push(..._box(0, 0, 1.55, 0.12, 0.12, 0.3, 0.06, 0.06, 0.06));

    return new Float32Array(v);
  },

  /**
   * 米格-25：大型三角翼截击机，矩形进气道
   */
  buildMiG25() {
    const v = [];
    const d = [0.58, 0.58, 0.6];  // 银灰
    const p = [0.62, 0.62, 0.64];
    const n = [0.15, 0.15, 0.18]; // 进气道暗色

    // 机头（扁平矩形截面）
    v.push(..._box(0, 0, -2.5, 0.45, 0.3, 1.0, ...d));
    // 机头前端收窄
    v.push(..._pyramid(0, 0, -3.0, 0.45, 0.3, -0.8, ...d));
    // 机身（大型矩形）
    v.push(..._box(0, 0, -0.5, 0.5, 0.35, 3.5, ...d));
    // 座舱盖
    v.push(..._box(0, 0.2, -1.5, 0.22, 0.12, 0.6, 0.35, 0.4, 0.45));
    // 矩形进气道 ×2（机身两侧大盒子）
    v.push(..._box(-0.32, -0.05, -0.8, 0.14, 0.28, 2.0, ...n));
    v.push(..._box(0.32, -0.05, -0.8, 0.14, 0.28, 2.0, ...n));
    // 巨大三角翼 — 左
    v.push(..._tri3(
      _vert(-0.25, 0, -0.2, ...p),
      _vert(-3.2, 0, 1.0, ...p),
      _vert(-0.25, 0, 2.0, ...p)));
    // 巨大三角翼 — 右
    v.push(..._tri3(
      _vert(0.25, 0, -0.2, ...p),
      _vert(0.25, 0, 2.0, ...p),
      _vert(3.2, 0, 1.0, ...p)));
    // 双垂尾
    v.push(..._tri3(
      _vert(-0.25, 0.18, 1.2, ...p),
      _vert(-0.25, 0.18, 2.1, ...p),
      _vert(-0.55, 0.85, 1.6, ...p)));
    v.push(..._tri3(
      _vert(0.25, 0.18, 1.2, ...p),
      _vert(0.55, 0.85, 1.6, ...p),
      _vert(0.25, 0.18, 2.1, ...p)));
    // 发动机喷口（大型）
    v.push(..._box(-0.15, 0, 1.85, 0.15, 0.15, 0.4, 0.05, 0.05, 0.05));
    v.push(..._box(0.15, 0, 1.85, 0.15, 0.15, 0.4, 0.05, 0.05, 0.05));

    return new Float32Array(v);
  },

  /**
   * 米格-27：攻击机，可变后掠翼外观，扁平机头
   */
  buildMiG27() {
    const v = [];
    const d = [0.3, 0.34, 0.24]; // 迷彩绿灰
    const p = [0.34, 0.38, 0.28];
    const n = [0.12, 0.12, 0.1];

    // 扁平机头（攻击机特征 — 下颚式进气）
    v.push(..._box(0, -0.05, -2.0, 0.4, 0.2, 0.8, ...d));
    v.push(..._pyramid(0, -0.05, -2.4, 0.4, 0.2, -0.5, ...d));
    // 机身
    v.push(..._box(0, 0, -0.5, 0.38, 0.28, 3.0, ...d));
    // 座舱盖（较高位置）
    v.push(..._box(0, 0.16, -1.2, 0.18, 0.1, 0.45, 0.3, 0.35, 0.3));
    // 可变后掠翼 — 左（展开状态，梯形）
    v.push(..._quad4(
      _vert(-0.19, 0, -0.3, ...p),
      _vert(-2.4, 0, 0.4, ...p),
      _vert(-2.0, 0, 1.3, ...p),
      _vert(-0.19, 0, 1.0, ...p)));
    // 可变后掠翼 — 右
    v.push(..._quad4(
      _vert(0.19, 0, -0.3, ...p),
      _vert(0.19, 0, 1.0, ...p),
      _vert(2.0, 0, 1.3, ...p),
      _vert(2.4, 0, 0.4, ...p)));
    // 垂尾
    v.push(..._tri3(
      _vert(0, 0.14, 0.8, ...p),
      _vert(0, 0.14, 1.8, ...p),
      _vert(0, 0.7, 1.3, ...p)));
    // 平尾 — 左
    v.push(..._wing(
      -0.15, 0, 0.9,   -1.1, 0, 1.5,   -0.15, 0, 1.6,  ...d));
    // 平尾 — 右
    v.push(..._wing(
      0.15, 0, 0.9,    0.15, 0, 1.6,    1.1, 0, 1.5,   ...d));
    // 下颚进气道
    v.push(..._box(0, -0.16, -1.5, 0.25, 0.08, 0.6, ...n));
    // 发动机喷口
    v.push(..._box(0, 0, 1.65, 0.12, 0.12, 0.3, 0.05, 0.05, 0.05));

    return new Float32Array(v);
  },

  /**
   * 运-20：大型运输机，宽体机身，上单翼，T形尾翼
   */
  buildY20() {
    const v = [];
    const d = [0.3, 0.3, 0.32];  // 深灰
    const p = [0.35, 0.35, 0.37];
    const w = [0.28, 0.28, 0.3]; // 机翼色
    const n = [0.1, 0.1, 0.1];   // 发动机色

    // 机头（圆钝）
    v.push(..._pyramid(0, 0, -2.8, 0.55, 0.5, -0.8, ...d));
    // 机身（宽大方形）
    v.push(..._box(0, 0, -0.2, 0.55, 0.5, 4.2, ...d));
    // 驾驶舱窗
    v.push(..._box(0, 0.2, -2.0, 0.3, 0.12, 0.2, 0.3, 0.35, 0.4));
    // 上单翼 — 左（高挂位置）
    v.push(..._quad4(
      _vert(-0.28, 0.25, -0.3, ...w),
      _vert(-3.5, 0.25, 0.5, ...w),
      _vert(-3.2, 0.25, 1.5, ...w),
      _vert(-0.28, 0.25, 1.0, ...w)));
    // 上单翼 — 右
    v.push(..._quad4(
      _vert(0.28, 0.25, -0.3, ...w),
      _vert(0.28, 0.25, 1.0, ...w),
      _vert(3.2, 0.25, 1.5, ...w),
      _vert(3.5, 0.25, 0.5, ...w)));
    // 发动机挂架 ×2（翼下）
    v.push(..._box(-1.5, 0.18, 0.3, 0.15, 0.1, 0.5, ...p));
    v.push(..._box(1.5, 0.18, 0.3, 0.15, 0.1, 0.5, ...p));
    // 发动机 ×2
    v.push(..._box(-1.5, 0.12, 0.3, 0.12, 0.12, 0.55, ...n));
    v.push(..._box(1.5, 0.12, 0.3, 0.12, 0.12, 0.55, ...n));
    // T形垂尾
    v.push(..._tri3(
      _vert(0, 0.25, 1.5, ...p),
      _vert(0, 0.25, 2.3, ...p),
      _vert(0, 1.2, 1.9, ...p)));
    // T形平尾（垂尾顶部）
    v.push(..._quad4(
      _vert(0, 1.2, 1.5, ...p),
      _vert(-1.0, 1.2, 1.9, ...p),
      _vert(1.0, 1.2, 1.9, ...p),
      _vert(0, 1.2, 2.3, ...p)));
    // 起落架舱整流罩 ×2（机腹两侧）
    v.push(..._box(-0.2, -0.28, 0.2, 0.1, 0.08, 1.2, ...d));
    v.push(..._box(0.2, -0.28, 0.2, 0.1, 0.08, 1.2, ...d));

    return new Float32Array(v);
  },

  /**
   * 轰炸机：飞翼布局，无明显机身，大后掠角
   */
  buildBomber() {
    const v = [];
    const d = [0.1, 0.1, 0.12];  // 深黑灰
    const p = [0.14, 0.14, 0.16];
    const c = [0.2, 0.22, 0.25]; // 座舱色

    // 中央机身（扁平飞翼核心）
    v.push(..._box(0, 0, -0.5, 0.6, 0.15, 3.0, ...d));
    // 前缘三角（从中央向前延伸的飞翼前缘）
    v.push(..._tri3(
      _vert(0, 0, -2.0, ...d),
      _vert(-0.3, 0, -0.5, ...d),
      _vert(0.3, 0, -0.5, ...d)));
    // 飞翼左半
    v.push(..._tri3(
      _vert(0, 0, -1.5, ...p),
      _vert(-4.0, 0, 0.5, ...p),
      _vert(0, 0, 2.0, ...p)));
    // 飞翼右半
    v.push(..._tri3(
      _vert(0, 0, -1.5, ...p),
      _vert(0, 0, 2.0, ...p),
      _vert(4.0, 0, 0.5, ...p)));
    // 飞翼后缘锯齿 — 左
    v.push(..._tri3(
      _vert(-0.2, 0, 1.5, ...d),
      _vert(-1.5, 0, 2.0, ...d),
      _vert(-0.2, 0, 2.2, ...d)));
    // 飞翼后缘锯齿 — 右
    v.push(..._tri3(
      _vert(0.2, 0, 1.5, ...d),
      _vert(0.2, 0, 2.2, ...d),
      _vert(1.5, 0, 2.0, ...d)));
    // 驾驶舱（凸起）
    v.push(..._box(0, 0.1, -1.2, 0.2, 0.1, 0.4, ...c));
    // 背部隆起（弹仓/设备舱）
    v.push(..._box(0, 0.08, 0.2, 0.4, 0.08, 1.5, ...d));
    // 发动机进气口 ×2（背部）
    v.push(..._box(-0.25, 0.1, 0.5, 0.1, 0.06, 0.3, 0.06, 0.06, 0.06));
    v.push(..._box(0.25, 0.1, 0.5, 0.1, 0.06, 0.3, 0.06, 0.06, 0.06));
    // 发动机喷口 ×2（后缘内）
    v.push(..._box(-0.2, 0, 1.7, 0.08, 0.08, 0.2, 0.04, 0.04, 0.04));
    v.push(..._box(0.2, 0, 1.7, 0.08, 0.08, 0.2, 0.04, 0.04, 0.04));

    return new Float32Array(v);
  }
};

/* ================================================================
 * 飞机系统
 * ================================================================ */

class AircraftSystem {
  constructor() {
    this.currentAircraft = null;
    this.cockpitView = true;
    /** @type {Float32Array|null} 缓存的模型顶点数据 */
    this._modelData = null;
    /** @type {number} 模型三角形数 */
    this._modelVertexCount = 0;
  }

  /**
   * 加载指定类型飞机，生成模型数据
   * @param {string} type 飞机类型 key
   * @returns {object|null} 飞机状态对象
   */
  loadAircraft(type) {
    const config = AIRCRAFT_CONFIGS[type];
    if (!config) {
      console.error('未知飞机类型:', type);
      return null;
    }
    this.currentAircraft = {
      ...config,
      type: type,
      speed: 0,
      altitude: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { pitch: 0, yaw: 0, roll: 0 },
      missilesLeft: config.missiles
    };
    this._buildModel(type);
    console.log('加载飞机:', config.name, '| 顶点数:', this._modelVertexCount);
    return this.currentAircraft;
  }

  /**
   * 根据类型构建 3D 模型
   * @param {string} type
   */
  _buildModel(type) {
    const builders = {
      j20:    () => AircraftModelBuilders.buildJ20(),
      j35:    () => AircraftModelBuilders.buildJ35(),
      j16:    () => AircraftModelBuilders.buildJ16(),
      j10:    () => AircraftModelBuilders.buildJ10(),
      mig25:  () => AircraftModelBuilders.buildMiG25(),
      mig27:  () => AircraftModelBuilders.buildMiG27(),
      y20:    () => AircraftModelBuilders.buildY20(),
      bomber: () => AircraftModelBuilders.buildBomber(),
    };
    const builder = builders[type];
    if (builder) {
      this._modelData = builder();
      // 每个顶点 8 个 float: x,y,z,w,r,g,b,a
      this._modelVertexCount = this._modelData.length / 8;
    } else {
      this._modelData = null;
      this._modelVertexCount = 0;
    }
  }

  /**
   * 渲染飞机外部模型（3D 视图）
   * @param {WebGLRenderingContext} gl
   * @param {WebGLRenderer} renderer
   */
  render(gl, renderer) {
    if (!this._modelData || this._modelVertexCount === 0) return;

    const aPos = renderer.getAttribute('aPosition');
    const aCol = renderer.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) return;

    // 创建临时缓冲区上传模型数据
    // 每个顶点: [x, y, z, w, r, g, b, a] = 8 floats
    // aPosition 读前4个, aColor读后4个, stride = 8 * 4 = 32 bytes
    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this._modelData, gl.DYNAMIC_DRAW);

    const stride = 8 * 4; // 8 floats * 4 bytes

    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 4, gl.FLOAT, false, stride, 16);

    gl.drawArrays(gl.TRIANGLES, 0, this._modelVertexCount);

    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
    gl.deleteBuffer(vBuf);
  }

  /**
   * 渲染驾驶舱视角
   * @param {WebGLRenderingContext} gl
   * @param {WebGLRenderer} renderer
   */
  renderCockpit(gl, renderer) {
    if (window._cockpitSystem) {
      window._cockpitSystem.renderFrame(gl, renderer);
      window._cockpitSystem.renderCrosshair(gl, renderer);
    }
  }

  getSpeedKmh() {
    return this.currentAircraft ? this.currentAircraft.speed : 0;
  }

  getAltitude() {
    return this.currentAircraft ? this.currentAircraft.altitude : 0;
  }
}

// 暴露到全局作用域
window.AIRCRAFT_CONFIGS = AIRCRAFT_CONFIGS;
window.AircraftSystem = AircraftSystem;

/* ================================================================
 * 自动集成：挂载到 GameEngine 原型
 * 脚本加载后自动增强引擎的渲染流程
 * ================================================================ */

(function _autoIntegrate() {
  function _patch() {
    if (typeof GameEngine === 'undefined') return;

    // 保存原始 renderGameplay
    const _origRender = GameEngine.prototype.renderGameplay;
    GameEngine.prototype.renderGameplay = function () {
      // 调用原始渲染（清屏、设矩阵、画网格）
      _origRender.call(this);

      if (!this._aircraftState) return;

      const gl = this.renderer.getContext();
      if (!gl) return;

      // ---- 渲染飞机外部模型 ----
      if (!this._aircraftSystem) {
        this._aircraftSystem = new AircraftSystem();
        this._aircraftSystem.loadAircraft(this._aircraftState.type);
      }
      if (this._aircraftSystem.currentAircraft) {
        // 保存当前矩阵
        const uMV = this.renderer.getUniform('uModelViewMatrix');
        const origMV = gl.getUniform(this.renderer._program, uMV);

        // 模型视图矩阵：飞机在相机前方偏下（第三人称视角）
        const mv = this._makeIdentity();
        this._rotateY(mv, -this._aircraftState.rotation.yaw);
        this._rotateX(mv, -this._aircraftState.rotation.pitch);
        this._rotateZ(mv, -this._aircraftState.rotation.roll);
        this._translate(mv, -this._aircraftState.position.x * 0.01, -this._aircraftState.position.y * 0.01, -this._aircraftState.position.z * 0.01);
        // 飞机在相机前方一点（沿 -Z 方向）
        this._translate(mv, 0, -0.05, -0.8);
        // 飞机稍微向下看一点
        this._rotateX(mv, 0.1);

        gl.uniformMatrix4fv(uMV, false, mv);

        this._aircraftSystem.render(gl, this.renderer);

        // 恢复原始矩阵
        gl.uniformMatrix4fv(uMV, false, origMV);
      }

      // ---- 渲染驾驶舱覆盖层（2D HUD） ----
      if (this._aircraftSystem && this._aircraftSystem.cockpitView && typeof CockpitSystem !== 'undefined') {
        if (!this._cockpitSystem) {
          this._cockpitSystem = new CockpitSystem();
          window._cockpitSystem = this._cockpitSystem;
        }
        this._cockpitSystem.renderFrame(gl, this.renderer);
        this._cockpitSystem.renderCrosshair(gl, this.renderer);
      }
    };

    console.log('AircraftSystem: 已挂载到 GameEngine');
  }

  // 如果 GameEngine 已存在则直接挂载，否则等 DOM 就绪后重试
  if (typeof GameEngine !== 'undefined') {
    _patch();
  } else if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', function () {
      // 延迟检查，因为 game.js 可能在 DOMContentLoaded 期间才执行
      setTimeout(_patch, 50);
    });
  }
})();
