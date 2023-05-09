import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';


@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'BALLpuntcom',
          type: 'topic',
        },
      ],
      uri: 'amqp://rabbit:root@localhost:5672',
    }),
    ConfigModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
