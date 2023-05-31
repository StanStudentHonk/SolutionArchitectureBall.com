import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Customer } from './customer.schema';
import { Item, ItemSchema } from './item.schema';
import {ApiProperty} from "@nestjs/swagger";

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

  @ApiProperty()
  @Prop()
  customer: Customer;

  @ApiProperty({ type: [Item] })
  @Prop(    {
    type: [ItemSchema],
    required: true,
  })
  items: Item[];

  @ApiProperty()
  @Prop({default: Date.now})
  orderDate: Date;
  @ApiProperty()
  @Prop()
  deliveryAdress: string;
  @ApiProperty()
  @Prop({default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) })
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);