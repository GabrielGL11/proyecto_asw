import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

const DESCRIPTIONS: Record<number, string> = {
  400: 'Solicitud inválida (validación de datos o identificador)',
  401: 'Token ausente o inválido',
  403: 'Rol insuficiente o recurso que no es del usuario',
  404: 'Recurso no encontrado',
  409: 'Conflicto (dato duplicado o restricción de integridad)',
  429: 'Demasiadas solicitudes (límite por minuto superado)',
};

/**
 * Documenta las respuestas de error de un endpoint con el formato uniforme
 * de la API. Uso: `@ApiErrorResponses(400, 401, 403, 404)`.
 */
export function ApiErrorResponses(...statuses: number[]) {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: DESCRIPTIONS[status] ?? 'Error',
        type: ErrorResponseDto,
      }),
    ),
  );
}
