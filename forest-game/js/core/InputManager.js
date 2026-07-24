import { CONFIG } from '../config.js';

export class InputManager {
  constructor() {
    this.keys = {};
    this.mouseButtons = {};
    this.mouseDelta = { x: 0, y: 0 };
    this.isPointerLocked = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onPointerLockChange = this.onPointerLockChange.bind(this);

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
  }

  onKeyDown(e) {
    this.keys[e.code] = true;
    // Tab 默认行为是切换焦点，阻止它
    if (e.code === 'Tab') e.preventDefault();
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  onMouseMove(e) {
    if (this.isPointerLocked) {
      this.mouseDelta.x += e.movementX;
      this.mouseDelta.y += e.movementY;
    }
  }

  onMouseDown(e) {
    this.mouseButtons[e.button] = true;
  }

  onMouseUp(e) {
    this.mouseButtons[e.button] = false;
  }

  onPointerLockChange() {
    this.isPointerLocked = document.pointerLockElement !== null;
  }

  requestPointerLock(element) {
    element.requestPointerLock();
  }

  getMouseDelta() {
    const delta = { ...this.mouseDelta };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return delta;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  isMouseDown(button) {
    return !!this.mouseButtons[button];
  }

  isSprinting() {
    return this.isKeyDown(CONFIG.KEYS.SPRINT);
  }
}
