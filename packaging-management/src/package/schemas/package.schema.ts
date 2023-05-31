import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { Item, ItemSchema } from './item.schema';

@Schema()
export class Package {
  //Adress
  @Prop({ required: true })
  Address: string;

  @Prop(
    {
      type: [ItemSchema],
      required: true,
    }
  )
  items: Map<Item, number>;
  
  //Warehouse
  @Prop({ required: true })
  Warehouse: string;

  //WeightInKg
  @Prop({ required: true })
  WeightInKg: number;

  //Size enum
  @Prop({ required: true })
  Size: Size;
}

export type PackageDocument = Package & Document;
export const PackageSchema = SchemaFactory.createForClass(Package);