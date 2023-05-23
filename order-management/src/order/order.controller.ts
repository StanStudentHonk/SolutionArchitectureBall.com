import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';
import { RabbitMQEvent } from './events/rabbitMQEvent.event';
import { orderCreatedEvent } from './events/orderCreated.event';

@Controller('orders')
export class OrderController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly orderService: OrderService) {}
  
  @Post()
  async createOrder(@Body() orderData: Order) {
    // Add to the mongoDB
    const order = await this.orderService.createOrder(orderData);
    // Publish the order to the exchange
    this.amqpConnection.publish<orderCreatedEvent>('BALLpuntcom', 'order-created', {pattern: 'order-created', payload: order});
    return order;
  }

  @Get()
  async getOrders() {
    // Add to the mongoDB
    const orders = await this.orderService.getOrders();

    // Publish the order to the exchange
    return orders;
  }
}