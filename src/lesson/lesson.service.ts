import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { Course } from 'src/course/entities/course.entity';
import { DataSource, Repository } from 'typeorm';
import { TENANT_DATASOURCE } from 'src/database/providers/tenant.provider';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable({ scope: Scope.REQUEST })
export class LessonService {
  private readonly logger = new Logger(this.constructor.name);
  private courseRepository: Repository<Course>;
  private lessonRepository: Repository<Lesson>;

  constructor(
    @Inject(TENANT_DATASOURCE)
    private dataSource: DataSource,
  ) {
    this.logger.log('COURSE SERVICE initialized');
    this.courseRepository = dataSource.getRepository(Course);
    this.lessonRepository = dataSource.getRepository(Lesson);
  }

  async create(dto: CreateLessonDto) {
    const course = await this.courseRepository.findOne({
      where: { uuid: dto.courseUuid },
    });

    if (!course) {
      throw new NotFoundException('User nor found!');
    }

    const newLesson = new Lesson();
    newLesson.number = dto.number;
    newLesson.title = dto.title;
    newLesson.description = dto.description;
    newLesson.text = dto.text;
    newLesson.videoLink = dto?.videoLink ?? [];
    newLesson.course = course;

    return this.lessonRepository.save(newLesson);
  }

  async findById(uuid: string) {
    return this.lessonRepository.findOneBy({ uuid });
  }

  async findAll(options?: { isDeleted: boolean }) {
    return await this.lessonRepository.find({
      where: { isDeleted: options?.isDeleted ?? true },
    });
  }

  async archive(uuid: string) {
    await this.lessonRepository
      .createQueryBuilder()
      .update()
      .set({ isDeleted: true })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async unArchive(uuid: string) {
    await this.lessonRepository
      .createQueryBuilder()
      .update()
      .set({ isDeleted: false })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async delete(uuid: string) {
    await this.lessonRepository.delete(uuid);
    return true;
  }
}
