import { IsIn } from 'class-validator';

export const DOCUMENT_STATUSES = [
    'pendiente',
    'cargado',
    'observado',
    'aprobado',
] as const;

export class UpdateDocumentStatusDto {
    @IsIn(DOCUMENT_STATUSES, {
        message: `status debe ser uno de: ${DOCUMENT_STATUSES.join(', ')}`,
    })
    status: (typeof DOCUMENT_STATUSES)[number];
}