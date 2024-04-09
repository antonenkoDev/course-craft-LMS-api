import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lessons')
export class LessonController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly lessonService: LessonService) {
    this.logger.log('LESSON CONTROLLER initialized');
  }

  @Post('/')
  async addLesson(@Body() dto: CreateLessonDto) {
    return await this.lessonService.create(dto);
  }

  @Get('/:id')
  async getCourse(@Param('id') lessonId: string) {
    return await this.lessonService.findById(lessonId);
  }

  @Post('/all')
  async getAllCourses(@Body() options?: { isDeleted: boolean }) {
    return await this.lessonService.findAll(options);
  }

  @Patch('/archive/:id')
  async toMarkAsArchive(@Param('id') courseId: string) {
    return await this.lessonService.archive(courseId);
  }

  @Patch('/unarchive/:id')
  async toMarkAsUnarchive(@Param('id') courseId: string) {
    return await this.lessonService.unArchive(courseId);
  }

  @Delete('/:id')
  async removeCourse(@Param('id') courseId: string) {
    return await this.lessonService.delete(courseId);
  }
}
