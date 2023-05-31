import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
