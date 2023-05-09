import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE', // This name will be used to inject the client proxy
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:root@localhost:5672'],
          queue: 'order-created',
          queueOptions: { durable: false },
        },
      },
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
