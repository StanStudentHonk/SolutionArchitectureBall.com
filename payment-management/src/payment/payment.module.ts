import { Module } from '@nestjs/common';
import configuration from 'config/configuration';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventEmitterModule } from '@nestjs/event-emitter';
 '../config/configuration';

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
      connectionName: 'payments-read',
    }),
    MongooseModule.forRoot(configuration.mongodb.write, {
      connectionName: 'payments-write',
    }),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }], 'payments-read'),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }], 'payments-write'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'payments-read'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }], 'payments-write'),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }], 'payments-read'),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }], 'payments-write'),
    EventEmitterModule.forRoot()
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
