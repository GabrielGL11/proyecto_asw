import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import type { UserRole } from './user-role.enum.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  /** Lista de usuarios (sin contraseña: la columna tiene select:false). */
  findAll() {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async updateRole(id: number, role: UserRole) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
    }
    await this.usersRepository.update({ id }, { role });
    return { id: user.id, email: user.email, role };
  }
}
