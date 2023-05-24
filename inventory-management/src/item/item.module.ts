import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemRepository } from './repository/item.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';


@Module({
    imports : [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
              {
                name: 'BALLpuntcom',
                type: 'topic',
              },
            ],
            uri: configuration.rabbitmq.host,
          }),
        MongooseModule.forRoot(configuration.mongodb.read, {
        connectionName: 'items-read',
        }),
        MongooseModule.forRoot(configuration.mongodb.write, {
        connectionName: 'items-write',
        }),
        MongooseModule.forFeature(
        [{ name: Item.name, schema: ItemSchema }],
        'items-read',
        ),
        MongooseModule.forFeature(
        [{ name: Item.name, schema: ItemSchema }],
        'items-write',
        ),
        EventEmitterModule.forRoot(),
        CqrsModule
    ],
    controllers: [ItemController],
    providers: [
        ItemService, 
        ItemRepository,
        ...CommandHandlers,
        // ...EventHandlers,
        // ...QueryHandlers,
    ],
})
export class ItemModule {}
