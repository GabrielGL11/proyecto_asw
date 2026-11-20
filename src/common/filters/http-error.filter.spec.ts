import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { HttpErrorFilter } from './http-error.filter.js';

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;
  let json: ReturnType<typeof jest.fn>;
  let status: ReturnType<typeof jest.fn>;
  let host: ArgumentsHost;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    filter = new HttpErrorFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ originalUrl: '/students/999?secret=1', url: '/students/999' }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('keeps the status and message of an HttpException', () => {
    filter.catch(new NotFoundException('No se encontrÃ³ el estudiante'), host);

    expect(status).toHaveBeenCalledWith(404);
    const body = json.mock.calls[0][0];
    expect(body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: 'No se encontrÃ³ el estudiante',
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
