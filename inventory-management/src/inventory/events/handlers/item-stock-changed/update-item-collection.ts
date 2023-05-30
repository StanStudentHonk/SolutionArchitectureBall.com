import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ItemStockChangedEvent } from "../../impl/Inventory-changed/item-stock-changed.event";
import { WareHouseStockChangedEvent } from "../../impl/Inventory-changed/warehouse-stock-changed";
import { InventoryRepository } from "src/inventory/repository/inventory.repository";
import { AssortmentItem } from "src/inventory/schemas/read-schemas/assortment-item.schema";

@EventsHandler(ItemStockChangedEvent)
export class ItemStockChangedUpdateItemCollectionHandler implements IEventHandler<ItemStockChangedEvent> {
  constructor(private repository: InventoryRepository) {}

  async handle(event: ItemStockChangedEvent) {
    const item = event.item
    const totalToUpdate = event.updatedWareHouses.reduce(this.getTotalUpdated, 0);
  
    const exist = await this.repository.assortmentItemExist(event.item['_id'])
    if(!exist){
      let assortmentItem : AssortmentItem = {
        amount : totalToUpdate, 
        itemCode : item.itemCode,
        name : item.itemCode,
        price : item.price,
        size : item.size,
        supplier : item.supplier
      }  
      assortmentItem['_id'] = event.item['_id']
      this.repository.addItemToAssortment(assortmentItem)
    }
    else{
      this.repository.updateAssortmentItem(event.item['_id'], totalToUpdate);
    }
  }

  private getTotalUpdated(totalRemoved: number, event: WareHouseStockChangedEvent): number {
    return totalRemoved + event.amountRemoved;
  }
}