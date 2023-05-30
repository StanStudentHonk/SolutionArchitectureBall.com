import { Order } from "../../../schemas/structs/order.interface";
import { ItemStockChangedEvent } from "./item-stock-changed.event";

export class InventoryChangedByOrderEvent {
    constructor(
      public items: ItemStockChangedEvent[],
      public order: Order,
    ) {}
}