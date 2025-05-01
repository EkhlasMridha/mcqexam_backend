import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from '../schemas/question';
import { Model } from 'mongoose';
import { CacheService } from 'src/common/services/cache.service';
import { QuestionDto } from '../dtos/question-dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private cacheService: CacheService,
  ) {}

  async addQuestion(questionDto: QuestionDto, examId: string) {
    const question = new this.questionModel({
      ...questionDto,
      exam_id: examId,
    });
    const result = await this.cacheService.writeDataWithStore({
      query: () => question.save(),
      cacheKey: ['id'],
      ttl: 12000,
    });

    return result;
  }

  async addQuestionInBulk(questionDto: QuestionDto[], examId: string) {
    const dataList = questionDto.map((item) => ({
      ...item,
      exam_id: examId,
    }));
    const result = await this.cacheService.writeBulkDataWithStore({
      query: async () => await this.questionModel.insertMany(dataList),
      cacheKey: examId,
      ttlInMs: 12000,
    });

    return result;
  }

  async deleteQuestionById(questionId: string) {
    await this.questionModel.deleteOne({ id: questionId });
    await this.cacheService.deleteData(questionId);
  }

  async deleteQuestionsByExamId(examId: string) {
    await this.questionModel.deleteMany({ exam_id: examId });
    await this.cacheService.deleteData(examId);
  }
}
