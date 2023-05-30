import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { WareHouseStock, WareHouseStockSchema } from './warehouseStock.schema';
import { Supplier } from './supplier.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {

  @Prop()
  name: string;

  @Prop()
  itemCode: string;

  @Prop()
  supplier: Supplier

  @Prop(
    {
      type: [WareHouseStockSchema],
      required: true,
    }
  )
  wareHouseStock: WareHouseStock[];

  @Prop()
  size: ItemSize;

  @Prop()
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);