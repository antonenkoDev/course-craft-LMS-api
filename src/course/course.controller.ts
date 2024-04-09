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
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly courseService: CourseService) {
    this.logger.log('COURSE CONTROLLER initialized');
  }

  @Post('/')
  async addCourse(@Body() dto: CreateCourseDto) {
    return await this.courseService.create(dto);
  }

  @Post('/all')
  async getAllCourses(@Body() options?: { isDeleted: boolean }) {
    return await this.courseService.findAll(options);
  }

  @Get('/:id')
  async getCourse(@Param('id') courseId: string) {
    return await this.courseService.findById(courseId);
  }

  @Patch('/archive/:id')
  async toMarkAsArchive(@Param('id') courseId: string) {
    return await this.courseService.archive(courseId);
  }

  @Patch('/unarchive/:id')
  async toMarkAsUnarchive(@Param('id') courseId: string) {
    return await this.courseService.unArchive(courseId);
  }

  @Delete('/:id')
  async removeCourse(@Param('id') courseId: string) {
    return await this.courseService.delete(courseId);
  }
}
