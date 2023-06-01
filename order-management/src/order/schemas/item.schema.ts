import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes, Types } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {

  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId

  @Prop()
  name: string;

  @Prop()
  itemCode: string;

  @Prop()
  size: ItemSize;

  @Prop()
  weight: number;

  @Prop()
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);