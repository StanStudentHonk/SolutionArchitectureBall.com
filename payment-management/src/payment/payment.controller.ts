import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import Payment from './payment.entity';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly amqpConnection: AmqpConnection, private readonly paymentService: PaymentService) {}
  @Post()
  async createPayment(@Body() paymentData: CreatePaymentDto) {
    // Replace this function call with your actual implementation to create the payment in DB
    const payment = await Promise.resolve({ id: 1, customer: paymentData.customer, amount: paymentData.amount });
    console.log("Ello this is a new version!!")
    // Add to the mongoDB
    await this.paymentService.createPayment(paymentData);

    // Publish the payment to the exchange
    this.amqpConnection.publish<Payment>('BALLpuntcom', 'payment-created', payment);
    return payment;
  }


  @EventPattern('payment-created')
  async handleCreatedPayment(payment: any) {
    console.log(payment) // Replace with your function to update the payment in DB
  }
}