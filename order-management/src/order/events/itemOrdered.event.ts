import { Prop } from "@nestjs/mongoose";
import { Customer } from "../schemas/customer.schema";
import { Order } from "../schemas/order.schema";
import { RabbitMQEvent } from "./rabbitMQEvent.event";
import { ItemSchema } from "../schemas/item.schema";

export class itemOrderedEvent {
    constructor(
        public _id : string,
        public amount : number,
        public price : number
    )
  {}
}