import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { orderCreatedEvent } from "./events/orderCreated.event";
import { OrderService } from "./order.service";
import { Order } from "./schemas/order.schema";
import { RabbitMQEvent } from "./events/rabbitMQEvent.event";

@Controller('orders')
export class OrderController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly orderService: OrderService) {}
  
  @Post()
  async createOrder(@Body() orderData: Order) {
    // Add to the mongoDB
    const order = await this.orderService.createOrder(orderData);
    const orderEvent = await this.orderService.createOrderEvent(order)
    this.amqpConnection.publish<RabbitMQEvent>('BALLpuntcom', 'order-created', {pattern: 'order-created', payload: orderEvent});

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