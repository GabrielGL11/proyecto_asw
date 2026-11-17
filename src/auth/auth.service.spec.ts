import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/user-role.enum.js';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: ReturnType<typeof vi.fn>;
    findByEmailWithPassword: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let jwtService: { signAsync: ReturnType<typeof vi.fn> };
  let passwordHash: string;

  beforeEach(async () => {
    passwordHash = await bcrypt.hash('Prueba123!', 4);
    usersService = {
      findByEmail: vi.fn(),
      findByEmailWithPassword: vi.fn(),
      create: vi.fn(),
    };
    jwtService = { signAsync: vi.fn().mockResolvedValue('signed.jwt.token') };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('registers a user with a hashed password and the lowest role', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockImplementation((email: string, password: string) =>
      Promise.resolve({ id: 1, email, password, role: UserRole.STUDENT }),
    );

    const result = await service.register({ email: 'a@b.com', password: 'Prueba123!' });

    const storedPassword = usersService.create.mock.calls[0][1];
    expect(storedPassword).not.toBe('Prueba123!');
    expect(result).toEqual({ id: 1, email: 'a@b.com', role: UserRole.STUDENT });
    expect(result).not.toHaveProperty('password');
  });

  it('rejects a duplicated email with ConflictException', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.register({ email: 'a@b.com', password: 'Prueba123!' }),
    ).rejects.toThrow(ConflictException);
  });

  it('returns accessToken and a safe user on a valid login', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: passwordHash,
      role: UserRole.REVIEWER,
    });

    const result = await service.login({ email: 'a@b.com', password: 'Prueba123!' });

    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.user).toEqual({ id: 1, email: 'a@b.com', role: UserRole.REVIEWER });
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: 'a@b.com' });
  });

  it('rejects a wrong password with UnauthorizedException', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: passwordHash,
      role: UserRole.STUDENT,
    });

    await expect(
      service.login({ email: 'a@b.com', password: 'OtraClave123' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('rejects an unknown email with UnauthorizedException', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nadie@b.com', password: 'Prueba123!' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
