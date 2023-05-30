import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';
import { Order } from './schemas/order.schema';
import { Customer } from './schemas/customer.schema';
import { Payment } from './schemas/payment.schema';
import { CurrencyService } from 'src/currency/currency.service';
import { Currency } from 'src/currency/currency.enum';

@Injectable()
export class PaymentService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly currencyService: CurrencyService,
    @InjectModel(Payment.name, 'payments-read')
    private readonly paymentReadModel: Model<Payment>,
    @InjectModel(Payment.name, 'payments-write')
    private readonly paymentWriteModel: Model<Payment>,
    @InjectModel(Order.name, 'payments-read')
    private readonly orderReadModel: Model<Order>,
    @InjectModel(Order.name, 'payments-write')
    private readonly orderWriteModel: Model<Order>,
    @InjectModel(Customer.name, 'payments-read')
    private readonly customerReadModel: Model<Customer>,
    @InjectModel(Customer.name, 'payments-write')
    private readonly customerWriteModel: Model<Customer>,
  ) {}

  async createPayment(payment: any): Promise<Payment> {
    // Check if the order exists
    const order = await this.orderReadModel.findById(payment.orderId);
    if (!order) {
      throw new NotFoundException('Order does not exist');
    }

    // Check if currency is supported
    if (!Object.values(Currency).includes(payment.currency)) {
      throw new BadRequestException(
        `Currency ${payment.currency} is not supported`,
      );
    }

    // Check if currency is EUR
    if (payment.currency !== Currency.EUR) {
      // Convert to EUR
      const exchangeRate = await this.currencyService.getCurrencyConversion(
        payment.currency,
        Currency.EUR,
      );
      payment.amount = payment.amount * exchangeRate;
    }
    try {
      const newPayment = new this.paymentWriteModel(payment);
      const savedPayment = await newPayment.save();
      this.eventEmitter.emit('payment-processed', savedPayment);
      return savedPayment;
    } catch (error) {
      throw new BadRequestException("Couldn't process payment");
    }
  }

  async getPayments(): Promise<Payment[]> {
    return this.paymentReadModel.find().exec();
  }

  async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    return this.paymentReadModel.find({ orderId: orderId }).exec();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: ['order-created'],
    queue: 'payment',
  })
  public async onEventFromPaymentQueue(event: RabbitMQEvent) {
    this.eventEmitter.emit(event.pattern, event.payload);
  }

  @OnEvent('order-created')
  async handleOrderCreatedEvent(payload) {
    // Get customer, if it exists otherwise create it
    let customer = await this.customerWriteModel.findOne({
      email: payload['customer']['email'],
    });
    if (!customer) {
      const newCustomer = new this.customerWriteModel({
        email: payload['customer']['email'],
        name: payload['customer']['name'],
      });
      customer = await newCustomer.save();
      // Save the customer to the read model
      this.eventEmitter.emit('customer-created', customer);
    }

    // Then, calculate the total price of the order
    let totalPrice = 0;
    for (const item of payload['items']) {
      totalPrice += item['price'] * item['amount'];
    }
    // Then, create the order
    const newOrder = new this.orderWriteModel({
      _id: payload['_id'],
      totalPrice: totalPrice,
      orderDate: payload['orderDate'],
      customerId: customer['_id'],
    });

    // Save the order to the write model
    const savedOrder = await newOrder.save();

    // Emit order processed event to save the order to the read model
    this.eventEmitter.emit('order-processed', savedOrder);
  }

  @OnEvent('customer-created')
  async handleCustomerCreatedEvent(customer: Customer) {
    await this.customerReadModel.collection.insertOne(customer);
  }

  @OnEvent('order-processed')
  async handleOrderProcessedEvent(order: Order) {
    await this.orderReadModel.collection.insertOne(order);
  }

  @OnEvent('payment-processed')
  async handlePaymentProcessedEvent(payment: Payment) {
    await this.paymentReadModel.collection.insertOne(payment);
  }
}
