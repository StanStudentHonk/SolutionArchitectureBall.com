import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Payment from './payment.entity';
import { Order } from './schemas/order.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name, 'payments-read')
    private readonly paymentReadModel: Model<Payment>,
    @InjectModel(Payment.name, 'payments-write')
    private readonly paymentWriteModel: Model<Payment>,
    @InjectModel(Order.name, 'payments-read')
    private readonly orderReadModel: Model<Order>,
    @InjectModel(Order.name, 'payments-write')
    private readonly orderWriteModel: Model<Order>,
  ) {}

  async createPayment(payment: Payment): Promise<Payment> {
    const newPayment = new this.paymentWriteModel(payment);
    return newPayment.save();
  }

  async getPayments(): Promise<Payment[]> {
    return this.paymentReadModel.find().exec();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'payment-processed',
    queue: 'payment',
  })
  public async onPaymentProcessed(msg: {}) {
    console.log('Payment processed');
    console.log(msg);
    const newPayment = new this.paymentReadModel(msg);
    newPayment.save();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'order-created',
    queue: 'payment',
  })
  public async onOrderCreated(msg: {}) {
    console.log('Order created');
    console.log(msg);
    // First, calculate the total price of the order
    let totalPrice = 0;
    for (const item of msg['items']) {
      totalPrice += item['price'];
    }
    // Then, create the order
    const newOrder = new this.orderWriteModel({
      totalPrice: totalPrice,
      orderDate: msg['orderDate'],
    });

    // Save the order to the write model
    newOrder.save().then(() => {
      // Then, save the order to the read model
      const newOrder = new this.orderReadModel({
        totalPrice: totalPrice,
        orderDate: msg['orderDate'],
      });
      newOrder.save();
    });
  }
}
