import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ApplicationsController } from './applications.controller.js';
import { ApplicationsService } from './applications.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            findByStudent: vi.fn(),
            findByScholarship: vi.fn(),
            update: vi.fn(),
            updateStatus: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: vi.fn(() => true) })
      .compile();

    controller = module.get<ApplicationsController>(
      ApplicationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});