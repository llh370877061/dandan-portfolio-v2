/**
 * 输入处理系统
 * 负责：键盘事件监听、按键状态管理、提供 isKeyDown(key) 接口
 * 控制映射：
 *   W/S - 俯仰 (pitch up/down)
 *   A/D - 滚转 (roll left/right)
 *   ↑/↓ - 偏航 (yaw left/right)
 */

class InputSystem {
  constructor() {
    /** @type {Set<string>} 当前按下的键集合（小写） */
    this._keys = new Set();
    /** @type {Map<string, number>} 按键按下的时间戳 */
    this._keyDownTime = new Map();
    /** @type {Function[]} 按键回调列表 */
    this._callbacks = [];

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  /**
   * 初始化：注册全局键盘事件监听
   */
  init() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
    console.log('输入系统初始化完成');
  }

  /**
   * 清理：移除事件监听
   */
  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    this._keys.clear();
    this._keyDownTime.clear();
  }

  /**
   * 查询某个键是否处于按下状态
   * @param {string} key - 键名（不区分大小写），如 'w', 'a', 'ArrowUp', ' '
   * @returns {boolean}
   */
  isKeyDown(key) {
    return this._keys.has(key.toLowerCase()) || this._keys.has(key);
  }

  /**
   * 获取按键按下的持续时长（秒）
   * @param {string} key
   * @returns {number} 按下时长（秒），未按下返回 0
   */
  getKeyDuration(key) {
    const normalKey = key.toLowerCase();
    const downTime = this._keyDownTime.get(normalKey) || this._keyDownTime.get(key);
    if (!downTime) return 0;
    return (performance.now() - downTime) / 1000;
  }

  /**
   * 注册按键回调（单次触发）
   * @param {string} key - 要监听的键名
   * @param {Function} callback - 回调函数
   */
  onKeyDown(key, callback) {
    this._callbacks.push({ key: key.toLowerCase(), callback, once: true });
  }

  /**
   * 获取当前飞行控制输入状态
   * @returns {{ pitch: number, roll: number, yaw: number }}
   *  每个值范围 -1 到 1
   */
  getFlightInput() {
    let pitch = 0;
    let roll = 0;
    let yaw = 0;

    // W/S 控制俯仰 (正=机头上仰, 负=机头下俯)
    if (this.isKeyDown('w') || this.isKeyDown('W')) pitch += 1;
    if (this.isKeyDown('s') || this.isKeyDown('S')) pitch -= 1;

    // A/D 控制滚转 (正=左滚, 负=右滚)
    if (this.isKeyDown('a') || this.isKeyDown('A')) roll += 1;
    if (this.isKeyDown('d') || this.isKeyDown('D')) roll -= 1;

    // 方向键控制偏航 (正=左偏, 负=右偏)
    if (this.isKeyDown('ArrowLeft')) yaw += 1;
    if (this.isKeyDown('ArrowRight')) yaw -= 1;

    return { pitch, roll, yaw };
  }

  /**
   * 获取所有当前按下的键名列表
   * @returns {string[]}
   */
  getPressedKeys() {
    return Array.from(this._keys);
  }

  // ---- 内部方法 ----

  _onKeyDown(e) {
    const key = e.key;

    // 阻止方向键和空格的默认滚动行为
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
      e.preventDefault();
    }

    if (!this._keys.has(key)) {
      this._keyDownTime.set(key, performance.now());
    }
    this._keys.add(key);

    // 触发回调
    for (let i = this._callbacks.length - 1; i >= 0; i--) {
      const cb = this._callbacks[i];
      if (cb.key === key.toLowerCase() || cb.key === key) {
        cb.callback(key);
        if (cb.once) {
          this._callbacks.splice(i, 1);
        }
      }
    }
  }

  _onKeyUp(e) {
    const key = e.key;
    this._keys.delete(key);
    this._keyDownTime.delete(key);
  }

  _onBlur() {
    // 窗口失焦时清除所有按键状态，防止按键卡住
    this._keys.clear();
    this._keyDownTime.clear();
  }
}

// 暴露到全局作用域
window.InputSystem = InputSystem;
