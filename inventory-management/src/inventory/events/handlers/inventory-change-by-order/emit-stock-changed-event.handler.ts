import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InventoryChangedByOrderEvent } from "../../impl/Inventory-changed/inventory-changed-by-order.event";
import { ItemStockChangedEvent } from "../../impl/Inventory-changed/item-stock-changed.event";

@EventsHandler(InventoryChangedByOrderEvent)
export class InventoryChangedByOrderUpdateReadInventoryHandler implements IEventHandler<InventoryChangedByOrderEvent> {
    constructor(
      private readonly eventBus : EventBus,
    ) {}

  handle(event: InventoryChangedByOrderEvent) {
    event.items.forEach((item : ItemStockChangedEvent) => {
        this.eventBus.publish(new ItemStockChangedEvent(item.updatedWareHouses, item.item))
    })
  }
}