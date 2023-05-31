import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InventoryEventRepository } from "src/inventory/repository/inventory-event.repository";
import { ItemStockChangedEvent } from "../../impl/Inventory-changed/item-stock-changed.event";

@EventsHandler(ItemStockChangedEvent)
export class ItemStockChangedUpdateEventStoreHandler implements IEventHandler<ItemStockChangedEvent> {
  constructor(private repository: InventoryEventRepository) {}

  handle(event: ItemStockChangedEvent) {
    this.repository.addItemStockChanged(event)
  }
}