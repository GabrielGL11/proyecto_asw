import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateApplicationDto {
  @IsInt()
  @Min(1)
  studentId: number;

  @IsInt()
  @Min(1)
  scholarshipId: number;

  @IsNumber()
  @Min(0)
  gpa: number;

  @IsNumber()
  @Min(0)
  income: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
