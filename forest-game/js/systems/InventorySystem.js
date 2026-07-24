import { ITEM_TYPES } from '../items/ItemDefs.js';
import { EventBus } from '../core/EventBus.js';

export class InventorySystem {
  constructor() {
    this.items = [];
    this.maxSlots = 12;
    this.equippedItem = null;
    this.equippedSlot = -1;
  }

  addItem(itemId, count = 1) {
    const def = ITEM_TYPES[itemId];
    if (!def) return false;

    // 可堆叠的找已有格子
    if (def.stackable) {
      const existing = this.items.find(
        i => i.id === itemId && i.count < (def.maxStack || 99)
      );
      if (existing) {
        existing.count = Math.min(existing.count + count, def.maxStack || 99);
        EventBus.emit('inventory:changed', { action: 'update', item: existing });
        return true;
      }
    }

    // 新格子
    if (this.items.length >= this.maxSlots) {
      EventBus.emit('ui:message', { text: '背包已满！' });
      return false;
    }

    const newItem = {
      id: itemId,
      count,
      def,
      ammo: def.maxAmmo || 0,
    };

    this.items.push(newItem);
    EventBus.emit('inventory:changed', { action: 'add', item: newItem });
    return true;
  }

  removeItem(itemId, count = 1) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return false;

    this.items[index].count -= count;
    if (this.items[index].count <= 0) {
      const removed = this.items.splice(index, 1)[0];
      if (this.equippedItem === removed) {
        this.equippedItem = null;
        this.equippedSlot = -1;
      }
    }

    EventBus.emit('inventory:changed', { action: 'remove', itemId, count });
    return true;
  }

  useItem(slotIndex) {
    const item = this.items[slotIndex];
    if (!item) return;

    switch (item.def.useType) {
      case 'consumable':
        if (item.def.requireItem && !this.hasItem(item.def.requireItem)) {
          EventBus.emit('ui:message', { text: `需要 ${ITEM_TYPES[item.def.requireItem].name} 才能使用` });
          return;
        }
        if (item.def.effect) {
          EventBus.emit('item:effect', item.def.effect);
        }
        if (item.def.consumeItem) {
          this.removeItem(item.def.consumeItem, 1);
        }
        if (item.def.consumeOnUse) {
          this.removeItem(item.id, 1);
        }
        break;

      case 'weapon':
        if (this.equippedSlot === slotIndex) {
          this.equippedItem = null;
          this.equippedSlot = -1;
          EventBus.emit('item:unequip', {});
        } else {
          this.equippedItem = item;
          this.equippedSlot = slotIndex;
          EventBus.emit('item:equip', { item });
        }
        break;

      case 'tool':
        EventBus.emit('item:tool', { action: item.def.action, item });
        break;

      case 'fuel':
        EventBus.emit('fuel:add', { itemId: item.id });
        this.removeItem(item.id, 1);
        EventBus.emit('ui:message', { text: '添加了燃料' });
        break;
    }
  }

  equipItem(slotIndex) {
    const item = this.items[slotIndex];
    if (!item) return;
    this.equippedItem = item;
    this.equippedSlot = slotIndex;
    EventBus.emit('item:equip', { item });
  }

  hasItem(itemId, count = 1) {
    const total = this.items
      .filter(i => i.id === itemId)
      .reduce((sum, i) => sum + i.count, 0);
    return total >= count;
  }

  getItemCount(itemId) {
    return this.items
      .filter(i => i.id === itemId)
      .reduce((sum, i) => sum + i.count, 0);
  }

  getEquipped() {
    return this.equippedItem;
  }
}
