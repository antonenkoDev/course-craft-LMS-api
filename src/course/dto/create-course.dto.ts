import { OmitType } from '@nestjs/swagger';
import { Course } from '../entities/course.entity';
import { IsEmail, IsString } from 'class-validator';

export class CreateCourseDto extends OmitType(Course, ['uuid']) {
  @IsString({ message: "'title' field must be string" })
  title: string;

  @IsString({ message: "'description' field must be string" })
  description: string;

  @IsEmail()
  userOwnerEmail: string;
}
