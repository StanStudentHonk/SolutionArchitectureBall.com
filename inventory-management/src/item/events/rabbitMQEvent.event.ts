export abstract class RabbitMQEvent {
    public readonly pattern: string
    public payload : any
  }