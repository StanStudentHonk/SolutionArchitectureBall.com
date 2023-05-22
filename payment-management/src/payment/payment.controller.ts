import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import Payment from './payment.entity';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly paymentService: PaymentService) {}
  @Post()
  async processPayment(@Body() paymentData: Payment) {
    // Add payment to the mongoDB
    const payment = await this.paymentService.createPayment(paymentData);

    // Publish the event to the exchange
    this.amqpConnection.publish<Payment>('BALLpuntcom', 'payment-processed', payment);
    return payment;
  }

  @Get()
  async getPayments() {
    // Get payments from the mongoDB
    const payments = await this.paymentService.getPayments();

    // Return the payments
    return payments;
  }

}