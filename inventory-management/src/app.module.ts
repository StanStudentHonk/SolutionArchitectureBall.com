import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { InventoryService } from './inventory.service';
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
  controllers: [AppController],
  providers: [AppService, InventoryService],
})
export class AppModule {}
