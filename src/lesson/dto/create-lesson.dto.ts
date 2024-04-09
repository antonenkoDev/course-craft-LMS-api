import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  number: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  videoLink?: string[];

  @IsUUID()
  courseUuid: string;
}
