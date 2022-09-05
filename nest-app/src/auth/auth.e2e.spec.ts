import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('cannot login user missing request attribute', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner-user-1@example.com' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect(({ body }) => {
        expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        expect(body.message).toEqual('Unauthorized');
      });
  });

  it('cannot login user with invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner-user-1@example.com', password: 'invalid1' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect(({ body }) => {
        expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        expect(body.message).toEqual('Unauthorized');
      });
  });

  it('can login user with valid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner-user-1@example.com', password: 'password1' })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
      });
  });
});
