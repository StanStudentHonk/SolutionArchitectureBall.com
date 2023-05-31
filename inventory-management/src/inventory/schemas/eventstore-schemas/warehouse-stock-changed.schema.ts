import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Supplier } from '../write-schemas/supplier.schema';
import { WareHouseLocation } from '../write-schemas/warehouse-location.schema';

export type WarehouseStockChangedDocument = HydratedDocument<WarehouseStockChanged>;

@Schema()
export class WarehouseStockChanged {

  @Prop()
  amountRemoved: number;

  @Prop()
  wareHouseLocation : WareHouseLocation
}

export const WarehouseStockChangedSchema = SchemaFactory.createForClass(WarehouseStockChanged);