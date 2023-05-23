import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  totalPrice: number;

  @Prop()
  orderDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);