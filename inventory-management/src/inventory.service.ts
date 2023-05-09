import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: 'order-created',
        queue: 'inventory',
      })
      public async pubSubHandler(msg: {}) {
        console.log(`Received message: ${JSON.stringify(msg)}`);
      }
}