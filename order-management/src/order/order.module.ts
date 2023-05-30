import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import configuration from 'config/configuration';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'BALLpuntcom',
          type: 'topic',
        },
      ],
      uri: configuration.rabbitmq.host,
    }),
    MongooseModule.forRoot(configuration.mongodb.read, {
      connectionName: 'orders-read',
    }),
    MongooseModule.forRoot(configuration.mongodb.write, {
      connectionName: 'orders-write',
    }),
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'orders-read',
    ),
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'orders-write',
    ),
    EventEmitterModule.forRoot(),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
