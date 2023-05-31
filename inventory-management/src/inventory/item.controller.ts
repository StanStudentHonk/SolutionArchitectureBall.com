import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Item } from './schemas/write-schemas/item.schema';
import { InventoryService } from './services/inventory.service';
import { AddItemStockToInventoryCommand } from './commands/impl/add-item-stock-to-inventory-supplier.command';

@Controller('items')
export class ItemController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  async addItemToInventory(@Body() item: Item) {
    return this.inventoryService.addItemToInventory(item);
  }

  @Get()
  async getAssortmentItems(): Promise<Item[]> {
    return this.inventoryService.getItemsFromCollection();
  }

  @Get('/:id/highest-stock')
  async getAmountOfItemById(@Param('id') id: string) {
    let stock = await this.inventoryService.getHighestStockOfItem(id)
    return {highestAmountOfStock : stock}
  }

  @Post('add-stock')
  async addStock(
    @Body() item: AddItemStockToInventoryCommand,
  ): Promise<Item[]> {
    return this.inventoryService.addItemStockToInventory(item);
  }
}
