import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name, 'orders-read')
    private readonly orderReadModel: Model<Order>,
    @InjectModel(Order.name, 'orders-write')
    private readonly orderWriteModel: Model<Order>,
  ) {}

  async createOrder(order: Order): Promise<Order> {
    const newOrder = new this.orderWriteModel(order);
    return newOrder.save();
  }

  async getOrders(): Promise<Order[]> {
    return this.orderReadModel.find().exec();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'order-created',
    queue: 'order',
  })
  @OnEvent('order-created')
  public async pubSubHandler(event: RabbitMQEvent) {
    let payload = event['payload']
    const newOrder = new this.orderReadModel(payload);
    newOrder.save();
  }
}
