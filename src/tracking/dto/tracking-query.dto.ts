
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class TrackingQueryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    applicationId?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    status?: string;

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
    @IsIn(['id', 'status', 'createdAt', 'applicationId'])
    sortBy: string = 'id';

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.toUpperCase() : value,
    )
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}
