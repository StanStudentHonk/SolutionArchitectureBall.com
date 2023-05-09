import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(@Inject('ORDERS_SERVICE') private client: ClientProxy) {}

  @Post()
  async createOrder(@Body() orderData: CreateOrderDto) {
    // Replace this function call with your actual implementation to create the order in DB
    const order = await Promise.resolve({ id: 1, name: orderData.name, customer: orderData.customer });

    this.client.emit<any>('CreatedOrder', order); // Emit the 'CreatedOrder' event on the queue
    return order;
  }
}