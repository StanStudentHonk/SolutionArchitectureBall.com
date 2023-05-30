import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Currency } from 'src/currency/currency.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop()
    method: paymentMethod;

    @Prop()
    amount: number;

    @Prop({default: () => Date.now()})
    paymentDate: Date;

    @Prop({ type: Types.ObjectId, ref: 'Order' })
    orderId: Types.ObjectId;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);