import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InventoryRepository } from '../../repository/inventory.repository';
import { GetItemsQuery } from '../impl/get-items-highest-stock.query';


@QueryHandler(GetItemsQuery)
export class GetItemsHandler implements IQueryHandler<GetItemsQuery> {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(query: GetItemsQuery) {
    return this.repository.findAssortmentItemsByLimit(query.amountOfItems);
  }
}