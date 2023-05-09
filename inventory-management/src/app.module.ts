import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { InventoryService } from './inventory.service';
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
  controllers: [AppController],
  providers: [AppService, InventoryService],
})
export class AppModule {}
