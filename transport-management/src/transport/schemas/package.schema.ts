import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { TransportCompany } from './transportCompany.schema';

export type ItemDocument = HydratedDocument<Package>;

@Schema()
export class Package {
  //Adress
  @Prop({ required: true })
  Adress: string;

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
}

export const ItemSchema = SchemaFactory.createForClass(Package);