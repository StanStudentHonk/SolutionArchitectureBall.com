import { orderCreatedEvent } from "src/inventory/events/impl/order-created/order-created.event";

export class ChangeInventoryByOrderCommand {
    constructor(
      public readonly order: orderCreatedEvent,
    ) {}
  }