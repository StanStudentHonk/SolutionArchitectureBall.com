import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WareHouseLocation } from './warehouseLocation.schema';

export type WareHouseStockDocument = HydratedDocument<WareHouseStock>;

@Schema()
export class WareHouseStock {

  @Prop()
  wareHouseLocation: WareHouseLocation;

  @Prop()
  amount: number;
}

export const WareHouseStockSchema = SchemaFactory.createForClass(WareHouseStock);