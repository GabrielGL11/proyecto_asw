import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class DocumentsQueryDto {
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
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsIn(['pendiente', 'cargado', 'observado', 'aprobado'])
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
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsIn(['id', 'name', 'status', 'applicationId'])
    sortBy: string = 'id';

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
    )
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}