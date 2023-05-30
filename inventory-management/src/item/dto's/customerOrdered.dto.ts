import { RabbitMQEvent } from "../events/rabbitMQEvent.event";

export class customerOrderedDTO {
       constructor(
      public readonly _id: string,
      public readonly name: string,
      public readonly email: string,
    ) {}
}