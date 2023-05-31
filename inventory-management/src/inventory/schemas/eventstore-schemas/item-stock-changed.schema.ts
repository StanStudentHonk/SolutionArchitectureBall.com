import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supplier } from '../write-schemas/supplier.schema';
import { ItemChanged } from './item-changed';
import { WarehouseStockChanged, WarehouseStockChangedSchema } from './warehouse-stock-changed.schema';

export type ItemStockChangedDocument = HydratedDocument<ItemStockChanged>;

@Schema()
export class ItemStockChanged {

  @Prop()
  item: ItemChanged;

  @Prop(
    {
      type: [WarehouseStockChangedSchema],
      required: true,
    }
  )
  updatedWareHouses: WarehouseStockChanged[];
}

export const ItemStockChangedSchema = SchemaFactory.createForClass(ItemStockChanged);