import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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

    @Prop({ type: Types.ObjectId, ref: 'Customer' })
    customerId: Types.ObjectId;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);