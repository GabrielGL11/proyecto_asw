import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrackingController } from './tracking.controller.js';
import { TrackingService } from './tracking.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

describe('TrackingController', () => {
  let controller: TrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
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

    controller = module.get<TrackingController>(TrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});