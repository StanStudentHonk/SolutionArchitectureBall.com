import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateItemDto } from './dtos/createItem.dto';
import { Item } from './item.interface';
import { ItemService } from './item.service';

@Controller("items")
export class ItemController {
  constructor(private itemService: ItemService) {}
  
  @Post()
  async addItemToInventory(@Body() itemDto: CreateItemDto) {
    this.itemService.create(itemDto);
  }

  @Get()
  async getAllItems(): Promise<Item[]> {
    return this.itemService.findAll();
  }
}
