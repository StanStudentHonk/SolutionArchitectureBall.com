import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InventoryChangedByOrderEvent } from "../../impl/Inventory-changed/inventory-changed-by-order.event";
import { InventoryRepository } from "src/inventory/repository/inventory.repository";

@EventsHandler(InventoryChangedByOrderEvent)
export class InventoryChangedByOrderUpdateEventStoreHandler implements IEventHandler<InventoryChangedByOrderEvent> {
  constructor(private repository: InventoryRepository) {}

  handle(event: InventoryChangedByOrderEvent) {
    console.log("ello event store")
  }
}