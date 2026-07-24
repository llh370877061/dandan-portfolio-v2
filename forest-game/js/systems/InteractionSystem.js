import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { EventBus } from '../core/EventBus.js';
import { WorldItem } from '../items/WorldItem.js';

export class InteractionSystem {
  constructor(camera, scene, inventory, cameraCtrl, forest, treeHouse, campsite) {
    this.camera = camera;
    this.scene = scene;
    this.inventory = inventory;
    this.cameraCtrl = cameraCtrl;
    this.forest = forest;
    this.treeHouse = treeHouse;
    this.campsite = campsite;
    this.diarySystem = null;

    this.raycaster = new THREE.Raycaster();
    this.currentTarget = null;
    this.worldItems = [];

    this.setupInteractables();
    this.spawnInitialItems();
  }

  setupInteractables() {
    this.interactables = [];

    // 注册可砍伐的树
    for (const tree of this.forest.getSpecialTrees()) {
      this.interactables.push({
        type: 'tree',
        data: tree,
        getMesh: () => tree.trunk,
      });
    }

    // 梯子
    this.interactables.push({
      type: 'ladder',
      data: this.treeHouse.getLadderArea(),
      getMesh: () => null, // 用距离检测
    });

    // 箱子
    this.interactables.push({
      type: 'box',
      data: this.treeHouse.getBoxPosition(),
      getMesh: () => null,
    });

    // 睡袋位置
    this.interactables.push({
      type: 'sleepingBag',
      data: this.treeHouse.getSleepPosition(),
      getMesh: () => null,
    });

    // 篝火
    this.interactables.push({
      type: 'campfire',
      data: this.treeHouse.getFirePosition(),
      getMesh: () => null,
    });

    // 前辈营地的箱子
    this.interactables.push({
      type: 'lockedBox',
      data: this.campsite.getLockedBox(),
      getMesh: () => this.campsite.getLockedBox(),
    });
  }

  spawnInitialItems() {
    // 初始物品散布在树屋附近和营地附近
    const initialItems = [
      // 树屋下方附近
      { id: 'wood', count: 3, pos: new THREE.Vector3(3, 0, -5) },
      { id: 'rawMeat', count: 2, pos: new THREE.Vector3(-4, 0, -8) },
      // 营地附近
      { id: 'wood', count: 2, pos: new THREE.Vector3(-22, 0, 22) },
      { id: 'predecessorNote', count: 1, pos: new THREE.Vector3(-24, 0, 20) },
      // 森林里散落
      { id: 'wood', count: 2, pos: new THREE.Vector3(15, 0, 15) },
      { id: 'wood', count: 2, pos: new THREE.Vector3(-15, 0, -15) },
      { id: 'rawMeat', count: 1, pos: new THREE.Vector3(20, 0, -10) },
    ];

    for (const item of initialItems) {
      const y = this.scene.children[0]?.position?.y || 0; // ground
      const worldGen = this.forest.worldGen;
      item.pos.y = worldGen.getHeightAt(item.pos.x, item.pos.z);
      this.worldItems.push(new WorldItem(this.scene, item.id, item.count, item.pos));
    }
  }

  addItemToWorld(itemId, count, position) {
    this.worldItems.push(new WorldItem(this.scene, itemId, count, position));
  }

  update() {
    // 更新世界物品动画
    for (const item of this.worldItems) {
      item.update(0.016);
    }

    // 射线检测看是否有可交互物体
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    // 先检测世界物品
    const itemMeshes = this.worldItems
      .filter(i => !i.collected)
      .map(i => i.getMesh());

    const itemHits = this.raycaster.intersectObjects(itemMeshes, false);

    if (itemHits.length > 0 && itemHits[0].distance <= CONFIG.INTERACT_RANGE) {
      const hitMesh = itemHits[0].object;
      const worldItem = this.worldItems.find(i => i.getMesh() === hitMesh);
      if (worldItem) {
        this.currentTarget = { type: 'worldItem', data: worldItem };
        EventBus.emit('interaction:targetChanged', { target: this.currentTarget });
        return;
      }
    }

    // 检测特殊树（用 mesh）
    const treeMeshes = this.forest.getSpecialTrees()
      .filter(t => t.alive)
      .map(t => t.trunk);

    const treeHits = this.raycaster.intersectObjects(treeMeshes, false);

    if (treeHits.length > 0 && treeHits[0].distance <= CONFIG.INTERACT_RANGE) {
      const hitMesh = treeHits[0].object;
      const tree = this.forest.getSpecialTrees().find(t => t.trunk === hitMesh);
      if (tree) {
        this.currentTarget = { type: 'tree', data: tree };
        EventBus.emit('interaction:targetChanged', { target: this.currentTarget });
        return;
      }
    }

    // 距离检测：梯子、箱子、睡袋、篝火
    const playerPos = this.cameraCtrl.getPosition();
    const playerY = playerPos.y;
    const ladderArea = this.treeHouse.getLadderArea();
    const platformY = ladderArea.topY;
    const isOnTreeHouse = playerY > platformY - 1;

    // 调试：打印梯子检测状态
    const dx = playerPos.x - ladderArea.x;
    const dz = playerPos.z - ladderArea.z;
    const horizDist = Math.sqrt(dx * dx + dz * dz);
    if (Math.floor(Date.now() / 2000) !== this._lastDebugTick) {
      this._lastDebugTick = Math.floor(Date.now() / 2000);
      console.log(`[梯子调试] 玩家=(${playerPos.x.toFixed(1)}, ${playerPos.y.toFixed(1)}, ${playerPos.z.toFixed(1)}) 梯子=(${ladderArea.x}, ${ladderArea.z}) 水平距离=${horizDist.toFixed(1)}m isOnPlatform=${this.cameraCtrl.onPlatform} isOnTreeHouse=${isOnTreeHouse} range=${CONFIG.LADDER_RANGE}`);
    }

    const distChecks = [];

    // 梯子只在地面附近能检测到
    if (!isOnTreeHouse) {
      distChecks.push({ type: 'ladder', data: ladderArea });
    }

    // 树屋内的物品只在树屋高度能检测到
    if (isOnTreeHouse) {
      distChecks.push({ type: 'box', data: this.treeHouse.getBoxPosition() });
      distChecks.push({ type: 'sleepingBag', data: this.treeHouse.getSleepPosition() });
      distChecks.push({ type: 'campfire', data: this.treeHouse.getFirePosition() });
    }

    // 营地箱子始终可检测
    distChecks.push({ type: 'lockedBox', data: this.campsite.getLockedBox()?.position });

    for (const check of distChecks) {
      if (!check.data) continue;
      let targetPos;
      if (check.type === 'lockedBox' && check.data?.position) {
        targetPos = check.data.position;
      } else if (check.type === 'ladder') {
        // 梯子用水平距离检测，忽略Y轴
        targetPos = new THREE.Vector3(check.data.x, playerPos.y, check.data.z);
      } else if (check.data instanceof THREE.Vector3) {
        targetPos = check.data;
      } else {
        targetPos = new THREE.Vector3(
          check.data.x || 0,
          check.data.y || playerPos.y,
          check.data.z || 0
        );
      }

      const dist = playerPos.distanceTo(targetPos);
      const range = check.type === 'ladder' ? CONFIG.LADDER_RANGE : CONFIG.INTERACT_RANGE;
      if (dist <= range) {
        this.currentTarget = { type: check.type, data: check.data };
        EventBus.emit('interaction:targetChanged', { target: this.currentTarget });
        return;
      }
    }

    // 没有可交互目标
    this.currentTarget = null;
    EventBus.emit('interaction:targetChanged', { target: null });
  }

  // 1键：开枪
  shoot() {
    if (!this.currentTarget) {
      EventBus.emit('ui:message', { text: '没有瞄准目标' });
      return;
    }

    const equipped = this.inventory.getEquipped();
    if (!equipped || equipped.id !== 'pistol') {
      EventBus.emit('ui:message', { text: '需要先装备手枪（Tab打开背包装备）' });
      return;
    }

    // 对动物射击
    if (this.currentTarget.type === 'animal') {
      EventBus.emit('combat:attack', {
        damage: equipped.def.damage,
        range: equipped.def.range,
        position: this.cameraCtrl.getPosition(),
        direction: this.cameraCtrl.getDirection(),
        weaponId: 'pistol',
      });
      return;
    }

    // 对树射击（无效果）
    EventBus.emit('ui:message', { text: '子弹打在了树上...' });
  }

  // 2键：拾取
  pickup() {
    if (!this.currentTarget) return;

    if (this.currentTarget.type === 'worldItem') {
      this.handlePickup(this.currentTarget.data);
      return;
    }

    // 地面上的资源也可以捡
    EventBus.emit('ui:message', { text: '这里没有可以拾取的东西' });
  }

  // 3键：查看（日记由 main.js 处理）
  view() {
    // 由 main.js 直接调用 diaryUI.toggle()
  }

  // 4键：烹饪（由 main.js 处理）
  craft() {
    // 由 main.js 直接调用 crafting.toggle()
  }

  // 5键：所有互动（爬梯子、开箱子、睡觉、砍树等）
  interact() {
    console.log('[互动] 按下5键, currentTarget=', this.currentTarget ? this.currentTarget.type : 'null');
    if (!this.currentTarget) return;

    switch (this.currentTarget.type) {
      case 'tree':
        this.handleChopTree(this.currentTarget.data);
        break;
      case 'ladder':
        this.handleLadder();
        break;
      case 'box':
        this.handleBox();
        break;
      case 'sleepingBag':
        this.handleSleep();
        break;
      case 'campfire':
        this.handleCampfire();
        break;
      case 'lockedBox':
        this.handleLockedBox();
        break;
      case 'worldItem':
        this.handlePickup(this.currentTarget.data);
        break;
    }
  }

  attack() {
    if (!this.currentTarget) return;

    if (this.currentTarget.type === 'worldItem') {
      this.handlePickup(this.currentTarget.data);
      return;
    }

    if (this.currentTarget.type === 'tree') {
      this.handleChopTree(this.currentTarget.data);
      return;
    }

    EventBus.emit('player:attack', { target: this.currentTarget });
  }

  handlePickup(worldItem) {
    if (this.inventory.addItem(worldItem.itemId, worldItem.count)) {
      worldItem.collect();
      this.worldItems = this.worldItems.filter(i => i !== worldItem);
      const def = worldItem.itemId;
      EventBus.emit('ui:message', { text: `捡到了 ${def}` });
      EventBus.emit('item:pickup', { itemId: worldItem.itemId, count: worldItem.count });
    }
  }

  handleChopTree(treeData) {
    if (!this.inventory.hasItem('axe')) {
      EventBus.emit('ui:message', { text: '需要伐木工具才能砍树' });
      return;
    }

    if (this.forest.chopTree(treeData)) {
      this.inventory.addItem('wood', 2);
      EventBus.emit('ui:message', { text: '砍倒了一棵树，获得了木材 x2' });
      EventBus.emit('tree:chopped', { position: new THREE.Vector3(treeData.x, treeData.y, treeData.z) });

      // 砍倒的树附近掉落物品
      this.addItemToWorld('wood', 1, new THREE.Vector3(
        treeData.x + (Math.random() - 0.5) * 2,
        treeData.y,
        treeData.z + (Math.random() - 0.5) * 2
      ));
    }
  }

  handleLadder() {
    const ladder = this.treeHouse.getLadderArea();
    const playerPos = this.cameraCtrl.getPosition();

    console.log(`[爬梯子] 按下5键! 当前位置=(${playerPos.x.toFixed(1)}, ${playerPos.y.toFixed(1)}, ${playerPos.z.toFixed(1)}) ladder.topY=${ladder.topY} onPlatform=${this.cameraCtrl.onPlatform}`);

    if (playerPos.y < ladder.topY) {
      this.cameraCtrl.position.set(ladder.x, ladder.topY + 1.6, ladder.z);
      this.cameraCtrl.onPlatform = true;
      console.log(`[爬梯子] 传送到树屋! 新位置=(${ladder.x}, ${ladder.topY + 1.6}, ${ladder.z})`);
      EventBus.emit('ui:message', { text: '爬上了树屋' });
    } else {
      this.cameraCtrl.position.set(ladder.x + 1, ladder.baseY + 1.6, ladder.z + 1);
      this.cameraCtrl.onPlatform = false;
      console.log(`[爬梯子] 下到地面! 新位置=(${ladder.x + 1}, ${ladder.baseY + 1.6}, ${ladder.z + 1})`);
      EventBus.emit('ui:message', { text: '爬下了梯子' });
    }
  }

  handleBox() {
    // 打开箱子界面
    EventBus.emit('box:open', {});
    EventBus.emit('ui:message', { text: '打开了箱子' });
  }

  handleSleep() {
    EventBus.emit('sleep:request', {});
  }

  handleCampfire() {
    // 打开烹饪界面
    EventBus.emit('craft:open', {});
  }

  handleLockedBox() {
    EventBus.emit('secret:tryOpenLockedBox', {});
  }
}
