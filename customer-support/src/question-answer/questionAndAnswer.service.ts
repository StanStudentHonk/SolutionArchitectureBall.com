import {RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import {Injectable} from '@nestjs/common';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {RabbitMQEvent} from './events/rabbitMQEvent.event';
import {Question} from "./schemas/questionSchema";

@Injectable()
export class QuestionAndAnswerService {
    constructor(
        private eventEmitter: EventEmitter2,
        @InjectModel(Question.name, 'questions-read')
        private readonly questionReadModel: Model<Question>,
        @InjectModel(Question.name, 'questions-write')
        private readonly questionWriteModel: Model<Question>,
    ) {
    }

    async createQuestion(question: Question): Promise<Question> {
        const newQuestion = new this.questionWriteModel(question);
        return newQuestion.save();
    }

    async getQuestions(): Promise<Question[]> {
        return this.questionReadModel.find().exec();
    }

    @RabbitSubscribe({
        exchange: 'BALLpuntcom',
        routingKey: ['question-asked'],
        queue: 'question',
    })
    public async onEventFromQuestionQueue(event: RabbitMQEvent) {
        console.log(event + event.pattern)
        this.eventEmitter.emit(
            event.pattern,
            event.payload
        );
    }

    // @OnEvent('question-asked')
    // handleQuestionAskedEvent(payload: Question) {
    //     const newQuestion = new this.questionWriteModel(payload);
    //     newQuestion.save();
    // }
}
