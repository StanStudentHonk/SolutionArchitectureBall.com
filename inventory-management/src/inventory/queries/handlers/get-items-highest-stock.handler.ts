import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InventoryEventRepository } from 'src/inventory/repository/inventory-event.repository';
import { GetItemsHighestStockQuery } from '../impl/get-items.query';


@QueryHandler(GetItemsHighestStockQuery)
export class GetItemsHighestStockHandler implements IQueryHandler<GetItemsHighestStockQuery> {
  constructor(private readonly repository: InventoryEventRepository) {}

  async execute(query: GetItemsHighestStockQuery) {
    return this.repository.getHighestStockAmount(query.itemId)
  }
}