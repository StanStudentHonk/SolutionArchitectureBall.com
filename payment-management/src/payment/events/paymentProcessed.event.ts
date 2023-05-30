import { Payment } from "../schemas/payment.schema";
import { RabbitMQEvent } from "./rabbitMQEvent.event";

export class PaymentProcessedEvent extends RabbitMQEvent{
    public readonly payload: Payment
  }