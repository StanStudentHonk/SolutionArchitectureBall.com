import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { WarehouseLocation } from './WarehouseLocation.Schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {

  @Prop()
  name: string;

  @Prop()
  itemCode: string;

  @Prop()
  warehouseLocation: WarehouseLocation;

  @Prop()
  size: Size;

  @Prop()
  weight: number;

  @Prop()
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);