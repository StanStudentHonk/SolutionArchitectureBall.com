import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { orderCreatedEvent } from "./events/orderCreated.event";
import { OrderService } from "./order.service";
import { Order } from "./schemas/order.schema";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('orders')
export class OrderController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly orderService: OrderService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create an order' })
  async createOrder(@Body() orderData: Order) {
    // Add to the mongoDB
    const order = await this.orderService.createOrder(orderData);
    // Publish the order to the exchange
    this.amqpConnection.publish<orderCreatedEvent>('BALLpuntcom', 'order-created', {pattern: 'order-created', payload: order});

    return order;
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved orders',
    type: Order,
    isArray: true,
  })
  async getOrders() {
    // Add to the mongoDB
    const orders = await this.orderService.getOrders();

    // Publish the order to the exchange
    return orders;
  }
}