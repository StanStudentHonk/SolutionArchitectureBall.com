import { RabbitMQEvent } from '../common/rabbitMQEvent.event';
import { customerOrderedEvent } from './customer-ordered.event';
import { itemOrderedEvent } from './item-ordered.event';

export class orderCreatedEvent {
  constructor(
    public readonly _id : string,
    public readonly items: itemOrderedEvent[],
    public readonly customer : customerOrderedEvent,
    public readonly orderDate : Date,
    public readonly deliveryDate : Date,
    public readonly deliveryAdress : string
  ) {}
}
