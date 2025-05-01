import { Module } from '@nestjs/common';
import { ExamService } from './services/exam.service';
import { QuestionsService } from './services/questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam';
import { Question, QuestionSchema } from './schemas/question';
import { ExamController } from './controllers/exam.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: ExamSchema,
        name: Exam.name,
      },
      {
        schema: QuestionSchema,
        name: Question.name,
      },
    ]),
  ],
  providers: [ExamService, QuestionsService],
  controllers: [ExamController],
})
export class ExamsModule {}
