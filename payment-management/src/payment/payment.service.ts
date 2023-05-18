
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import Payment from './payment.entity';
 
@Injectable()
export class PaymentService {
    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: 'payment-created',
        queue: 'payment',
      })
      public async pubSubHandler(msg: {}) {
        console.log(`Received message: ${JSON.stringify(msg)}`);
      }

      constructor(
        @InjectModel(Payment.name, 'payments-read')
        private readonly paymentReadModel: Model<Payment>,
        @InjectModel(Payment.name, 'payments-write')
        private readonly paymentWriteModel: Model<Payment>,
      ) {}
    
      async createPayment(payment: CreatePaymentDto): Promise<Payment> {
        const newPayment = new this.paymentWriteModel(payment);
        return newPayment.save();
      }
    
      async getPayments(): Promise<Payment[]> {
        return this.paymentReadModel.find().exec();
      }
}