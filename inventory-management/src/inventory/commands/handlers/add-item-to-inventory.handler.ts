import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ItemStockChangedEvent } from 'src/inventory/events/impl/Inventory-changed/item-stock-changed.event';
import { WareHouseStockChangedEvent } from 'src/inventory/events/impl/Inventory-changed/warehouse-stock-changed';
import { InventoryRepository } from 'src/inventory/repository/inventory.repository';
import { AddItemToInventoryCommand } from '../impl/add-item-to-inventory.command';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQEvent } from 'src/inventory/events/impl/common/rabbitMQEvent.event';


@CommandHandler(AddItemToInventoryCommand)
export class AddItemToInventoryHandler implements ICommandHandler<AddItemToInventoryCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly eventBus : EventBus,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async execute(command: AddItemToInventoryCommand) {
    let item = await this.repository.addItemToInventory(command.item)
    this.amqpConnection.publish<RabbitMQEvent>('BALLpuntcom', 'new-inventory-item-added', {pattern: 'new-inventory-item-added', payload: item});
    let wareHouseStockChangedEvents = item.wareHouseStock.map(ws => new WareHouseStockChangedEvent(ws.wareHouseLocation, ws.amount * -1))
    this.eventBus.publish(new ItemStockChangedEvent(wareHouseStockChangedEvents, item))
    return item
  }
}