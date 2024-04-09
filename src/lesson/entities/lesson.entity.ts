import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  number: number;

  @Column()
  @IsString({ message: "'title' field must be string" })
  title: string;

  @Column()
  @IsString({ message: "'description' field must be string" })
  description: string;

  @Column({ type: 'text' })
  @IsString({ message: "'text' field must be string" })
  text: string;

  @Column('text', { array: true })
  @IsOptional()
  @IsArray()
  videoLink?: string[];

  @Column({ default: false })
  @IsOptional()
  @IsBoolean({ message: "'isDeleted' field must be boolean" })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;
}
