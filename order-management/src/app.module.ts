import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import configuration from 'config/configuration'; '../config/configuration';

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
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'orders-read'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'orders-write'),
    ConfigModule.forRoot(
    )
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
