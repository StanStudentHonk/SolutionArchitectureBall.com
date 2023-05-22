import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransportModule } from './transport/transport.module';
'../config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot(
    ),
    TransportModule
  ],
})
export class AppModule {}
