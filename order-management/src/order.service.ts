import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService {
  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: 'order-created',
    queue: 'order',
  })
  public async pubSubHandler(msg: {}) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
  
  constructor(
    @InjectModel(Order.name, 'orders-read')
    private readonly orderReadModel: Model<Order>,
    @InjectModel(Order.name, 'orders-write')
    private readonly orderWriteModel: Model<Order>,
  ) {}

  async createOrder(order: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderWriteModel(order);
    return newOrder.save();
  }

  async getOrders(): Promise<Order[]> {
    return this.orderReadModel.find().exec();
  }
}
