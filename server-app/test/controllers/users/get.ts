import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('Get', () => {
  let app: INestApplication;
  const createdIds: string[] = [];
  let adminUser = {},
    user = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const resRegisterAdmin = await request(app.getHttpServer()) //create test admin
      .post('/auth/register')
      .send({
        username: 'userAdmin',
        password: '12345678',
        email: 'userAdmin@gmail.com',
        isAdmin: true,
      })
      .expect(201);
    createdIds.push(resRegisterAdmin.body['_id']);

    const res = await request(app.getHttpServer()) //login admin
      .post('/auth/login')
      .send({ username: 'userAdmin', password: '12345678' })
      .expect(201);
    adminUser = res.body;

    const resRegisterUser = await request(app.getHttpServer()) //create test user
      .post('/auth/register')
      .send({
        username: 'user',
        password: '01234567',
        email: 'user@gmail.com',
      })
      .expect(201);
    createdIds.push(resRegisterUser.body['_id']);

    const resUser = await request(app.getHttpServer()) //login user
      .post('/auth/login')
      .send({ username: 'user', password: '01234567' })
      .expect(201);
    user = resUser.body;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({ usersId: createdIds })
      .withCredentials()
      .set('Authorization', `Bearer ${adminUser['access_token']}`)
      .expect(200);
  });

  it('get user profile - status 200 ok', async () => {
    await request(app.getHttpServer())
      .get('/users/profile')
      .withCredentials()
      .set('Authorization', `Bearer ${adminUser['access_token']}`)
      .expect(200);
  });

  it('get user profile data if jwt is not provided - status 401 unauthorized', async () => {
    await request(app.getHttpServer()).get('/users/profile').expect(401);
  });

  it('get all users if user role is admin - status 200 ok', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .withCredentials()
      .set('Authorization', `Bearer ${adminUser['access_token']}`)
      .expect(200);
  });

  it('get all users if user role is not admin - status 403 forbidden', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .withCredentials()
      .set('Authorization', `Bearer ${user['access_token']}`)
      .expect(403);
  });

  it('get all users if jwt is not provided - status 401 unauthorized', async () => {
    await request(app.getHttpServer()).get('/users').expect(401);
  });
});
