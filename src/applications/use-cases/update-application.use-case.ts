import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application.repository.js';
import type { UpdateApplicationDto } from '../dto/update-application.dto.js';
import type { AuthenticatedUser } from '../../auth/authenticated-user.interface.js';
import { UserRole } from '../../users/user-role.enum.js';

/**
 * Regla de negocio (sin HTTP ni TypeORM):
 * una solicitud solo la modifica un administrador, un revisor o el usuario
 * que la creó (propiedad). El propietario se toma de la identidad
 * autenticada, nunca del cuerpo de la petición.
 */
@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(
    id: number,
    changes: UpdateApplicationDto,
    actor: AuthenticatedUser,
  ) {
    const application = await this.applications.findById(id);
    if (!application) {
      throw new NotFoundException(`No se encontró la solicitud con ID ${id}`);
    }

    const canManageAny =
      actor.role === UserRole.ADMIN || actor.role === UserRole.REVIEWER;
    const isOwner = application.createdByUserId === actor.id;
    if (!canManageAny && !isOwner) {
      throw new ForbiddenException('No puedes modificar esta solicitud');
    }

    Object.assign(application, changes);
    return this.applications.save(application);
  }
}
