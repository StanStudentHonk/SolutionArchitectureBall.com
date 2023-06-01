import { Prop } from "@nestjs/mongoose";
import { Customer } from "../schemas/customer.schema";
import { itemOrderedEvent } from "./itemOrdered.event";

export class orderCreatedEvent {
      constructor(
            public customer : Customer,
            public items: itemOrderedEvent[],
            public orderDate: Date,
            public deliveryAdress : string,
            public deliveryDate : Date
        )
      {}
}