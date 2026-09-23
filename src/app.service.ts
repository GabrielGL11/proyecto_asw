import { Injectable } from '@nestjs/common'; // 1

@Injectable() // 2
export class AppService { // 3
  getHello(): string { // 4
    return '<center><h1>Sistema de Gestión de Becas ULEAM</h1></center>'; // 5
  }
}