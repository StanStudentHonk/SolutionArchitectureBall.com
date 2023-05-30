import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './schemas/item.schema';

@Controller("items")
export class ItemController {
  constructor(private itemService: ItemService) {}
  
  @Post()
  async addItemToInventory(@Body() item: Item) {
    
    return this.itemService.addItemToInventory(item) 
  }

  @Get()
  async getAllItems(): Promise<Item[]> {
    return
  }
}
