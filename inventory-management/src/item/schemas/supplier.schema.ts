import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema()
export class Supplier {

  @Prop()
  name: string;

  @Prop()
  email: string
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);