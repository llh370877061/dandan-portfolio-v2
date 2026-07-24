import { EventBus } from '../core/EventBus.js';

export class CraftingSystem {
  constructor(inventory) {
    this.inventory = inventory;
    this.isOpen = false;
    this.fuelCount = 0;

    this.panel = document.getElementById('craft-panel');

    EventBus.on('fuel:add', () => { this.fuelCount++; });
    EventBus.on('craft:open', () => this.toggle());

    // 绑定烹饪按钮
    document.querySelectorAll('.craft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const recipe = btn.dataset.recipe;
        this.craft(recipe);
      });
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.style.display = this.isOpen ? 'block' : 'none';
    if (this.isOpen) this.updateButtons();
  }

  craft(recipe) {
    switch (recipe) {
      case 'heatWater':
        if (!this.inventory.hasItem('wood', 1)) {
          EventBus.emit('ui:message', { text: '需要木材作为燃料' });
          return;
        }
        this.inventory.removeItem('wood', 1);
        this.inventory.addItem('hotWater', 1);
        EventBus.emit('ui:message', { text: '烧好了一壶热水' });
        break;

      case 'cookMeat':
        if (!this.inventory.hasItem('wood', 1) || !this.inventory.hasItem('rawMeat', 1)) {
          EventBus.emit('ui:message', { text: '需要木材 x1 + 生肉 x1' });
          return;
        }
        this.inventory.removeItem('wood', 1);
        this.inventory.removeItem('rawMeat', 1);
        this.inventory.addItem('cookedMeat', 1);
        EventBus.emit('ui:message', { text: '烤好了一块肉' });
        break;

      case 'makeSoup':
        if (!this.inventory.hasItem('wood', 1) || !this.inventory.hasItem('hotWater', 1) || !this.inventory.hasItem('rawMeat', 1)) {
          EventBus.emit('ui:message', { text: '需要木材 x1 + 热水 x1 + 生肉 x1' });
          return;
        }
        this.inventory.removeItem('wood', 1);
        this.inventory.removeItem('hotWater', 1);
        this.inventory.removeItem('rawMeat', 1);
        this.inventory.addItem('soup', 1);
        EventBus.emit('ui:message', { text: '煮好了一碗热汤' });
        break;
    }

    this.updateButtons();
  }

  updateButtons() {
    document.querySelectorAll('.craft-btn').forEach(btn => {
      const recipe = btn.dataset.recipe;
      let canCraft = false;

      switch (recipe) {
        case 'heatWater':
          canCraft = this.inventory.hasItem('wood', 1);
          break;
        case 'cookMeat':
          canCraft = this.inventory.hasItem('wood', 1) && this.inventory.hasItem('rawMeat', 1);
          break;
        case 'makeSoup':
          canCraft = this.inventory.hasItem('wood', 1) && this.inventory.hasItem('hotWater', 1) && this.inventory.hasItem('rawMeat', 1);
          break;
      }

      btn.disabled = !canCraft;
    });
  }
}
