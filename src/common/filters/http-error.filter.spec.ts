import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorFilter } from './http-error.filter.js';

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;
  let json: ReturnType<typeof vi.fn>;
  let status: ReturnType<typeof vi.fn>;
  let host: ArgumentsHost;

  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    filter = new HttpErrorFilter();
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ originalUrl: '/students/999?secret=1', url: '/students/999' }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('keeps the status and message of an HttpException', () => {
    filter.catch(new NotFoundException('No se encontró el estudiante'), host);

    expect(status).toHaveBeenCalledWith(404);
    const body = json.mock.calls[0][0];
    expect(body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: 'No se encontró el estudiante',
      path: '/students/999',
    });
    expect(typeof body.timestamp).toBe('string');
  });

  it('keeps the list of validation messages', () => {
    filter.catch(new BadRequestException(['email must be an email']), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json.mock.calls[0][0].message).toEqual(['email must be an email']);
  });

  it('hides internal details of unexpected errors (500)', () => {
    filter.catch(new Error('relation "students" does not exist'), host);

    expect(status).toHaveBeenCalledWith(500);
    const body = json.mock.calls[0][0];
    expect(body.message).toBe('Internal server error');
    expect(JSON.stringify(body)).not.toContain('relation');
    expect(body.stack).toBeUndefined();
  });
});
