import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ChangeInventoryByOrderCommand } from '../impl/change-inventory-by-order.command';
import { InventoryRepository } from 'src/inventory/repository/inventory.repository';
import { InventoryChangedByOrderEvent } from 'src/inventory/events/impl/Inventory-changed/inventory-changed-by-order.event';
import { ItemStockChangedEvent } from 'src/inventory/events/impl/Inventory-changed/item-stock-changed.event';
import { itemOrderedEvent } from 'src/inventory/events/impl/order-created/item-ordered.event';


@CommandHandler(ChangeInventoryByOrderCommand)
export class ChangeInventoryByOrderHandler implements ICommandHandler<ChangeInventoryByOrderCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly eventBus : EventBus,
  ) {}

  async execute(command: ChangeInventoryByOrderCommand) {
    var inventoryChangedByOrderEvent = new InventoryChangedByOrderEvent([], command.order,);

    const promises = command.order.items.map(async (item: itemOrderedEvent) => {
      var updatedStock = await this.repository.removeItemsByWareHouses(item._id, item.amount);
      var itemStockChangedEvent : ItemStockChangedEvent = {updatedWareHouses : updatedStock.updatedWarehouses, item : updatedStock.item}
      inventoryChangedByOrderEvent.items.push(itemStockChangedEvent)
    });
    
    await Promise.all(promises);
    this.eventBus.publish(inventoryChangedByOrderEvent)
  }
}