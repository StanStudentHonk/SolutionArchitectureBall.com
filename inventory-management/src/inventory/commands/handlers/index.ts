import { AddItemStockToInventoryHandler } from "./add-item-stock-to-inventory.handler";
import { AddItemToInventoryHandler } from "./add-item-to-inventory.handler";
import { ChangeInventoryByOrderHandler } from "./change-inventory-by-order.handler";


export const CommandHandlers = [
    ChangeInventoryByOrderHandler, 
    AddItemToInventoryHandler,
    AddItemStockToInventoryHandler
];