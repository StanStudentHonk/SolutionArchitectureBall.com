import {Module} from '@nestjs/common';
import configuration from 'config/configuration';
import {MongooseModule} from '@nestjs/mongoose';
import {Customer, CustomerSchema} from './schemas/customer.schema';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {QuestionAndAnswerService} from "./questionAndAnswer.service";
import {QuestionAndAnswerController} from "./questionAndAnswer.controller";
import {Question, QuestionSchema} from "./schemas/questionSchema";
import {CustomerServiceEmployee, CustomerServiceEmployeeSchema} from "./schemas/customerServiceEmployee.schema";

'../config/configuration';

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'BALLpuntcom',
                    type: 'topic',
                },
            ],
            uri: configuration.rabbitmq.host,
        }),
        MongooseModule.forRoot(configuration.mongodb.read, {
            connectionName: 'questions-read',
        }),
        MongooseModule.forRoot(configuration.mongodb.write, {
            connectionName: 'questions-write',
        }),
        MongooseModule.forFeature([{
            name: CustomerServiceEmployee.name,
            schema: CustomerServiceEmployeeSchema
        }], 'questions-read'),
        MongooseModule.forFeature([{
            name: CustomerServiceEmployee.name,
            schema: CustomerServiceEmployeeSchema
        }], 'questions-write'),
        MongooseModule.forFeature([{name: Customer.name, schema: CustomerSchema}], 'questions-read'),
        MongooseModule.forFeature([{name: Customer.name, schema: CustomerSchema}], 'questions-write'),
        MongooseModule.forFeature([{name: Question.name, schema: QuestionSchema}], 'questions-read'),
        MongooseModule.forFeature([{name: Question.name, schema: QuestionSchema}], 'questions-write'),
        EventEmitterModule.forRoot()
    ],
    controllers: [QuestionAndAnswerController],
    providers: [QuestionAndAnswerService],
})
export class QuestionAndAnswerModule {
}
