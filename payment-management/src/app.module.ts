import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
'../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(
    ),
    PaymentModule
  ],
})
export class AppModule {}
