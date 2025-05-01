import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exam } from '../schemas/exam';
import { Model } from 'mongoose';
import { CacheService } from 'src/common/services/cache.service';
import { ExamDto } from '../dtos/exam-dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    private cacheService: CacheService,
  ) {}

  async createExam(examDto: ExamDto) {
    const exam = new this.examModel({
      ...examDto,
    });

    const result = await this.cacheService.writeDataWithStore({
      cacheKey: ['id'],
      query: async () => await exam.save(),
    });

    return result;
  }

  async getExamById(examId: string) {
    return await this.cacheService.getQueryWithCacheStore<Exam>({
      cacheKey: {
        getKey: 'id',
        setKey: ['id'],
      },
      query: async () => await this.examModel.findById(examId),
      cacheTtl: 12000,
    });
  }

  async deleteExamById(examId: string) {
    await this.examModel.deleteOne({ id: examId });
    await this.cacheService.deleteData(examId);
  }
}
