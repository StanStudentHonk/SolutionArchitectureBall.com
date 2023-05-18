import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from './create-order.dto';
import Order from './order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() orderData: CreateOrderDto) {
    // Replace this function call with your actual implementation to create the order in DB
    const order = await Promise.resolve({ id: 1, name: orderData.name, customer: orderData.customer });
    console.log("Ello this is a new version!!")
    // Add to the mongoDB
    await this.orderService.createOrder(orderData);

    // Publish the order to the exchange
    this.amqpConnection.publish<Order>('BALLpuntcom', 'order-created', order);
    return order;
  }


  @EventPattern('order-created')
  async handleCreatedOrder(order: any) {
    console.log(order) // Replace with your function to update the inventory
  }
}