import { customerOrderedDTO } from "./customerOrdered.dto";
import { itemOrderedDTO } from "./itemOrdered.dto";

export class orderCreatedDTO {
       constructor(
      public readonly _id : string,
      public readonly items: itemOrderedDTO[],
      public readonly customer : customerOrderedDTO,
      public readonly orderDate : Date,
      public readonly deliveryDate : Date,
      public readonly deliveryAdress : string
    ) {}
}