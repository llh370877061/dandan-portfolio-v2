/**
 * 地形系统
 * 负责：程序化地形生成（森林区域）、机场跑道（灰色长条带标记线）、
 *       地形纹理渲染、视距裁剪优化
 *
 * 集成方式：脚本加载后自动 hook 到 GameEngine，无需修改 game.js
 */

class TerrainSystem {
  constructor(gl) {
    this.gl = gl;

    /** @type {WebGLProgram|null} 缓存当前 shader program 引用 */
    this._program = null;

    /** @type {Array<{x,y,z,h,s,color:[number,number,number]}>} 树木数据 */
    this._trees = [];

    /** @type {{x,z,length,width,heading:number}} 跑道参数 */
    this.runway = null;

    /** @type {{positions:Float32Array, colors:Float32Array}} 跑道渲染数据 */
    this._runwayGeo = null;

    /** @type {{positions:Float32Array, colors:Float32Array}} 跑道标记线渲染数据 */
    this._runwayMarkingsGeo = null;

    /** 预分配的森林渲染缓冲区 */
    this._forestPosBuf = null;
    this._forestColBuf = null;
    this._forestPosArr = null;
    this._forestColArr = null;

    /** 视距（单位：世界坐标） */
    this.viewDistance = 1800;

    // 跑道区域范围缓存（用于排除树木放置）
    this._rwHalfL = 0;
    this._rwHalfW = 0;
  }

  /* ================================================================
   * 生成
   * ================================================================ */

  /**
   * 生成地形数据：森林 + 跑道
   */
  generate() {
    this._generateRunway();
    this._generateForest();
    this._buildRunwayGeometry();
    this._buildRunwayMarkings();
    console.log(
      '[地形] 生成完成 — 树木:', this._trees.length,
      '| 跑道:', this.runway.length + 'm x' , this.runway.width + 'm'
    );
  }

  /** 生成跑道参数 */
  _generateRunway() {
    this.runway = {
      x: 0,
      z: 0,
      length: 2000,
      width: 60,
      heading: 0,
    };
    this._rwHalfL = this.runway.length / 2;
    this._rwHalfW = this.runway.width / 2;
  }

  /** 程序化生成森林（排除跑道区域） */
  _generateForest() {
    this._trees = [];
    const rng = this._seededRandom(42);
    const areaHalf = 2000;
    const exclusionBuffer = 100;
    const treeCount = 1800;

    for (let i = 0; i < treeCount; i++) {
      const x = (rng() * 2 - 1) * areaHalf;
      const z = (rng() * 2 - 1) * areaHalf;

      // 跳过跑道及其缓冲区
      if (
        Math.abs(x) < this._rwHalfL + exclusionBuffer &&
        Math.abs(z) < this._rwHalfW + exclusionBuffer
      ) {
        continue;
      }

      const height = 6 + rng() * 14;
      const spread = 0.4 + rng() * 0.8;
      // 绿色色调变化
      const g = 0.25 + rng() * 0.45;
      const color = [0.05 + rng() * 0.1, g, 0.02 + rng() * 0.06];

      this._trees.push({ x, z, h: height, s: spread, color });
    }
  }

  /* ================================================================
   * 构建渲染数据（仅生成一次）
   * ================================================================ */

  /** 构建跑道平面 + 四周边缘线的顶点/颜色数据 */
  _buildRunwayGeometry() {
    const hw = this._rwHalfW;
    const hl = this._rwHalfL;

    // 跑道灰色：TRIANGLES（两个三角形组成矩形平面）
    // 四角：(-hl,0,-hw) (-hl,0,hw) (hl,0,hw) (hl,0,-hw)
    const positions = new Float32Array([
      -hl, 0, -hw,  -hl, 0, hw,  hl, 0, hw,
      -hl, 0, -hw,  hl, 0, hw,   hl, 0, -hw,
    ]);
    const gray = [0.35, 0.35, 0.38];
    const colors = new Float32Array([
      ...gray, ...gray, ...gray,
      ...gray, ...gray, ...gray,
    ]);

    this._runwayGeo = { positions, colors };
  }

  /** 构建跑道全部白色标记线（虚线、边缘线、阈值线、接地区标记） */
  _buildRunwayMarkings() {
    const hw = this._rwHalfW;
    const hl = this._rwHalfL;
    const positions = [];
    const white = [1, 1, 1];
    const colors = [];

    const pushLine = (x1, z1, x2, z2) => {
      positions.push(x1, 0.02, z1, x2, 0.02, z2);
      colors.push(...white, ...white);
    };

    // ---- 中央虚线 (沿 Z 轴) ----
    const dashLen = 20;
    const dashGap = 10;
    for (let z = -hl; z < hl - dashLen; z += dashLen + dashGap) {
      const end = Math.min(z + dashLen, hl);
      pushLine(0, z, 0, end);
    }

    // ---- 两侧边缘实线 (沿 Z 轴) ----
    pushLine(-hw, -hl, -hw, hl);
    pushLine(hw, -hl, hw, hl);

    // ---- 两端阈值标记（zebra 条纹，垂直于跑道） ----
    const thresholdLen = 24;
    const stripeW = 2.4;
    const stripeGap = 1.6;
    const stripeStart = hw * 0.2;

    for (const endZ of [-hl, hl]) {
      const dir = endZ < 0 ? -1 : 1;
      for (let d = stripeStart; d < thresholdLen; d += stripeW + stripeGap) {
        const z0 = endZ + dir * d;
        const z1 = z0 + dir * stripeW;
        pushLine(-hw * 0.85, z0, -hw * 0.85, z1);
        pushLine(hw * 0.85, z0, hw * 0.85, z1);
        pushLine(0, z0, 0, z1);
      }
    }

    // ---- 接地区标记（ touchdown zone ） ----
    const tdLen = 12;
    const tdW = 3;
    const tdOffset = 40;
    for (const endZ of [-hl, hl]) {
      const dir = endZ < 0 ? -1 : 1;
      // 每侧三条横线
      for (let i = 0; i < 3; i++) {
        const zBase = endZ + dir * (tdOffset + i * (tdLen + 6));
        const zEnd = zBase + dir * tdLen;
        pushLine(-hw * 0.5 - tdW / 2, zBase, -hw * 0.5 - tdW / 2, zEnd);
        pushLine(-hw * 0.5 + tdW / 2, zBase, -hw * 0.5 + tdW / 2, zEnd);
        pushLine(hw * 0.5 - tdW / 2, zBase, hw * 0.5 - tdW / 2, zEnd);
        pushLine(hw * 0.5 + tdW / 2, zBase, hw * 0.5 + tdW / 2, zEnd);
      }
    }

    this._runwayMarkingsGeo = {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }

  /* ================================================================
   * 渲染
   * ================================================================ */

  /**
   * 渲染地形（含视距裁剪）
   * @param {WebGLRenderingContext} gl
   * @param {{x:number,y:number,z:number,yaw:number,pitch:number,roll:number}} camera
   */
  render(gl, camera) {
    // 如果还没缓存 program，尝试从当前绑定的 program 获取
    if (!this._program) {
      this._program = gl.getParameter(gl.CURRENT_PROGRAM);
    }
    if (!this._program) return;

    const aPos = gl.getAttribLocation(this._program, 'aPosition');
    const aCol = gl.getAttribLocation(this._program, 'aColor');
    if (aPos < 0 || aCol < 0) return;

    const camX = camera.x * 0.01;
    const camZ = camera.z * 0.01;
    const vd = this.viewDistance * 0.01;

    // ---- 森林 ----
    this._renderForest(gl, aPos, aCol, camX, camZ, vd);

    // ---- 跑道 + 标记线 ----
    this._renderRunway(gl, aPos, aCol);
  }

  /**
   * 批量渲染视距内的树木（LINES 模式）
   * 使用预分配缓冲区避免每帧 GC
   */
  _renderForest(gl, aPos, aCol, camX, camZ, vd) {
    const vDist2 = vd * vd;
    const maxTrees = this._trees.length;
    // 每棵树 8 个顶点（树干 2 + 树冠 6），每顶点 3 个分量
    const maxVerts = maxTrees * 8;

    // 懒分配缓冲区和 Array
    if (!this._forestPosArr) {
      this._forestPosArr = new Float32Array(maxVerts * 3);
      this._forestColArr = new Float32Array(maxVerts * 3);
      this._forestPosBuf = gl.createBuffer();
      this._forestColBuf = gl.createBuffer();
    }

    const posArr = this._forestPosArr;
    const colArr = this._forestColArr;
    let vi = 0; // 顶点索引

    for (let i = 0; i < maxTrees; i++) {
      const t = this._trees[i];
      const tx = t.x * 0.01;
      const tz = t.z * 0.01;

      // 距离裁剪
      const dx = tx - camX;
      const dz = tz - camZ;
      if (dx * dx + dz * dz > vDist2) continue;

      const top = t.h * 0.01;
      const s = t.s * 0.01;
      const r = t.color[0], g = t.color[1], b = t.color[2];

      // 树干（2 个顶点）
      posArr[vi]     = tx; posArr[vi + 1] = 0;  posArr[vi + 2] = tz;
      posArr[vi + 3] = tx; posArr[vi + 4] = top; posArr[vi + 5] = tz;
      colArr[vi]     = 0.25; colArr[vi + 1] = 0.15; colArr[vi + 2] = 0.05;
      colArr[vi + 3] = r;    colArr[vi + 4] = g;    colArr[vi + 5] = b;
      vi += 6;

      // 树冠（6 个顶点，3 条交叉线）
      // 水平 X 线
      posArr[vi] = tx - s; posArr[vi + 1] = top; posArr[vi + 2] = tz;
      posArr[vi + 3] = tx + s; posArr[vi + 4] = top; posArr[vi + 5] = tz;
      colArr[vi] = r; colArr[vi + 1] = g; colArr[vi + 2] = b;
      colArr[vi + 3] = r; colArr[vi + 4] = g; colArr[vi + 5] = b;
      vi += 6;
      // 水平 Z 线
      posArr[vi] = tx; posArr[vi + 1] = top; posArr[vi + 2] = tz - s;
      posArr[vi + 3] = tx; posArr[vi + 4] = top; posArr[vi + 5] = tz + s;
      colArr[vi] = r; colArr[vi + 1] = g; colArr[vi + 2] = b;
      colArr[vi + 3] = r; colArr[vi + 4] = g; colArr[vi + 5] = b;
      vi += 6;
      // 斜线
      posArr[vi] = tx; posArr[vi + 1] = top - s * 0.6; posArr[vi + 2] = tz - s;
      posArr[vi + 3] = tx; posArr[vi + 4] = top + s * 0.6; posArr[vi + 5] = tz + s;
      colArr[vi] = r; colArr[vi + 1] = g; colArr[vi + 2] = b;
      colArr[vi + 3] = r; colArr[vi + 4] = g; colArr[vi + 5] = b;
      vi += 6;
    }

    if (vi === 0) return;

    const vertCount = vi / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._forestPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posArr.subarray(0, vi), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._forestColBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colArr.subarray(0, vi), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, vertCount);

    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
  }

  /**
   * 渲染跑道平面（TRIANGLES）和标记线（LINES）
   */
  _renderRunway(gl, aPos, aCol) {
    if (!this._runwayGeo) return;

    // 跑道灰色平面（TRIANGLES）
    this._bindAndDraw(gl, aPos, aCol, this._runwayGeo, gl.TRIANGLES);

    // 白色标记线（LINES）
    if (this._runwayMarkingsGeo) {
      this._bindAndDraw(gl, aPos, aCol, this._runwayMarkingsGeo, gl.LINES);
    }
  }

  /**
   * 通用顶点绑定 + 绘制 + 清理
   */
  _bindAndDraw(gl, aPos, aCol, geo, mode) {
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, geo.positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const colBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, geo.colors, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(mode, 0, geo.positions.length / 3);

    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
    gl.deleteBuffer(posBuf);
    gl.deleteBuffer(colBuf);
  }

  /* ================================================================
   * 查询接口
   * ================================================================ */

  /**
   * 返回跑道位置与尺寸
   * @returns {{x:number,z:number,length:number,width:number,heading:number}|null}
   */
  getRunwayPosition() {
    return this.runway;
  }

  /**
   * 碰撞检测：判断世界坐标是否在跑道范围内
   * @param {{x:number,z:number}} position
   * @returns {boolean}
   */
  checkCollision(position) {
    if (!this.runway) return false;
    return (
      Math.abs(position.x) <= this._rwHalfL &&
      Math.abs(position.z) <= this._rwHalfW
    );
  }

  /* ================================================================
   * 工具
   * ================================================================ */

  /** 确定性伪随机数生成器（Mulberry32） */
  _seededRandom(seed) {
    let s = seed | 0;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}

/* ================================================================
 * 自动集成：hook 到 GameEngine，无需修改 game.js
 * ================================================================ */

(function () {
  /**
   * 注入地形系统到引擎
   * @param {GameEngine} engine
   */
  function _injectTerrain(engine) {
    if (engine._terrainSystem) return;

    const gl = engine.renderer.getContext();
    if (!gl) return;

    const terrain = new TerrainSystem(gl);
    terrain.generate();
    engine._terrainSystem = terrain;

    // 保存原始渲染方法
    const origRender = engine.renderGameplay.bind(engine);

    /**
     * 替换渲染方法：先画地形，再画原有内容
     */
    engine.renderGameplay = function () {
      origRender();

      if (!this._aircraftState) return;

      const st = this._aircraftState;
      const r = this.renderer;
      const glCtx = r.getContext();

      // 构造相机对象
      const cam = {
        x: st.position.x,
        y: st.position.y,
        z: st.position.z,
        yaw: st.rotation.yaw,
        pitch: st.rotation.pitch,
        roll: st.rotation.roll,
      };

      this._terrainSystem.render(glCtx, cam);
    };

    console.log('[地形] TerrainSystem 已集成到引擎');
  }

  /**
   * 等待引擎就绪后注入
   * 延迟一帧确保 game.js 的 GameEngine 类和实例都已就位
   */
  function _waitForEngine() {
    const engine = window._engine;
    if (engine && engine.renderer && engine.renderer.getContext()) {
      _injectTerrain(engine);
    } else {
      requestAnimationFrame(_waitForEngine);
    }
  }

  // DOMContentLoaded 时开始等待引擎
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(_waitForEngine);
    });
  } else {
    requestAnimationFrame(_waitForEngine);
  }
})();
