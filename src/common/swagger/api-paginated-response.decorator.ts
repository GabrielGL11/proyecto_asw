import { applyDecorators } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationMetaDto } from '../dto/error-response.dto.js';

/** Respuesta 200 de un listado: `{ items: Modelo[], meta: {...} }`. */
export function ApiPaginatedResponse(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(PaginationMetaDto, model),
    ApiOkResponse({
      description: 'Listado paginado con filtros y ordenamiento',
      schema: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  );
}
