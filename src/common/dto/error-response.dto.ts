import { ApiProperty } from '@nestjs/swagger';

/** Forma uniforme de todo error de la API (la produce HttpErrorFilter). */
export class ErrorResponseDto {
  @ApiProperty({ type: Number, example: 404 })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Not Found' })
  error: string;

  @ApiProperty({
    type: String,
    description:
      'Mensaje del error. En errores de validación (400) es una lista de mensajes.',
    example: 'El estudiante no existe',
  })
  message: string;

  @ApiProperty({ type: String, example: '/students/999' })
  path: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-18T15:00:00.000Z',
  })
  timestamp: string;
}

/** Metadatos de paginación de los listados. */
export class PaginationMetaDto {
  @ApiProperty({ type: Number, example: 25 })
  total: number;

  @ApiProperty({ type: Number, example: 1 })
  page: number;

  @ApiProperty({ type: Number, example: 10 })
  limit: number;

  @ApiProperty({ type: Number, example: 3 })
  totalPages: number;
}
