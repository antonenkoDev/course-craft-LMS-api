import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Repository } from 'typeorm';
import { EnrollDto } from 'src/enrollment/dto/enroll.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentsRepository: Repository<Student>,
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    @InjectRepository(Enrollment) private enrollmentsRepository: Repository<Enrollment>,
  ) { }

  async enroll(enrollDto: EnrollDto) {
    const { studentId, courseId } = enrollDto;
    const student = await this.studentsRepository.findOne({
      where: { uuid: studentId },
    });
    const course = await this.coursesRepository.findOne({
      where: { uuid: courseId },
    });

    if (!student || !course) {
      throw new BadRequestException('Student or Course not found');
    }

    const enrollment = new Enrollment();
    enrollment.student = student;
    enrollment.course = course;
    enrollment.enrollmentDate = new Date();
    enrollment.expiryDate = new Date(
      new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
    ); // 10 days from now

    return this.enrollmentsRepository.save(enrollment);
  }

  findAll() {
    return this.studentsRepository.find({ relations: ['courses'] });
  }
}
