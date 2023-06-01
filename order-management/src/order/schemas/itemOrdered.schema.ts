import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Item } from './item.schema';

export type ItemOrderedDocument = HydratedDocument<ItemOrdered>;

@Schema()
export class ItemOrdered {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Item',
    required: true,
  })
  item: Item;

  @Prop()
  amount: number;
}

export const ItemOrderedSchema = SchemaFactory.createForClass(ItemOrdered);
