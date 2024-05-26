import { IsInt, IsNotEmpty } from 'class-validator';

export class EnrollDto {
  @IsInt()
  @IsNotEmpty()
  studentId: string;

  @IsInt()
  @IsNotEmpty()
  courseId: string;
}
