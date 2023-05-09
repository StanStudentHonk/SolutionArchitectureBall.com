
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
 
@Injectable()
export class OrderService {
    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: 'order-created',
        queue: 'order',
      })
      public async pubSubHandler(msg: {}) {
        console.log(`Received message: ${JSON.stringify(msg)}`);
      }
}