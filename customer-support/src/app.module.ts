import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {QuestionAndAnswerModule} from './question-answer/questionAndAnswer.module';

'../config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot(
        ),
        QuestionAndAnswerModule
    ],
})
export class AppModule {
}
