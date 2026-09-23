import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreateScholarshipDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsBoolean()
    isActive: boolean;
}