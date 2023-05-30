import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WareHouseLocationDocument = HydratedDocument<WareHouseLocation>;

@Schema()
export class WareHouseLocation {

  @Prop()
  wareHouse: string;

  @Prop()
  rack: string;

  @Prop()
  shelve: string;
  
  @Prop()
  palletRack: string;
}

export const WareHouseLocationSchema = SchemaFactory.createForClass(WareHouseLocation);