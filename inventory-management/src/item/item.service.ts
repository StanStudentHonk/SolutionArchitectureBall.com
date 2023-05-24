import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeItemStockByOrderCommand } from './commands/impl/ChangeItemStockCommand';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';
import { Item } from './schemas/item.schema';



@Injectable()
export class ItemService {
    constructor(
      @InjectModel(Item.name, 'items-read')
      private readonly itemReadModel: Model<Item>,
      @InjectModel(Item.name, 'items-write')
      private readonly itemWriteModel: Model<Item>,

      private commandBus: CommandBus, 
      private eventEmitter: EventEmitter2) {}

    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: ['order-created'],
        queue: 'inventory',
      })
      public async changeItemStockBasedOnOrder(event: RabbitMQEvent) {
        this.eventEmitter.emit(
          event.pattern,
          event.payload
        );
    }

    @OnEvent('order-created')
    handlePaymentProcessedEvent(payload: any) { 
        console.log(payload)
        this.commandBus.execute(new ChangeItemStockByOrderCommand(payload));
    }

    // @OnEvent('items-added')
    // handlePaymentProcessedEvent(payload: any) { 
    //     this.commandBus.execute(new ChangeItemStockByOrderCommand(payload['order'], payload['items']));
    // }

    // @OnEvent('items-removed')
    // handlePaymentProcessedEvent(payload: any) { 
    //     this.commandBus.execute(new ChangeItemStockByOrderCommand(payload['order'], payload['items']));
    // }
    
    addItemToInventory(item: Item) { 
      const itemCreated = new this.itemWriteModel(item);
      return itemCreated.save();
    };
    }
 