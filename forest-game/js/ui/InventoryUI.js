import { EventBus } from '../core/EventBus.js';
import { ITEM_TYPES } from '../items/ItemDefs.js';

export class InventoryUI {
  constructor(inventory) {
    this.inventory = inventory;
    this.isOpen = false;
    this.selectedSlot = -1;

    this.panel = document.getElementById('inventory-panel');
    this.grid = document.getElementById('inventory-grid');
    this.desc = document.getElementById('item-description');
    this.useBtn = document.getElementById('use-btn');
    this.dropBtn = document.getElementById('drop-btn');

    this.useBtn.addEventListener('click', () => this.onUse());
    this.dropBtn.addEventListener('click', () => this.onDrop());

    EventBus.on('inventory:changed', () => {
      if (this.isOpen) this.render();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.style.display = this.isOpen ? 'block' : 'none';
    this.selectedSlot = -1;
    EventBus.emit('game:pause', { paused: this.isOpen });
    if (this.isOpen) this.render();
  }

  render() {
    this.grid.innerHTML = '';

    for (let i = 0; i < this.inventory.maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      if (i === this.selectedSlot) slot.classList.add('selected');

      const item = this.inventory.items[i];
      if (item) {
        slot.innerHTML = `
          <span class="item-icon">${item.def.icon}</span>
          <span class="item-name">${item.def.name}</span>
          ${item.def.stackable ? `<span class="item-count">x${item.count}</span>` : ''}
        `;
        slot.addEventListener('click', () => this.selectSlot(i));
      }

      this.grid.appendChild(slot);
    }

    this.updateDescription();
  }

  selectSlot(index) {
    this.selectedSlot = index;
    this.render();
  }

  updateDescription() {
    if (this.selectedSlot < 0 || !this.inventory.items[this.selectedSlot]) {
      this.desc.textContent = '';
      this.useBtn.style.display = 'none';
      this.dropBtn.style.display = 'none';
      return;
    }

    const item = this.inventory.items[this.selectedSlot];
    this.desc.textContent = item.def.description;
    this.useBtn.style.display = item.def.usable ? 'block' : 'none';
    this.dropBtn.style.display = 'block';
  }

  onUse() {
    if (this.selectedSlot >= 0) {
      this.inventory.useItem(this.selectedSlot);
      this.render();
    }
  }

  onDrop() {
    if (this.selectedSlot >= 0) {
      const item = this.inventory.items[this.selectedSlot];
      if (item) {
        this.inventory.removeItem(item.id, 1);
        EventBus.emit('ui:message', { text: `丢弃了 ${item.def.name}` });
        this.selectedSlot = -1;
        this.render();
      }
    }
  }
}
