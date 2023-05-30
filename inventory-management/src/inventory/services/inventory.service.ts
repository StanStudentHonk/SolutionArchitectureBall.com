import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemStockToInventoryCommand } from '../commands/impl/add-item-stock-to-inventory-supplier.command';
import { AddItemToInventoryCommand } from '../commands/impl/add-item-to-inventory.command';
import { GetItemsQuery } from '../queries/impl/get-items-query';
import { Item } from '../schemas/write-schemas/item.schema';

@Injectable()
export class InventoryService {
    constructor(
      private commandBus: CommandBus, 
      private queryBus : QueryBus,
    ) {}

    addItemToInventory(item: Item) { 
      return this.commandBus.execute(new AddItemToInventoryCommand(item));
    };

    addItemStockToInventory(command: AddItemStockToInventoryCommand) { 
      return this.commandBus.execute(new AddItemStockToInventoryCommand(command.itemId, command.warehouseStockId, command.amountToAdd));
    };

    getItemsFromCollection() { 
      return this.queryBus.execute(new GetItemsQuery(20));
    };
}
 