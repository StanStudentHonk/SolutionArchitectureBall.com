import { Item } from "src/inventory/schemas/write-schemas/item.schema";

export class AddItemToInventoryCommand {
    constructor(
      public readonly item: Item,
    ) {}
  }