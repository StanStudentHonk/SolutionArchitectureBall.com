import { itemOrderedDTO } from "src/item/dto's/itemOrdered.dto";
import { orderCreatedDTO } from "src/item/dto's/orderCreated.dto";
import { Item } from "src/item/schemas/item.schema";
import { Order } from "src/item/schemas/order.interface";

export class ChangeItemStockByOrderCommand {
    constructor(
      public readonly order: orderCreatedDTO,
    ) {}
  }