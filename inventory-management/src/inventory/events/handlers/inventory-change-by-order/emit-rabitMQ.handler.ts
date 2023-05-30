import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InventoryChangedByOrderEvent } from "../../impl/Inventory-changed/inventory-changed-by-order.event";
import { InventoryRepository } from "src/inventory/repository/inventory.repository";

@EventsHandler(InventoryChangedByOrderEvent)
export class InventoryChangedByOrderRabitMQHandler implements IEventHandler<InventoryChangedByOrderEvent> {
  constructor(private repository: InventoryRepository, private readonly amqpConnection: AmqpConnection) {}

  handle(event: InventoryChangedByOrderEvent) {
    this.amqpConnection.publish('BALLpuntcom', 'inventory-changed-by-order', {pattern: 'inventory-changed-by-order', payload: event})
  }
}