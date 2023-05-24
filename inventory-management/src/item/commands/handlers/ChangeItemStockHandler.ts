import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ItemRepository } from 'src/item/repository/item.repository';
import { ChangeItemStockByOrderCommand } from '../impl/ChangeItemStockCommand';
import { itemOrderedDTO } from 'src/item/dto\'s/itemOrdered.dto';


@CommandHandler(ChangeItemStockByOrderCommand)
export class ChangeItemStockByOrderHandler implements ICommandHandler<ChangeItemStockByOrderCommand> {
  constructor(
    private readonly repository: ItemRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ChangeItemStockByOrderCommand) {
    console.log(command.order)
    command.order.items.forEach((item : itemOrderedDTO) =>{
      this.repository.removeItemsByWareHouses(item._id, item.amount)
    })
    console.log("items removed")
  }
}