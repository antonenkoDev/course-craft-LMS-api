import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { TENANT_DATASOURCE } from 'src/database/providers/tenant.provider';
import { CreateCourseDto } from './dto/create-course.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class CourseService {
  private readonly logger = new Logger(this.constructor.name);
  private courseRepository: Repository<Course>;
  private userRepository: Repository<User>;

  constructor(
    @Inject(TENANT_DATASOURCE)
    private dataSource: DataSource,
  ) {
    this.logger.log('COURSE SERVICE initialized');
    this.courseRepository = dataSource.getRepository(Course);
    this.userRepository = dataSource.getRepository(User);
  }

  async create(
    createCourseDto: CreateCourseDto,
    // options?: { connectionName?: string; auth0OrganizationId?: string },
  ) {
    // const userOwner = await this.auth0Service.createOrGetUser({
    //   email: createCourseDto.userOwnerEmail,
    //   connection:
    //     options?.connectionName ??
    //     this.configService.get<string>('AUTH0_CONNECTION_NAME'),
    // });

    const userOwner = await this.userRepository.findOne({
      where: { email: createCourseDto.userOwnerEmail },
    });

    if (!userOwner) {
      throw new NotFoundException('User nor found!');
    }
    const newCourse = new Course();
    newCourse.title = createCourseDto.title;
    newCourse.description = createCourseDto.description;
    newCourse.userOwner = userOwner;

    return this.courseRepository.save(newCourse);
  }

  async findById(uuid: string) {
    return this.courseRepository.findOneBy({ uuid });
  }

  async findAll(options?: { isDeleted: boolean }) {
    return await this.courseRepository.find({
      where: { isDeleted: options?.isDeleted ?? true },
    });
  }

  async archive(uuid: string) {
    await this.courseRepository
      .createQueryBuilder()
      .update()
      .set({ isDeleted: true })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async unArchive(uuid: string) {
    await this.courseRepository
      .createQueryBuilder()
      .update()
      .set({ isDeleted: false })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async delete(uuid: string) {
    await this.courseRepository.delete(uuid);
    return true;
  }
}
