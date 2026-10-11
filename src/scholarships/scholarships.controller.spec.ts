import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipsService } from './scholarships.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('ScholarshipsController', () => {
  let controller: ScholarshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScholarshipsController],
      providers: [
        {
          provide: ScholarshipsService,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: vi.fn(() => true),
      })
      .compile();

    controller = module.get<ScholarshipsController>(
      ScholarshipsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});