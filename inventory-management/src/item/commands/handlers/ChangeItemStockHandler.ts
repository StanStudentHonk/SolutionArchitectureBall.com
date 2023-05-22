import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ChangeItemStockCommand } from '../impl/ChangeItemStockCommand';

@CommandHandler(ChangeItemStockCommand)
export class KillDragonHandler implements ICommandHandler<ChangeItemStockCommand> {
  constructor(
    private readonly repository: HeroRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ChangeItemStockCommand) {
    console.log("changeStockCommand");

    const { heroId, dragonId } = command;
    const hero = this.publisher.mergeObjectContext(
      await this.repository.findOneById(+heroId),
    );
    hero.killEnemy(dragonId);
    hero.commit();
  }
}