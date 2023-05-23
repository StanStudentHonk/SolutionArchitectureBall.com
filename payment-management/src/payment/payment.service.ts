import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';
import Payment from './payment.entity';
import { Order } from './schemas/order.schema';

@Injectable()
export class PaymentService {
  constructor(
    private eventEmitter: EventEmitter2,
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
    routingKey: ['payment-processed', 'order-created'],
    queue: 'payment',
  })
  public async onEventFromPaymentQueue(event: RabbitMQEvent) {
    console.log(event + event.pattern)
    this.eventEmitter.emit(
      event.pattern,
      event.payload
    );

  }

  @OnEvent('order-created')
  handleOrderCreatedEvent(payload) {
    console.log('Order created');
    console.log(payload);
    // First, calculate the total price of the order
    let totalPrice = 0;
    for (const item of payload['items']) {
      totalPrice += item['price'];
    }
    // Then, create the order
    const newOrder = new this.orderWriteModel({
      totalPrice: totalPrice,
      orderDate: payload['orderDate'],
    });

    // Save the order to the write model
    newOrder.save().then(() => {
      // Then, save the order to the read model
      const newOrder = new this.orderReadModel({
        totalPrice: totalPrice,
        orderDate: payload['orderDate'],
      });
      newOrder.save();
    });
  }

  @OnEvent('payment-processed')
  handlePaymentProcessedEvent(payload: Payment) {
    const newPayment = new this.paymentReadModel(payload);
    newPayment.save();
  }
}
