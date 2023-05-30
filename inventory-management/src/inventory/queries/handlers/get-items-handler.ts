import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetItemsQuery } from '../impl/get-items-query';
import { InventoryRepository} from '../../repository/inventory.repository';


@QueryHandler(GetItemsQuery)
export class GetItemsHandler implements IQueryHandler<GetItemsQuery> {
  constructor(private readonly repository: InventoryRepository) {}

  async execute(query: GetItemsQuery) {
    return this.repository.findAssortmentItemsByLimit(query.amountOfItems);
  }
}