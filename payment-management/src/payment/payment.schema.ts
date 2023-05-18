import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop()
  customer: string;

  @Prop()
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);