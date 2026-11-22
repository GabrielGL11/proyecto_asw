import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('Raíz')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Comprobar que la API responde' })
  @ApiOkResponse({ description: 'Página de bienvenida (HTML)' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
