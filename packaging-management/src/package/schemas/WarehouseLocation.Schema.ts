import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type WarehouseLocationDocument = HydratedDocument<WarehouseLocation>;

@Schema()
export class WarehouseLocation {

  @Prop()
  wareHouse: string;

  @Prop()
  palletRack: string;

  @Prop()
  rack: Size;

  @Prop()
  shelve: number;
}

export const WarehouseLocationSchema = SchemaFactory.createForClass(WarehouseLocation);