import type { Application } from '../entities/application.entity.js';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

/** Puerto: solo lo que el caso de uso necesita (encontrar y guardar). */
export interface ApplicationRepository {
  findById(id: number): Promise<Application | null>;
  save(application: Application): Promise<Application>;
}
