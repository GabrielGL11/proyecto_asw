import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    nationalId: string;

    @IsEmail()
    email: string;

    @IsInt()
    @Min(1)
    age: number;

    @IsString()
    @IsNotEmpty()
    career: string;

    @IsInt()
    @Min(1)
    @Max(10)
    semester: number;

    @IsBoolean()
    isActive: boolean;
}