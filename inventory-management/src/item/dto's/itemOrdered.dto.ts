import { RabbitMQEvent } from "../events/rabbitMQEvent.event";

export class itemOrderedDTO {
       constructor(
      public readonly _id: string,
      public readonly amount: number,
    ) {}
}