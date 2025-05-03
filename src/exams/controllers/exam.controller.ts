import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ExamService } from '../services/exam.service';
import { ExamDto } from '../dtos/exam-dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Authorize } from 'src/common/decorators/authorize.decorator';
import { UserPermission } from 'src/constants/permissions.constant';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @Authorize(UserPermission.ADMIN)
  @UseGuards(AuthorizationGuard)
  async createExam(@Body() examDto: ExamDto) {
    const result = await this.examService.createExam(examDto);
    return result;
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  async getExamById(@Param(':id') id: string) {
    const result = await this.examService.getExamById(id);
    return result;
  }
}
