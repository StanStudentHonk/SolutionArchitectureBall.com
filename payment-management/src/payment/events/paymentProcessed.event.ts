import Payment from "../payment.entity";
import { RabbitMQEvent } from "./rabbitMQEvent.event";

export class PaymentProcessedEvent extends RabbitMQEvent{
    public readonly payload: Payment
  }