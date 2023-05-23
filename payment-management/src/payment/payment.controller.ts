import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentProcessedEvent } from './events/paymentProcessed.event';
import { PaymentService } from './payment.service';
import { Payment } from './schemas/payment.schema';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly paymentService: PaymentService,
  ) {}
  @Post()
  async processPayment(@Body() paymentData: Payment) {
    // Add payment to the mongoDB
    const payment = await this.paymentService.createPayment(paymentData);

    // Publish the event to the exchange
    this.amqpConnection.publish<PaymentProcessedEvent>(
      'BALLpuntcom',
      'payment-made',
      { pattern: 'payment-made', payload: payment },
    );
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
