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
    const resUser = await request(app.getHttpServer()) //create test admin
      .post('/auth/register')
      .send({
        username: 'userAdmin',
        password: '12345678',
        email: 'userAdmin@gmail.com',
        isAdmin: true,
      })
      .expect(201);
    createdUsersId.push(resUser.body['_id']);

    const res = await request(app.getHttpServer()) //login admin
      .post('/auth/login')
      .send({ username: 'userAdmin', password: '12345678' })
      .expect(201);
    activeJwt = res.body['access_token'];

    const resRole = await request(app.getHttpServer()) //create role
      .post('/users/role')
      .send({
        name: 'roleForTest',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(201);
    createdRolesId.push(resRole.body['_id']);
  });

  it('delete roles if obj with array of ids is provided - status 200 ok', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({
        rolesId: createdRolesId,
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(200);
  });

  it('delete roles if jwt is not provided - status 401 unauthorized', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({
        rolesId: createdRolesId,
      })
      .expect(401);
  });

  it('delete roles if obj is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete roles if obj is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({})
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete roles if rolesId is null - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({
        rolesId: null,
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete roles if rolesId is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/role/delete')
      .send({
        rolesId: '',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete users if obj with array of ids is provided - status 200 ok', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({
        usersId: createdUsersId,
      })
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(200);
  });

  it('delete users if jwt is not provided - status 401 unauthorized', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({
        usersId: createdUsersId,
      })
      .expect(401);
  });

  it('delete users if obj is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .withCredentials()
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete users if obj is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .withCredentials()
      .send({})
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete users if obj usersId is empty  - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .withCredentials()
      .send({
        usersId: '',
      })
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });

  it('delete users if obj usersId is null  - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .withCredentials()
      .send({
        usersId: null,
      })
      .set('Authorization', `Bearer ${activeJwt}`)
      .expect(400);
  });
});
