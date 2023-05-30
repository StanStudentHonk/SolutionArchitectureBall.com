
export class AddItemStockToInventoryCommand {
    constructor(
      public readonly itemId: string,
      public readonly warehouseStockId : string,
      public readonly amountToAdd : number 
    ) {}
  }