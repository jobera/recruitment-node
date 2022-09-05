import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CertificateStatusEnum } from './certificate.status.enum';

describe('Certificates (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET available certificates by default', () => {
    return request(app.getHttpServer())
      .get('/api/v1/certificates')
      .query({ limit: 100 })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.items).toBeDefined();
        expect(body.meta).toBeDefined();

        // Total certificates with 'available' status
        expect(body.items.length).toEqual(95);
        const status = [...new Set(body.items.map((item) => item.status))];
        expect(status).toEqual([CertificateStatusEnum.available]);
      });
  });

  it('Cannot GET owned certificates without auth request', () => {
    return request(app.getHttpServer())
      .get('/api/v1/certificates')
      .query({ status: CertificateStatusEnum.owned })
      .expect(({ body }) => {
        expect(body.items).toBeDefined();
        expect(body.meta).toBeDefined();

        // No items returned
        expect(body.items.length).toEqual(0);
      });
  });

  it('Can GET owned certificates with a valid auth request', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner-user-1@example.com', password: 'password1' });

    return request(app.getHttpServer())
      .get('/api/v1/certificates')
      .query({ status: CertificateStatusEnum.owned })
      .set({ authorization: `Bearer ${body.accessToken}` })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.items).toBeDefined();
        expect(body.meta).toBeDefined();

        expect(body.items.length).toEqual(1);
        expect(body.items[0].id).toEqual(96);
        expect(body.items[0].status).toEqual(CertificateStatusEnum.owned);
      });
  });

  describe('AUTHED transfert tests', () => {
    let accessToken: string;
    beforeAll(async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'owner-user-1@example.com', password: 'password1' });

      accessToken = body.accessToken;
    });

    it('[POST] Cannot transfer certificate ownership without valid auth request', () => {
      return request(app.getHttpServer())
        .put('/api/v1/certificates/transfer')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('[POST] Cannot transfer certificate ownership with invalid certificate parameter', () => {
      return request(app.getHttpServer())
        .put('/api/v1/certificates/transfer')
        .send({ userId: 1, certificateId: 9999 })
        .set({ authorization: `Bearer ${accessToken}` })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(body.message).toEqual(
            'Certificate unavailable for authenticated user',
          );
        });
    });

    it('[PUT] Cannot transfer certificate ownership with invalid user parameter', () => {
      return request(app.getHttpServer())
        .put('/api/v1/certificates/transfer')
        .send({ userId: 9999, certificateId: 96 })
        .set({ authorization: `Bearer ${accessToken}` })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(body.message).toEqual(
            'Requested user to receive certificate ownership does not exists',
          );
        });
    });

    it('[POST] Cannot transfer certificate ownership to current authed user', () => {
      return request(app.getHttpServer())
        .put('/api/v1/certificates/transfer')
        .send({ userId: 1, certificateId: 96 })
        .set({ authorization: `Bearer ${accessToken}` })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(body.message).toEqual(
            'Requested user to transfer is already owner of this certificate',
          );
        });
    });

    it('[POST] Can transfer certificate ownership', () => {
      return request(app.getHttpServer())
        .put('/api/v1/certificates/transfer')
        .send({ userId: 2, certificateId: 96 })
        .set({ authorization: `Bearer ${accessToken}` })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toEqual(96);
          expect(body.status).toEqual(CertificateStatusEnum.transferred);
          expect(body.ownerId).toEqual(2);
        });
    });
  });
});
