import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionDto } from '../dtos/question-dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Authorize } from 'src/common/decorators/authorize.decorator';
import { UserPermission } from 'src/constants/permissions.constant';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { QuestionsService } from '../services/questions.service';
import { ExamService } from '../services/exam.service';

@Controller('question')
export class QuestionController {
  constructor(
    private questionService: QuestionsService,
    private examService: ExamService,
  ) {}

  @Post(':eid')
  @ApiBearerAuth('access-token')
  @Authorize(UserPermission.ADMIN)
  @UseGuards(AuthorizationGuard)
  async createQuestion(
    @Param(':eid') examId: string,
    @Body() questionDto: QuestionDto,
  ) {
    const result = await this.questionService.addQuestion(questionDto, examId);

    return result;
  }

  @Get(':eid')
  @ApiBearerAuth('access-token')
  @Authorize(UserPermission.ADMIN)
  @UseGuards(AuthorizationGuard)
  async getQuestionsByExamId(@Param(':eid') examId: string) {
    const result = await this.questionService.getQuestionByExamId(examId);
    return result;
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Authorize(UserPermission.ADMIN)
  @UseGuards(AuthorizationGuard)
  async deleteQuestion(@Param(':id') id: string) {
    await this.questionService.deleteQuestionById(id);
    return 'deleted';
  }
}
