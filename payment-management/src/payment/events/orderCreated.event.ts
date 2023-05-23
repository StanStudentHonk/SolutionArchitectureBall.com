import { Order } from "../schemas/order.schema";

export class orderCreatedEvent {
    public readonly order: Order
}