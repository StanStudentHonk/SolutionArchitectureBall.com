import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Item, ItemSchema } from './item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop(
    {
      type: [ItemSchema],
      required: true,
    }
  )
  items: Map<Item, number>;

  @Prop({default: Date.now})
  orderDate: Date;

  @Prop()
  deliveryAddress: string;
  
  @Prop({default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) })
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);