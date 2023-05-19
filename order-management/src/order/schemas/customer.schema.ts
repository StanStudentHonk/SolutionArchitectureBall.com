import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {

  @Prop()
  name: string;
  @Prop()
  email: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
