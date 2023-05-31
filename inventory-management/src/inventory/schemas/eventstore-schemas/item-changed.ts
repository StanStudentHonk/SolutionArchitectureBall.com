import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supplier } from '../write-schemas/supplier.schema';
import { ItemSize } from '../structs/size.enum';

export type ItemChangedDocument = HydratedDocument<ItemChanged>;

@Schema()
export class ItemChanged {

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
}

export const ItemStockChangedSchema = SchemaFactory.createForClass(ItemChanged);