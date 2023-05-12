import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Item } from './item.interface';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
    constructor(private itemRepository: ItemRepository) {}
    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: 'order-created',
        queue: 'inventory',
      })
      public async getItemsFromOrder(msg: {}) {
        // haalt items uit database voor de order en stuurt event van hoeveel items met inventory locatie
        // zodat het gepackeged kan worden
        console.log(`Received message: ${JSON.stringify(msg)}`);
    }

    create(item: Item) {
      this.itemRepository.create(item)
      return item
    }

    findAll() {
      return this.itemRepository.findAll()
    }
}