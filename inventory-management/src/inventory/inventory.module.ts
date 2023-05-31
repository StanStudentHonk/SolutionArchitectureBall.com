import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'config/configuration';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { ItemController } from './item.controller';
import { QueryHandlers } from './queries/handlers';
import { InventoryRepository } from './repository/inventory.repository';
import { AssortmentItem, AssortmentItemSchema } from './schemas/read-schemas/assortment-item.schema';
import { Item, ItemSchema } from './schemas/write-schemas/item.schema';
import { InventoryService } from './services/inventory.service';
import { InventoryEventRepository } from './repository/inventory-event.repository';
import { ItemStockChanged, ItemStockChangedSchema } from './schemas/eventstore-schemas/item-stock-changed.schema';


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
        connectionName: 'assortmentItems-read',
        }),
        MongooseModule.forRoot(configuration.mongodb.eventStore, {
          connectionName: 'itemStockChangeds-read',
        }),
        MongooseModule.forRoot(configuration.mongodb.write, {
        connectionName: 'items-write',
        }),
        MongooseModule.forFeature(
        [{ name: AssortmentItem.name, schema: AssortmentItemSchema }],
        'assortmentItems-read',
        ),
        MongooseModule.forFeature(
          [{ name: ItemStockChanged.name, schema: ItemStockChangedSchema }],
          'itemStockChangeds-read',
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
        InventoryService, 
        InventoryRepository,
        InventoryEventRepository,
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers,
    ],
})
export class InventoryModule {}
