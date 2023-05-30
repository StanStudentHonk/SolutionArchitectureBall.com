import { Body, Controller, Get, Post } from '@nestjs/common';
import { Item } from './schemas/write-schemas/item.schema';
import { InventoryService } from './services/inventory.service';
import { AddItemStockToInventoryCommand } from './commands/impl/add-item-stock-to-inventory-supplier.command';

@Controller("items")
export class ItemController {
  constructor(private inventoryService: InventoryService) {}
  
  @Post()
  async addItemToInventory(@Body() item: Item) {
    return this.inventoryService.addItemToInventory(item) 
  }

  @Get()
  async getAssortmentItems(): Promise<Item[]> {
    return this.inventoryService.getItemsFromCollection() 
  }

  @Post("add-stock")
  async addStock(@Body() item: AddItemStockToInventoryCommand): Promise<Item[]> {
    return this.inventoryService.addItemStockToInventory(item) 
  }
}
