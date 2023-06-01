import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';
import { Item } from './schemas/item.schema';
import { orderCreatedEvent } from './events/orderCreated.event';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name, 'orders-read')
    private readonly orderReadModel: Model<Order>,
    @InjectModel(Order.name, 'orders-write')
    private readonly orderWriteModel: Model<Order>,
    @InjectModel(Item.name, 'orders-read')
    private readonly itemReadModel: Model<Item>,
    @InjectModel(Item.name, 'orders-write')
    private readonly itemWriteModel: Model<Item>,
    private eventEmitter: EventEmitter2
  ) {}

  async createOrder(order: Order): Promise<Order> {
    const newOrder = new this.orderWriteModel(order);
    return newOrder.save();
  }

  async createOrderEvent(order: Order): Promise<orderCreatedEvent> {
    let orderCreatedEvent : orderCreatedEvent = 
      {
        customer : order.customer, 
        deliveryAdress : order.deliveryAdress,
        deliveryDate : order.deliveryDate,
        items : [],
        orderDate : order.orderDate
      }
      const itemsPromises = order.itemsOrdered.map(async (item) => {
        let i: Item = await this.itemWriteModel.findById(item.item);
        orderCreatedEvent.items.push({
          amount: item.amount,
          _id: i._id.toString(),
          price: i.price,
        });
      });
    
    await Promise.all(itemsPromises);
    return orderCreatedEvent;
  }

  async getOrders(): Promise<Order[]> {
    return this.orderReadModel.find().exec();
  }

  @RabbitSubscribe({
    exchange: 'BALLpuntcom',
    routingKey: ['order-created', 'new-inventory-item-added'],
    queue: 'order',
  })
  public async changeItemStockBasedOnOrder(event: RabbitMQEvent) {
    this.eventEmitter.emit(
      event['pattern'],
      event['payload']
    )
  }
  
  @OnEvent('order-created')
  public async orderCreatedHandler(event) {
    const newOrder = new this.orderReadModel(event);
    newOrder.save();
  }

  @OnEvent('new-inventory-item-added')
  newItemReadHandler(event : Item) { 
      let item : Item = {_id : event._id, name : event.name, itemCode: event.itemCode, size : event.size, price: event.price, weight : event.weight}
      const newItem = new this.itemReadModel(item);
      newItem.save();
  }

  @OnEvent('new-inventory-item-added')
  newItemWriteHandler(event : Item) { 
      let item : Item = {_id : event._id, name : event.name, itemCode: event.itemCode, size : event.size, price: event.price, weight : event.weight}
      const newItem = new this.itemWriteModel(item);
      newItem.save();
  }
}
