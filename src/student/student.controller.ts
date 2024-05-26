import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { EnrollDto } from 'src/enrollment/dto/enroll.dto';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly studentsService: StudentService) {
    this.logger.log('COURSE CONTROLLER initialized');
  }

  @Post('enroll')
  @UseGuards(RolesGuard)
  @Roles('admin', 'instructor')
  enrollStudent(@Body() enrollDto: EnrollDto) {
    return this.studentsService.enroll(enrollDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'instructor')
  findAll() {
    return this.studentsService.findAll();
  }
}
