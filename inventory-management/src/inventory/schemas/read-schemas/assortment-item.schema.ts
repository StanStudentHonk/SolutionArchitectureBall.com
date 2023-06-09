import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supplier } from '../write-schemas/supplier.schema';
import { ItemSize } from '../structs/size.enum';

export type AssortmentItemDocument = HydratedDocument<AssortmentItem>;

@Schema()
export class AssortmentItem {

  @Prop()
  name: string;

  @Prop()
  itemCode: string;

  @Prop()
  supplier: Supplier

  @Prop()
  size: ItemSize;

  @Prop()
  price: number;

  @Prop()
  amount: number;
}

export const AssortmentItemSchema = SchemaFactory.createForClass(AssortmentItem);