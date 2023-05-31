import { InventoryChangedByOrderRabitMQHandler } from './inventory-change-by-order/emit-rabitMQ.handler';
import { InventoryChangedByOrderUpdateReadInventoryHandler } from './inventory-change-by-order/emit-stock-changed-event.handler';
import { ItemStockChangedUpdateEventStoreHandler } from './item-stock-changed/update-eventstore.handler';
import { ItemStockChangedUpdateItemCollectionHandler } from './item-stock-changed/update-item-collection.handler';
import { OrderCreatedHandler } from './order-created-handler/order-created.handler';

export const EventHandlers = [
  ItemStockChangedUpdateEventStoreHandler,
  InventoryChangedByOrderUpdateReadInventoryHandler,
  InventoryChangedByOrderRabitMQHandler,
  ItemStockChangedUpdateItemCollectionHandler,
  OrderCreatedHandler
];
