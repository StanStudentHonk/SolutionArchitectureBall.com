import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Customer } from './customer.schema';
import { Item, ItemSchema } from './item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

  @Prop({ required: true })
  customer: Customer;

  @Prop(
    {
      type: [ItemSchema],
      required: true,
    }
  )
  items: Item[];

  @Prop({default: Date.now})
  orderDate: Date;
  @Prop()
  deliveryAdress: string;
  @Prop({default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) })
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);