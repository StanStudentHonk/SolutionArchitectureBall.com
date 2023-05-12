import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as config from "../config/config.json";



@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'BALLpuntcom',
          type: 'topic',
        },
      ],
      uri: config.rabbitmq.host,
    }),
    ConfigModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
