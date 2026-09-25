import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDocumentIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('El ID debe ser un número entero positivo');
    }
    return id;
  }
}
