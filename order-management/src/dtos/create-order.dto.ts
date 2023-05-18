import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateOrderBase {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  customer: string;
}

export class CreateOrderDto extends PartialType(CreateOrderBase) {}