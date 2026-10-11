
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class StudentsQueryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    career?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    semester?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;

    @IsOptional()
    @IsIn(['id', 'firstName', 'lastName', 'age', 'semester', 'career'])
    sortBy: string = 'id';

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.toUpperCase() : value,
    )
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}
