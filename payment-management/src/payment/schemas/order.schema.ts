import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  totalPrice: number;

  @Prop()
  orderDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  customerId: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
