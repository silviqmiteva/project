import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('Put', () => {
  let app: INestApplication;
  const randomUsername = 'testUser';
  const randomEmail = 'testPut@gmail.com';
  const createdIds: string[] = [];
  let activeJwt = '',
    userId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: randomUsername,
        password: '12345678',
        email: randomEmail,
      })
      .expect(201);
    userId = response.body['_id'];
    createdIds.push(userId);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: randomUsername, password: '12345678' })
      .expect(201);

    activeJwt = res.body.access_token;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({ usersId: createdIds })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(200);
  });

  it('logout user - status 200 ok', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .send({
        userId: userId,
      })
      .expect(200);
  });

  it('logout user without object - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('logout user with empty object - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .send({})
      .expect(400);
  });

  it('logout user where user id is null - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .send({ userId: null })
      .expect(400);
  });

  it('logout user where user id is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .send({ userId: '' })
      .expect(400);
  });

  it('logout user without jwt - status 401 unauthorized', async () => {
    await request(app.getHttpServer())
      .put('/auth/logout')
      .send({ userId: null })
      .expect(401);
  });
});
