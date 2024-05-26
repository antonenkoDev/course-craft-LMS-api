import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TenantProvider } from 'src/database/providers/tenant.provider';
import { Auth0Service } from 'src/auth0/auth0.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Enrollment, Course])],
  controllers: [StudentController],
  providers: [StudentService, TenantProvider, Auth0Service]
})
export class StudentModule { }
