import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supplier } from './supplier.schema';
import { WareHouseStock, WareHouseStockSchema } from './warehouse-stock.schema';

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