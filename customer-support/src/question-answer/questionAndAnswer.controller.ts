import {AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import {Body, Controller, Get, Post} from '@nestjs/common';
import {QuestionAndAnswerService} from "./questionAndAnswer.service";

@Controller('questions')
export class QuestionAndAnswerController {
    constructor(private readonly amqpConnection: AmqpConnection, private readonly questionAndAnswerService: QuestionAndAnswerService) {
    }

}