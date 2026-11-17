import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateApplicationUseCase } from './update-application.use-case.js';
import type { ApplicationRepository } from '../domain/application.repository.js';
import { UserRole } from '../../users/user-role.enum.js';

describe('UpdateApplicationUseCase', () => {
  let useCase: UpdateApplicationUseCase;
  let repository: {
    findById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };

  const owner = { id: 10, email: 'owner@example.com', role: UserRole.STUDENT };
  const stranger = { id: 20, email: 'other@example.com', role: UserRole.STUDENT };
  const reviewer = { id: 30, email: 'rev@example.com', role: UserRole.REVIEWER };
  const admin = { id: 40, email: 'admin@example.com', role: UserRole.ADMIN };

  const applicationOwnedBy = (createdByUserId: number | null) => ({
    id: 1,
    createdByUserId,
    comment: 'original',
  });

  beforeEach(() => {
    repository = {
      findById: vi.fn(),
      save: vi.fn((application) => Promise.resolve(application)),
    };
    useCase = new UpdateApplicationUseCase(
      repository as unknown as ApplicationRepository,
    );
  });

  it('lets the owner update their application', async () => {
    repository.findById.mockResolvedValue(applicationOwnedBy(owner.id));

    const result = await useCase.execute(1, { comment: 'nuevo' }, owner);

    expect(result.comment).toBe('nuevo');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('lets a reviewer update any application', async () => {
    repository.findById.mockResolvedValue(applicationOwnedBy(owner.id));
    await expect(useCase.execute(1, { comment: 'x' }, reviewer)).resolves.toBeDefined();
  });

  it('lets an admin update any application', async () => {
    repository.findById.mockResolvedValue(applicationOwnedBy(owner.id));
    await expect(useCase.execute(1, { comment: 'x' }, admin)).resolves.toBeDefined();
  });

  it('forbids (403) a student who is not the owner', async () => {
    repository.findById.mockResolvedValue(applicationOwnedBy(owner.id));

    await expect(
      useCase.execute(1, { comment: 'x' }, stranger),
    ).rejects.toThrow(ForbiddenException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('forbids a student when the application has no owner', async () => {
    repository.findById.mockResolvedValue(applicationOwnedBy(null));

    await expect(
      useCase.execute(1, { comment: 'x' }, owner),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws NotFoundException when the application does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(999, { comment: 'x' }, admin),
    ).rejects.toThrow(NotFoundException);
  });
});
