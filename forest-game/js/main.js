import { Renderer } from './core/Renderer.js';
import { InputManager } from './core/InputManager.js';
import { CameraController } from './core/CameraController.js';
import { Physics } from './core/Physics.js';
import { EventBus } from './core/EventBus.js';
import { CONFIG } from './config.js';
import { WorldGenerator } from './world/WorldGenerator.js';
import { ForestGenerator } from './world/ForestGenerator.js';
import { FogSystem } from './world/FogSystem.js';
import { LightingSystem } from './world/LightingSystem.js';
import { SkyBox } from './world/SkyBox.js';
import { TreeHouse } from './world/TreeHouse.js';
import { Campsite } from './world/Campsite.js';
import { InventorySystem } from './systems/InventorySystem.js';
import { InteractionSystem } from './systems/InteractionSystem.js';
import { SurvivalSystem } from './systems/SurvivalSystem.js';
import { TimeSystem } from './systems/TimeSystem.js';
import { SleepSystem } from './systems/SleepSystem.js';
import { CraftingSystem } from './systems/CraftingSystem.js';
import { InventoryUI } from './ui/InventoryUI.js';
import { InteractionPrompt } from './ui/InteractionPrompt.js';
import { HUD } from './ui/HUD.js';
import { DiarySystem } from './narrative/DiarySystem.js';
import { DiaryUI } from './ui/DiaryUI.js';
import { StoryManager } from './narrative/StoryManager.js';
import { SecretManager } from './narrative/SecretManager.js';
import { NarrativePopup } from './narrative/NarrativePopup.js';
import { Animal } from './entities/Animal.js';
import { Player } from './entities/Player.js';

class Game {
  constructor() {
    this.container = document.getElementById('game-container');
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.animals = [];

    this.init();
  }

  init() {
    // 核心
    this.renderer = new Renderer(this.container);
    this.input = new InputManager();
    this.physics = new Physics();
    this.cameraCtrl = new CameraController(this.renderer.camera, this.input);

    // 世界
    this.worldGen = new WorldGenerator(this.renderer.scene);
    this.forest = new ForestGenerator(this.renderer.scene, this.worldGen, this.physics);
    this.fogSystem = new FogSystem(this.renderer.scene);
    this.lighting = new LightingSystem(this.renderer.scene);
    this.skyBox = new SkyBox(this.renderer.scene);
    this.treeHouse = new TreeHouse(this.renderer.scene, this.worldGen, this.physics);
    this.campsite = new Campsite(this.renderer.scene, this.worldGen, this.physics);

    // 系统
    this.inventory = new InventorySystem();
    this.interaction = new InteractionSystem(
      this.renderer.camera,
      this.renderer.scene,
      this.inventory,
      this.cameraCtrl,
      this.forest,
      this.treeHouse,
      this.campsite
    );
    this.survival = new SurvivalSystem();
    this.timeSystem = new TimeSystem();
    this.sleepSystem = new SleepSystem(this.timeSystem, this.survival);
    this.crafting = new CraftingSystem(this.inventory);

    // 玩家
    this.player = new Player(this.cameraCtrl, this.inventory);

    // 叙事
    this.diary = new DiarySystem();
    this.storyManager = new StoryManager();
    this.secretManager = new SecretManager();
    this.narrativePopup = new NarrativePopup();

    // UI
    this.inventoryUI = new InventoryUI(this.inventory);
    this.interactionPrompt = new InteractionPrompt();
    this.hud = new HUD(this.survival, this.timeSystem, this.inventory, this.cameraCtrl);
    this.diaryUI = new DiaryUI(this.diary);

    this.interaction.diarySystem = this.diary;

    this.bindEvents();
    this.setupUI();
    this.spawnAnimals();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  spawnAnimals() {
    const types = ['deer', 'deer', 'deer', 'rabbit', 'rabbit', 'rabbit', 'rabbit', 'rabbit', 'wolf', 'wolf', 'wolf', 'rabbit', 'deer', 'rabbit', 'wolf'];
    for (let i = 0; i < CONFIG.ANIMAL_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 140;
      const pos = new THREE.Vector3(
        Math.cos(angle) * dist,
        0,
        Math.sin(angle) * dist
      );
      pos.y = this.worldGen.getHeightAt(pos.x, pos.z);
      this.animals.push(new Animal(this.renderer.scene, types[i], pos, this.worldGen));
    }
  }

  setupUI() {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const deathScreen = document.getElementById('death-screen');
    const restartBtn = document.getElementById('restart-btn');

    startBtn.addEventListener('click', () => {
      startScreen.style.display = 'none';
      document.getElementById('hud').style.display = 'block';
      this.isRunning = true;
      // 先请求指针锁定，锁定成功后再触发剧情
      this.renderer.requestPointerLock(this.container);
      // 延迟触发第一天剧情，让玩家先看到场景
      setTimeout(() => {
        this.storyManager.triggerDayEvent(1);
      }, 500);
    });

    // 点击游戏区域时请求指针锁
    this.container.addEventListener('click', () => {
      if (this.isRunning && !this.isPaused && !this.input.isPointerLocked) {
        this.renderer.requestPointerLock(this.container);
      }
    });

    restartBtn.addEventListener('click', () => {
      location.reload();
    });
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;

      // 任何键都可以关闭叙事弹窗
      if (this.narrativePopup.isOpen) {
        this.narrativePopup.close();
        this.isPaused = false;
        setTimeout(() => {
          this.renderer.requestPointerLock(this.container);
        }, 100);
        return;
      }

      // 1: 开枪（用手枪射击）
      if (e.code === CONFIG.KEYS.SHOOT) {
        if (this.inventoryUI.isOpen || this.diaryUI.isOpen || this.crafting.isOpen) return;
        this.interaction.shoot();
      }

      // 2: 拾取
      if (e.code === CONFIG.KEYS.PICKUP) {
        if (this.inventoryUI.isOpen || this.diaryUI.isOpen || this.crafting.isOpen) return;
        this.interaction.pickup();
      }

      // 3: 查看（打开日记）
      if (e.code === CONFIG.KEYS.VIEW) {
        if (this.inventoryUI.isOpen || this.crafting.isOpen) return;
        this.diaryUI.toggle();
        this.isPaused = this.diaryUI.isOpen;
        if (this.diaryUI.isOpen) {
          document.exitPointerLock();
        } else {
          this.renderer.requestPointerLock(this.container);
        }
      }

      // 4: 烹饪（打开烹饪面板）
      if (e.code === CONFIG.KEYS.CRAFT) {
        if (this.inventoryUI.isOpen || this.diaryUI.isOpen) return;
        if (this.crafting.isOpen) {
          this.crafting.toggle();
        } else {
          this.crafting.toggle();
        }
        this.isPaused = this.crafting.isOpen;
        if (this.crafting.isOpen) {
          document.exitPointerLock();
        } else {
          this.renderer.requestPointerLock(this.container);
        }
      }

      // 5: 所有互动（爬梯子、开箱子、睡觉、砍树等）
      if (e.code === CONFIG.KEYS.INTERACT) {
        if (this.inventoryUI.isOpen || this.diaryUI.isOpen || this.crafting.isOpen) return;
        this.interaction.interact();
      }

      // Tab: 背包
      if (e.code === CONFIG.KEYS.INVENTORY) {
        e.preventDefault();
        this.inventoryUI.toggle();
        this.isPaused = this.inventoryUI.isOpen;
        if (this.inventoryUI.isOpen) {
          document.exitPointerLock();
        } else {
          this.renderer.requestPointerLock(this.container);
        }
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!this.isRunning || this.isPaused) return;
      if (e.button === 0 && this.input.isPointerLocked) {
        this.interaction.attack();
      }
    });

    EventBus.on('interaction:targetChanged', (data) => {
      this.interactionPrompt.update(data.target);
    });

    EventBus.on('survival:death', (data) => {
      this.isRunning = false;
      document.getElementById('death-cause').textContent = data.cause;
      document.getElementById('death-screen').style.display = 'flex';
      document.exitPointerLock();
    });

    EventBus.on('story:trigger', (data) => {
      this.narrativePopup.show(data.text);
      this.isPaused = true;
      document.exitPointerLock();
    });

    EventBus.on('diary:log', (data) => {
      this.diary.addEntry(data.text, this.timeSystem.currentDay, this.timeSystem.timeOfDay);
    });

    EventBus.on('survival:effect', (data) => {
      this.hud.showEffect(data);
    });

    EventBus.on('time:update', (data) => {
      this.fogSystem.setTimeOfDay(data.nightProgress);
      this.skyBox.setTimeOfDay(data.timeOfDay);
      this.lighting.updateTimeOfDay(data.timeOfDay);
    });

    EventBus.on('time:dayChange', (data) => {
      this.storyManager.triggerDayEvent(data.day);
      this.storyManager.currentDay = data.day;
    });

    EventBus.on('sleep:start', () => {
      this.isPaused = true;
    });

    EventBus.on('sleep:end', () => {
      this.isPaused = false;
      this.renderer.requestPointerLock(this.container);
    });

    // 动物被打
    EventBus.on('combat:attack', (data) => {
      const playerPos = data.position;
      for (const animal of this.animals) {
        if (!animal.isAlive()) continue;
        const dist = animal.position.distanceTo(playerPos);
        if (dist <= data.range) {
          animal.takeDamage(data.damage, playerPos);
          break;
        }
      }
    });

    // 动物击杀掉落
    EventBus.on('animal:killed', (data) => {
      for (const [itemId, count] of Object.entries(data.drops)) {
        this.inventory.addItem(itemId, count);
      }
      this.interaction.addItemToWorld('rawMeat', 1, data.position.clone());
      EventBus.emit('ui:message', { text: `猎杀了一只${data.name}` });
      EventBus.emit('diary:log', { text: `猎杀了一只${data.name}` });
    });

    // 动物攻击玩家
    EventBus.on('animal:attack', (data) => {
      this.survival.temperature -= data.damage;
      EventBus.emit('ui:message', { text: '被动物攻击了！' });
    });

    // 叙事关闭后恢复
    EventBus.on('narrative:closed', () => {
      this.isPaused = false;
      setTimeout(() => {
        this.renderer.requestPointerLock(this.container);
      }, 100);
    });

    // 检查剧情触发
    EventBus.on('survival:update', () => {
      this.storyManager.checkTriggers();
    });

    // 自动存档（每60秒）
    setInterval(() => this.saveGame(), 60000);
  }

  saveGame() {
    try {
      const save = {
        day: this.timeSystem.currentDay,
        timeOfDay: this.timeSystem.timeOfDay,
        temperature: this.survival.temperature,
        hunger: this.survival.hunger,
        stamina: this.survival.stamina,
        inventory: this.inventory.items.map(i => ({ id: i.id, count: i.count })),
        diary: this.diary.entries,
        triggeredStory: [...this.storyManager.triggeredNodes],
        discoveredSecrets: [...this.secretManager.found],
        playerPos: {
          x: this.cameraCtrl.position.x,
          z: this.cameraCtrl.position.z,
        },
      };
      localStorage.setItem('forest_game_save', JSON.stringify(save));
    } catch (e) {
      // 存档失败静默处理
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem('forest_game_save');
      if (!raw) return false;
      const save = JSON.parse(raw);

      this.timeSystem.currentDay = save.day;
      this.timeSystem.timeOfDay = save.timeOfDay;
      this.survival.temperature = save.temperature;
      this.survival.hunger = save.hunger;
      this.survival.stamina = save.stamina;
      this.diary.entries = save.diary || [];
      this.storyManager.triggeredNodes = new Set(save.triggeredStory || []);
      this.secretManager.found = new Set(save.discoveredSecrets || []);

      if (save.inventory) {
        for (const item of save.inventory) {
          this.inventory.addItem(item.id, item.count);
        }
      }

      if (save.playerPos) {
        this.cameraCtrl.position.x = save.playerPos.x;
        this.cameraCtrl.position.z = save.playerPos.z;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (this.isRunning && !this.isPaused) {
      this.cameraCtrl.update(deltaTime);
      this.survival.update(deltaTime);
      this.timeSystem.update(deltaTime);
      this.interaction.update();
      this.fogSystem.update(deltaTime);
      this.player.update(deltaTime);
      this.hud.update();

      // 更新动物
      const playerPos = this.cameraCtrl.getPosition();
      for (const animal of this.animals) {
        animal.update(deltaTime, playerPos, this.timeSystem.isNight);
        animal.checkAggro(playerPos);
      }

      // 手电筒跟随
      this.lighting.updateFlashlight(playerPos, this.cameraCtrl.getDirection());
    }

    this.renderer.render();
  }
}

import * as THREE from 'three';
const game = new Game();
