import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type CustomerServiceEmployeeDocument = HydratedDocument<CustomerServiceEmployee>;

@Schema()
export class CustomerServiceEmployee {
    @Prop()
    email: string;

    @Prop()
    name: string;
}

export const CustomerServiceEmployeeSchema = SchemaFactory.createForClass(CustomerServiceEmployee);