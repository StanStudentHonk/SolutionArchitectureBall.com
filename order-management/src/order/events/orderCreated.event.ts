import { Order } from "../schemas/order.schema";
import { RabbitMQEvent } from "./rabbitMQEvent.event";

export class orderCreatedEvent extends RabbitMQEvent{
      public readonly payload: Order
}