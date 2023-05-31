import { Item } from "../../../schemas/write-schemas/item.schema";
import { ItemChangedEvent } from "./item-changed.event";
import { WareHouseStockChangedEvent } from "./warehouse-stock-changed";

export class ItemStockChangedEvent {
    constructor(
        public updatedWareHouses : WareHouseStockChangedEvent[],
        public item: ItemChangedEvent
    )
    {}
}