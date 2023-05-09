import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from './create-order.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import Order from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Post()
  async createOrder(@Body() orderData: CreateOrderDto) {
    // Replace this function call with your actual implementation to create the order in DB
    const order = await Promise.resolve({ id: 1, name: orderData.name, customer: orderData.customer });

    this.amqpConnection.publish<Order>('BALLpuntcom', 'order-created', order);
    return order;
  }

  @EventPattern('order-created')
  async handleCreatedOrder(order: any) {
    console.log(order) // Replace with your function to update the inventory
  }
}