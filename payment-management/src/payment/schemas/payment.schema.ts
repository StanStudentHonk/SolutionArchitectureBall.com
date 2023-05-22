import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop()
    method: paymentMethod;

    @Prop()
    amount: number;

    @Prop({default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) })
    paymentDate: Date;

    @Prop({ type: Types.ObjectId, ref: 'Order' })
    orderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Customer' })
    customerId: Types.ObjectId;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);