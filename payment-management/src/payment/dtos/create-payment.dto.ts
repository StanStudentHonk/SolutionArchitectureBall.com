import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

class CreatePaymentBase {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  amount: number;
}

export class CreatePaymentDto extends PartialType(CreatePaymentBase) {}