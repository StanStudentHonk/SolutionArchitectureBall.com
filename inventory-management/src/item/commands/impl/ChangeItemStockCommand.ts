export class ChangeItemStockCommand {
    constructor(
      public readonly itemId: string,
      public readonly supplierId: string,
      public readonly amount: string,
      public readonly warehouseId: string,
    ) {}
  }