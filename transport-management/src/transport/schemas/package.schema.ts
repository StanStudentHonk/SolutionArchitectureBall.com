import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { TransportCompany } from './transportCompany.schema';

export type PackageDocument = HydratedDocument<Package>;

@Schema()
export class Package {
  //Adress
  @Prop({ required: true })
  Address: string;

  //WeightInKg
  @Prop({ required: true })
  WeightInKg: number;

  //Size enum
  @Prop({ required: true })
  Size: Size;

  //EstimatedDeliveryDate
  @Prop({ required: true })
  EstimatedDeliveryDate: Date;

  //TransportCompany
  @Prop()
  TransportCompany: TransportCompany;

  @Prop({ required: true })
  TransportPrice: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);