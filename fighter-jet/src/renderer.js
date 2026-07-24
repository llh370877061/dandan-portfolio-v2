/**
 * WebGL 渲染器
 * 负责：WebGL 上下文初始化、着色器编译、渲染管线创建、场景渲染
 */

class WebGLRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    /** @type {WebGLRenderingContext} */
    this.gl = null;
    this._program = null;
    this._attributes = {};
    this._uniforms = {};
    this._buffers = {};
    this._initialized = false;
  }

  /**
   * 初始化 WebGL 上下文、视口、渲染管线
   * @returns {boolean} 是否成功
   */
  init() {
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      console.error('WebGLRenderer: WebGL 上下文创建失败');
      return false;
    }

    const gl = this.gl;

    // 基本状态设置
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // 清除颜色：蓝色天空
    gl.clearColor(0.53, 0.81, 0.92, 1.0);

    // 设置视口
    this.resize();

    // 编译着色器并创建渲染管线
    if (!this._createPipeline()) {
      console.error('WebGLRenderer: 渲染管线创建失败');
      return false;
    }

    this._initialized = true;
    console.log('WebGLRenderer: 初始化完成');
    return true;
  }

  /**
   * 调整视口以匹配 canvas 尺寸
   */
  resize() {
    if (!this.gl) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 每帧开始时清除缓冲区
   */
  clear() {
    if (!this.gl) return;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  /**
   * 获取 WebGL 上下文
   * @returns {WebGLRenderingContext}
   */
  getContext() {
    return this.gl;
  }

  /**
   * 获取 canvas 宽度
   * @returns {number}
   */
  getWidth() {
    return this.canvas.width;
  }

  /**
   * 获取 canvas 高度
   * @returns {number}
   */
  getHeight() {
    return this.canvas.height;
  }

  /**
   * 获取宽高比
   * @returns {number}
   */
  getAspect() {
    return this.canvas.width / this.canvas.height;
  }

  /**
   * 使用当前渲染管线
   */
  useProgram() {
    if (this._program && this.gl) {
      this.gl.useProgram(this._program);
    }
  }

  /**
   * 获取 uniform 位置
   * @param {string} name
   * @returns {WebGLUniformLocation|null}
   */
  getUniform(name) {
    return this._uniforms[name] || null;
  }

  /**
   * 获取 attribute 位置
   * @param {string} name
   * @returns {number}
   */
  getAttribute(name) {
    return this._attributes[name] !== undefined ? this._attributes[name] : -1;
  }

  /**
   * 创建一个顶点缓冲区并上传数据
   * @param {string} name - 缓冲区名称
   * @param {Float32Array} data - 顶点数据
   * @param {number} [itemSize=3] - 每个顶点的分量数
   * @returns {WebGLBuffer|null}
   */
  createBuffer(name, data, itemSize = 3) {
    const gl = this.gl;
    if (!gl) return null;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this._buffers[name] = { buffer, itemSize, count: data.length / itemSize };
    return buffer;
  }

  /**
   * 绑定缓冲区并设置顶点属性指针
   * @param {string} name - 缓冲区名称
   * @param {string} [attrName] - attribute 名称，默认与缓冲区同名
   */
  bindBuffer(name, attrName) {
    const gl = this.gl;
    const buf = this._buffers[name];
    if (!gl || !buf) return;

    const attrLoc = this._attributes[attrName || name];
    if (attrLoc === undefined) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.buffer);
    gl.enableVertexAttribArray(attrLoc);
    gl.vertexAttribPointer(attrLoc, buf.itemSize, gl.FLOAT, false, 0, 0);
  }

  /**
   * 绘制绑定的缓冲区
   * @param {string} name - 缓冲区名称
   * @param {number} [mode] - 绘制模式，默认 TRIANGLES
   */
  drawBuffer(name, mode) {
    const gl = this.gl;
    const buf = this._buffers[name];
    if (!gl || !buf) return;

    gl.drawArrays(mode || gl.TRIANGLES, 0, buf.count);
  }

  /**
   * 销毁渲染器
   */
  destroy() {
    const gl = this.gl;
    if (!gl) return;

    for (const key in this._buffers) {
      gl.deleteBuffer(this._buffers[key].buffer);
    }
    if (this._program) {
      gl.deleteProgram(this._program);
    }
    this._buffers = {};
    this._program = null;
    this._initialized = false;
  }

  // ---- 内部方法 ----

  /**
   * 创建渲染管线：编译着色器、链接程序、获取属性/uniform 位置
   * @returns {boolean}
   */
  _createPipeline() {
    const gl = this.gl;

    // 顶点着色器
    const vsSource = `
      attribute vec4 aPosition;
      attribute vec4 aColor;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying lowp vec4 vColor;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        vColor = aColor;
      }
    `;

    // 片段着色器
    const fsSource = `
      precision mediump float;

      varying lowp vec4 vColor;

      void main() {
        gl_FragColor = vColor;
      }
    `;

    const vs = this._compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return false;

    // 创建程序
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('着色器程序链接失败:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return false;
    }

    // 着色器已链接到程序，可以释放
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    this._program = program;

    // 获取 attribute 位置
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
      const info = gl.getActiveAttrib(program, i);
      this._attributes[info.name] = gl.getAttribLocation(program, info.name);
    }

    // 预设常用 attribute
    if (this._attributes['aPosition'] === undefined) {
      this._attributes['aPosition'] = gl.getAttribLocation(program, 'aPosition');
    }
    if (this._attributes['aColor'] === undefined) {
      this._attributes['aColor'] = gl.getAttribLocation(program, 'aColor');
    }

    // 获取 uniform 位置
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(program, i);
      this._uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    return true;
  }

  /**
   * 编译单个着色器
   * @param {number} type - gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER
   * @param {string} source - GLSL 源码
   * @returns {WebGLShader|null}
   */
  _compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const typeName = type === gl.VERTEX_SHADER ? '顶点' : '片段';
      console.error(`${typeName}着色器编译失败:`, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}

// 暴露到全局作用域
window.WebGLRenderer = WebGLRenderer;
