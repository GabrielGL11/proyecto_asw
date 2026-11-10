import { IsIn } from 'class-validator';

export const APPLICATION_STATUSES = [
    'pendiente',
    'revision',
    'aprobada',
    'rechazada',
    'correccion',
] as const;

export class UpdateApplicationStatusDto {
    @IsIn(APPLICATION_STATUSES, {
        message: `status debe ser uno de: ${APPLICATION_STATUSES.join(', ')}`,
    })
    status: (typeof APPLICATION_STATUSES)[number];
}