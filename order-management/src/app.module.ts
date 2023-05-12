import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import * as config from "../config/config.json";



@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'BALLpuntcom',
          type: 'topic',
        },
      ],
      uri: config.rabbitmq.host,
    }),
    MongooseModule.forRoot(config.mongodb.read, {
      connectionName: 'orders-read',
    }),
    MongooseModule.forRoot(config.mongodb.write, {
      connectionName: 'orders-write',
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'orders-read'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'orders-write'),
    ConfigModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
