import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

describe('Post', () => {
  let app: INestApplication;
  const createdUsersId: string[] = [];
  const createdRolesId: string[] = [];
  let activeJwt = '';

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
    createdUsersId.push(resRegisterAdmin.body['_id']);

    const res = await request(app.getHttpServer()) //login admin
      .post('/auth/login')
      .send({ username: 'userAdmin', password: '12345678' })
      .expect(201);
    activeJwt = res.body['access_token'];
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({ usersId: createdUsersId })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({ rolesId: createdRolesId })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(200);
  });

  it('create new user role - status 201 created', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/role')
      .send({
        name: 'roleTest',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(201);

    createdRolesId.push(res.body['_id']);
  });

  it('create new user role if jwt is not provided - status 401 unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/users/role')
      .send({
        name: 'roleTest',
      })
      .expect(401);
  });

  it('create new user role if object is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/users/role')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('create new user role if role name is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/users/role')
      .send({
        name: '',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });
});
