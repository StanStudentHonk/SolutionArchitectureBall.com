import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {

  @Prop()
  name: string;

  @Prop()
  itemCode: string;

  @Prop()
  size: ItemSize;

  @Prop()
  amount: number;

  @Prop()
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);