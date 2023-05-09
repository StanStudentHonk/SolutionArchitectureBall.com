
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Order from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
 
@Injectable()
export class OrderService {
  constructor(
    // @InjectRepository(Order)
    // private orderRepository: Repository<Order>,
  ) {}
 
  async CreateOrder(order: CreateOrderDto) {
    
    return order;
  }
}