import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ChangeInventoryByOrderCommand } from 'src/inventory/commands/impl/change-inventory-by-order.command';
import { RabbitMQEvent } from '../../impl/common/rabbitMQEvent.event';

@Injectable()
export class OrderCreatedHandler {
    constructor(
      private commandBus: CommandBus, 
      private eventEmitter: EventEmitter2
      ) {}

    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: ['order-created'],
        queue: 'inventory',
      })
      public async changeItemStockBasedOnOrder(event: RabbitMQEvent) {
        this.eventEmitter.emit(
          event['pattern'],
          event['payload']
        );
    }

    @OnEvent('order-created')
    handlePaymentProcessedEvent(payload: any) { 
        this.commandBus.execute(new ChangeInventoryByOrderCommand(payload));
    }
}
 