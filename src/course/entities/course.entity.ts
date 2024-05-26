import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.admin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  @IsString({ message: "'title' field must be string" })
  title: string;

  @Column()
  @IsString({ message: "'description' field must be string" })
  description: string;

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

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
  lessons: Lesson[];

  @ManyToMany(() => Student, student => student.courses)
  students: Student[];
}
