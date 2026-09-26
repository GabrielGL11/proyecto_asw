import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTrackingDto {
    @IsInt()
    @Min(1)
    applicationId: number;

    @IsIn(['pendiente', 'revision', 'aprobada', 'rechazada', 'correccion'])
    status: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    comment?: string;
}