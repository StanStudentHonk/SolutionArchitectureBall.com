import { InventoryChangedByOrderRabitMQHandler } from './inventory-change-by-order/emit-rabitMQ.handler';
import { InventoryChangedByOrderUpdateEventStoreHandler } from './inventory-change-by-order/update-eventstore.handler';
import { InventoryChangedByOrderUpdateReadInventoryHandler } from './inventory-change-by-order/emit-stock-changed-event.handler';
import { ItemStockChangedUpdateItemCollectionHandler } from './item-stock-changed/update-item-collection';
import { OrderCreatedHandler } from './order-created-handler/order-created.handler';

export const EventHandlers = [
  InventoryChangedByOrderUpdateEventStoreHandler,
  InventoryChangedByOrderUpdateReadInventoryHandler,
  InventoryChangedByOrderRabitMQHandler,
  ItemStockChangedUpdateItemCollectionHandler,
  OrderCreatedHandler
];
