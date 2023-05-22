import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

import { Package, ItemSchema as PackageSchema } from './package.schema';

export type TransportDocument = HydratedDocument<TransportCompany>;

@Schema()
export class TransportCompany {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  PricePerKg: number; 

  @Prop({ required: true })
  PriceSmallPackage: number; 
  
  //PriceMediumPackage
  @Prop({ required: true })
  PriceMediumPackage: number;

  //PriceLargePackage
  @Prop({ required: true })
  PriceLargePackage: number;

}

export const TransportCompanySchema = SchemaFactory.createForClass(TransportCompany);