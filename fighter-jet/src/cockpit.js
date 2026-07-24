/**
 * 驾驶舱系统
 * 负责：第一人称视角、仪表盘框架、准星、HUD 信息叠加
 *
 * 渲染策略：切换到正交投影绘制2D覆盖层，完成后恢复3D投影
 */

class CockpitSystem {
  constructor() {
    this.fov = 75;
    this.near = 0.1;
    this.far = 10000;

    /** 驾驶舱框架颜色：深灰金属 */
    this._frameColor = [0.12, 0.12, 0.14, 1.0];
    /** HUD 绿色 */
    this._hudColor = [0.0, 0.85, 0.3, 0.9];
    /** HUD 绿色（暗） */
    this._hudDimColor = [0.0, 0.45, 0.18, 0.7];
    /** 警告色 */
    this._warnColor = [0.9, 0.2, 0.1, 0.9];
    /** 准星颜色 */
    this._crosshairColor = [0.0, 0.9, 0.35, 0.95];
  }

  /**
   * 设置第一人称相机（设置投影矩阵为透视）
   * @param {WebGLRenderingContext} gl
   * @param {WebGLRenderer} renderer
   */
  setupCamera(gl, renderer) {
    const proj = this._makePerspective(
      this.fov * Math.PI / 180,
      renderer.getAspect(),
      this.near,
      this.far
    );
    const uProj = renderer.getUniform('uProjectionMatrix');
    if (uProj) {
      gl.uniformMatrix4fv(uProj, false, proj);
    }
  }

  /**
   * 渲染驾驶舱框架（2D 覆盖层）
   * @param {WebGLRenderingContext} gl
   * @param {WebGLRenderer} renderer
   */
  renderFrame(gl, renderer) {
    const w = renderer.getWidth();
    const h = renderer.getHeight();

    // 保存当前3D状态
    const uProj = renderer.getUniform('uProjectionMatrix');
    const uMV = renderer.getUniform('uModelViewMatrix');
    const origProj = uProj ? gl.getUniform(renderer._program, uProj) : null;
    const origMV = uMV ? gl.getUniform(renderer._program, uMV) : null;

    // 切换到正交投影（2D）
    const ortho = this._makeOrtho(0, w, h, 0, -1, 1);
    if (uProj) gl.uniformMatrix4fv(uProj, false, ortho);

    const identity = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    if (uMV) gl.uniformMatrix4fv(uMV, false, identity);

    const aPos = renderer.getAttribute('aPosition');
    const aCol = renderer.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) {
      // 恢复并退出
      if (origProj && uProj) gl.uniformMatrix4fv(uProj, false, origProj);
      if (origMV && uMV) gl.uniformMatrix4fv(uMV, false, origMV);
      return;
    }

    // 禁用深度测试（2D覆盖层不需要）
    const depthWasEnabled = gl.isEnabled(gl.DEPTH_TEST);
    gl.disable(gl.DEPTH_TEST);

    const verts = [];
    const frameW = 6; // 边框宽度（像素）
    const [fr, fg, fb] = this._frameColor;

    // ---- 顶部框架 ----
    this._pushRect(verts, 0, 0, w, frameW, fr, fg, fb);
    // 顶部内边线（浅灰）
    this._pushRect(verts, 0, frameW, w, 1, 0.3, 0.3, 0.32);

    // ---- 底部框架（仪表盘区域） ----
    const dashH = h * 0.18; // 底部仪表盘高度
    this._pushRect(verts, 0, h - dashH, w, dashH, fr, fg, fb);
    // 底部框架顶边线
    this._pushRect(verts, 0, h - dashH, w, 2, 0.35, 0.35, 0.38);
    // 仪表盘内部面板
    this._pushRect(verts, frameW + 4, h - dashH + 6, w - 2 * (frameW + 4), dashH - 14, 0.06, 0.07, 0.09);

    // ---- 左侧框架 ----
    this._pushRect(verts, 0, 0, frameW, h - dashH, fr, fg, fb);
    this._pushRect(verts, frameW, 0, 1, h - dashH, 0.3, 0.3, 0.32);

    // ---- 右侧框架 ----
    this._pushRect(verts, w - frameW, 0, frameW, h - dashH, fr, fg, fb);
    this._pushRect(verts, w - frameW - 1, 0, 1, h - dashH, 0.3, 0.3, 0.32);

    // ---- 座舱盖支撑柱（前框中央垂直条） ----
    this._pushRect(verts, w / 2 - 2, 0, 4, frameW + 8, 0.18, 0.18, 0.2);

    // ---- 仪表盘 HUD 元素 ----
    // 速度条（左侧）
    const barX = frameW + 20;
    const barY = h - dashH + 12;
    const barW = 60;
    const barH = dashH - 24;
    this._pushRect(verts, barX, barY, barW, barH, 0.04, 0.05, 0.07);
    // 速度刻度线
    for (let i = 0; i < 8; i++) {
      const y = barY + (barH / 8) * i + 4;
      this._pushRect(verts, barX + 2, y, barW - 4, 1, ...this._hudDimColor.slice(0, 3));
    }
    // 速度标签框
    this._pushRect(verts, barX - 2, barY - 2, barW + 4, 14, 0.0, 0.3, 0.12);
    this._pushRect(verts, barX + 4, barY + 1, barW - 8, 8, 0.0, 0.15, 0.06);

    // 高度条（右侧）
    const altBarX = w - frameW - 20 - barW;
    this._pushRect(verts, altBarX, barY, barW, barH, 0.04, 0.05, 0.07);
    for (let i = 0; i < 8; i++) {
      const y = barY + (barH / 8) * i + 4;
      this._pushRect(verts, altBarX + 2, y, barW - 4, 1, ...this._hudDimColor.slice(0, 3));
    }
    this._pushRect(verts, altBarX - 2, barY - 2, barW + 4, 14, 0.0, 0.3, 0.12);
    this._pushRect(verts, altBarX + 4, barY + 1, barW - 8, 8, 0.0, 0.15, 0.06);

    // 中间仪表区域
    const midX = w / 2 - 80;
    const midY = h - dashH + 10;
    // 指示器边框
    this._pushRect(verts, midX, midY, 160, dashH - 20, 0.04, 0.05, 0.07);
    // 水平线
    this._pushRect(verts, midX + 4, midY + (dashH - 20) / 2, 152, 1, ...this._hudDimColor.slice(0, 3));
    // 垂直线
    this._pushRect(verts, midX + 78, midY + 4, 1, dashH - 28, ...this._hudDimColor.slice(0, 3));
    // 框线
    this._pushRect(verts, midX, midY, 160, 2, ...this._hudColor.slice(0, 3));
    this._pushRect(verts, midX, midY + dashH - 22, 160, 2, ...this._hudColor.slice(0, 3));
    this._pushRect(verts, midX, midY, 2, dashH - 20, ...this._hudColor.slice(0, 3));
    this._pushRect(verts, midX + 158, midY, 2, dashH - 20, ...this._hudColor.slice(0, 3));

    // 上传顶点数据并绘制
    this._drawOverlay(gl, renderer, aPos, aCol, verts);

    // 恢复深度测试
    if (depthWasEnabled) gl.enable(gl.DEPTH_TEST);

    // 恢复3D投影
    if (origProj && uProj) gl.uniformMatrix4fv(uProj, false, origProj);
    if (origMV && uMV) gl.uniformMatrix4fv(uMV, false, origMV);
  }

  /**
   * 渲染准星（中心十字 + 圆环近似）
   * @param {WebGLRenderingContext} gl
   * @param {WebGLRenderer} renderer
   */
  renderCrosshair(gl, renderer) {
    const w = renderer.getWidth();
    const h = renderer.getHeight();
    const cx = w / 2;
    const cy = h / 2;

    const uProj = renderer.getUniform('uProjectionMatrix');
    const uMV = renderer.getUniform('uModelViewMatrix');
    const origProj = uProj ? gl.getUniform(renderer._program, uProj) : null;
    const origMV = uMV ? gl.getUniform(renderer._program, uMV) : null;

    const ortho = this._makeOrtho(0, w, h, 0, -1, 1);
    if (uProj) gl.uniformMatrix4fv(uProj, false, ortho);
    const identity = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    if (uMV) gl.uniformMatrix4fv(uMV, false, identity);

    const aPos = renderer.getAttribute('aPosition');
    const aCol = renderer.getAttribute('aColor');
    if (aPos < 0 || aCol < 0) {
      if (origProj && uProj) gl.uniformMatrix4fv(uProj, false, origProj);
      if (origMV && uMV) gl.uniformMatrix4fv(uMV, false, origMV);
      return;
    }

    const depthWasEnabled = gl.isEnabled(gl.DEPTH_TEST);
    gl.disable(gl.DEPTH_TEST);

    const [cr, cg, cb] = this._crosshairColor;
    const verts = [];
    const crossLen = 20;  // 十字臂长
    const crossW = 1.5;   // 十字臂宽
    const gap = 6;        // 中心空隙半径
    const ringR = 24;     // 圆环半径
    const ringW = 1.2;    // 圆环线宽

    // ---- 中心十字 ----
    // 上臂
    this._pushRect(verts, cx - crossW / 2, cy - gap - crossLen, crossW, crossLen, cr, cg, cb);
    // 下臂
    this._pushRect(verts, cx - crossW / 2, cy + gap, crossW, crossLen, cr, cg, cb);
    // 左臂
    this._pushRect(verts, cx - gap - crossLen, cy - crossW / 2, crossLen, crossW, cr, cg, cb);
    // 右臂
    this._pushRect(verts, cx + gap, cy - crossW / 2, crossLen, crossW, cr, cg, cb);

    // ---- 小圆点（中心） ----
    this._pushRect(verts, cx - 1.5, cy - 1.5, 3, 3, cr, cg, cb);

    // ---- 圆环（用4段弧近似为矩形） ----
    // 上
    this._pushRect(verts, cx - ringR, cy - ringR - ringW / 2, ringR * 2, ringW, cr, cg, cb);
    // 下
    this._pushRect(verts, cx - ringR, cy + ringR - ringW / 2, ringR * 2, ringW, cr, cg, cb);
    // 左
    this._pushRect(verts, cx - ringR - ringW / 2, cy - ringR, ringW, ringR * 2, cr, cg, cb);
    // 右
    this._pushRect(verts, cx + ringR - ringW / 2, cy - ringR, ringW, ringR * 2, cr, cg, cb);

    // ---- 航向指示（顶部小三角） ----
    const triW = 8;
    const triH = 10;
    const triY = 30; // 距顶部
    this._pushTri(verts,
      cx, triY,
      cx - triW / 2, triY + triH,
      cx + triW / 2, triY + triH,
      cr, cg, cb);

    // ---- 俯仰线（十字两侧的水平短线） ----
    const pitchLines = [-40, -20, 20, 40]; // 距中心偏移
    for (const offset of pitchLines) {
      const ly = cy + offset;
      this._pushRect(verts, cx - 35, ly - 0.5, 20, 1, this._hudDimColor[0], this._hudDimColor[1], this._hudDimColor[2]);
      this._pushRect(verts, cx + 15, ly - 0.5, 20, 1, this._hudDimColor[0], this._hudDimColor[1], this._hudDimColor[2]);
    }

    // 上传并绘制
    this._drawOverlay(gl, renderer, aPos, aCol, verts);

    if (depthWasEnabled) gl.enable(gl.DEPTH_TEST);

    if (origProj && uProj) gl.uniformMatrix4fv(uProj, false, origProj);
    if (origMV && uMV) gl.uniformMatrix4fv(uMV, false, origMV);
  }

  /**
   * 根据飞机姿态更新视角
   * @param {{ pitch: number, yaw: number, roll: number }} rotation
   */
  updateView(rotation) {
    // 姿态信息可用于动态调整 HUD 元素
    // 当前版本 HUD 为静态覆盖层，此方法为扩展预留
    this._rotation = rotation;
  }

  // ---- 内部工具方法 ----

  /**
   * 向顶点数组追加一个矩形（2个三角形，xy平面，z=0）
   */
  _pushRect(arr, x, y, w, h, r, g, b) {
    // 三角形1: (x,y) (x+w,y) (x+w,y+h)
    arr.push(
      x, y, 0, 1, r, g, b, 1,
      x + w, y, 0, 1, r, g, b, 1,
      x + w, y + h, 0, 1, r, g, b, 1
    );
    // 三角形2: (x,y) (x+w,y+h) (x,y+h)
    arr.push(
      x, y, 0, 1, r, g, b, 1,
      x + w, y + h, 0, 1, r, g, b, 1,
      x, y + h, 0, 1, r, g, b, 1
    );
  }

  /**
   * 向顶点数组追加一个三角形（xy平面，z=0）
   */
  _pushTri(arr, x1, y1, x2, y2, x3, y3, r, g, b) {
    arr.push(
      x1, y1, 0, 1, r, g, b, 1,
      x2, y2, 0, 1, r, g, b, 1,
      x3, y3, 0, 1, r, g, b, 1
    );
  }

  /**
   * 上传顶点数据并绘制覆盖层
   */
  _drawOverlay(gl, renderer, aPos, aCol, verts) {
    if (verts.length === 0) return;

    const data = new Float32Array(verts);
    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    const stride = 8 * 4; // 8 floats * 4 bytes
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 4, gl.FLOAT, false, stride, 16);

    gl.drawArrays(gl.TRIANGLES, 0, data.length / 8);

    gl.disableVertexAttribArray(aPos);
    gl.disableVertexAttribArray(aCol);
    gl.deleteBuffer(vBuf);
  }

  /**
   * 创建正交投影矩阵
   */
  _makeOrtho(l, r, b, t, n, f) {
    const lr = 1 / (l - r);
    const bt = 1 / (b - t);
    const nf = 1 / (n - f);
    return new Float32Array([
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (l + r) * lr, (t + b) * bt, (n + f) * nf, 1
    ]);
  }

  /**
   * 创建透视投影矩阵
   */
  _makePerspective(fovY, aspect, near, far) {
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }
}

// 暴露到全局作用域
window.CockpitSystem = CockpitSystem;
