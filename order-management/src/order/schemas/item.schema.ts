import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  itemCode: string;

  @ApiProperty()
  @Prop()
  size: ItemSize;

  @ApiProperty()
  @Prop()
  amount: number;

  @ApiProperty()
  @Prop()
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);