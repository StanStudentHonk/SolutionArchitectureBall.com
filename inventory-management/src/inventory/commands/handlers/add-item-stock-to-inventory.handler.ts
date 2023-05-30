import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InventoryRepository } from 'src/inventory/repository/inventory.repository';
import { AddItemStockToInventoryCommand } from '../impl/add-item-stock-to-inventory-supplier.command';
import { ItemStockChangedEvent } from 'src/inventory/events/impl/Inventory-changed/item-stock-changed.event';
import { WareHouseStockChangedEvent } from 'src/inventory/events/impl/Inventory-changed/warehouse-stock-changed';


@CommandHandler(AddItemStockToInventoryCommand)
export class AddItemStockToInventoryHandler implements ICommandHandler<AddItemStockToInventoryCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly eventBus : EventBus,
  ) {}

  async execute(command: AddItemStockToInventoryCommand) {
    let item = await this.repository.addItemStock(command.itemId, command.warehouseStockId ,command.amountToAdd)
    if(item){
        console.log(item)
        let wareHouseStockChangedEvent = new WareHouseStockChangedEvent(item.warehouseStock.wareHouseLocation, command.amountToAdd * -1)
        this.eventBus.publish(new ItemStockChangedEvent([wareHouseStockChangedEvent], item.item))
    }
    return item
  }
}