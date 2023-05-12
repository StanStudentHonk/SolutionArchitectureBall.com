import { Injectable } from '@nestjs/common';
import { Item } from './item.interface';

@Injectable()
export class ItemRepository {

    private readonly items: Item[] = [];

  create(item: Item) {
    this.items.push(item);
  }

  findAll(): Item[] {
    return this.items;
  }
}