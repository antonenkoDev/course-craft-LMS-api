import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkModeEnum } from '../enums/work-mode.enum';
import { Tag } from '../../tag/entities/tag.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true })
  idpId: string;

  @Column({ nullable: true })
  isActive: boolean;

  @Column()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiPropertyOptional()
  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  gender: number;

  @ApiPropertyOptional()
  @Column({ type: 'date', nullable: true })
  firstDay?: Date;

  @ApiPropertyOptional()
  @Column({ type: 'date', nullable: true })
  lastDay?: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  timezone?: string;

  @ManyToMany(() => Tag, (tags) => tags.users)
  tags?: Tag[];

  @ApiPropertyOptional()
  @Column({ type: 'integer', nullable: true })
  workMode?: WorkModeEnum;

  @OneToMany(() => Course, (course) => course.userOwner)
  courses: Course[];
}
