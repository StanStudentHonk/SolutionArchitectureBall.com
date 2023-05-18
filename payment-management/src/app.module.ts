import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment/payment.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment/payment.schema';
import configuration from 'config/configuration';import { PaymentService } from './payment/payment.service';
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
    ConfigModule.forRoot(
    )
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}
