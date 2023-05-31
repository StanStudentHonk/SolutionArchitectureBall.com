import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
    @Prop()
    question: string;

    @Prop()
    answer: string;

}

export const QuestionSchema = SchemaFactory.createForClass(Question);