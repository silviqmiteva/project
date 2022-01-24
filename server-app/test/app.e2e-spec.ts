import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const randomUsername = Math.random().toString();
  const randomEmail = randomUsername + '@gmail.com';
  let jwtToken = '',
    refreshToken = '',
    userId = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('register user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: randomUsername,
        password: '12345678',
        email: randomEmail,
      })
      .expect(201);
    userId = response.body['_id'];
  });

  it('authenticates a user and includes a jwt token in the response', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: randomUsername, password: '12345678' })
      .expect(201);

    const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    jwtToken = response.body.access_token;
    expect(jwtToken).toMatch(regex);
    let refToken = response.headers['set-cookie'][0];
    refToken = refToken.split(';');
    refreshToken = refToken[0].slice(14);
  });

  it('test protected route', async () => {
    await request(app.getHttpServer())
      .post('/auth/test')
      .send({
        test: 'hi from jest test',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201);
  });

  it('not allowed to get all users if you are not admin', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .send({
        test: 'hi from jest test',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(403); //current user is not admin
  });

  it('get user profile', async () => {
    await request(app.getHttpServer())
      .get('/users/profile')
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it('create new user role', async () => {
    await request(app.getHttpServer())
      .post('/users/role')
      .send({
        name: 'role' + Math.floor(Math.random() * 1000),
      })
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201);
  });

  // must send cookie refresh token in req ! --------
  // it('logout user', async () => {
  //   await request(app.getHttpServer())
  //     .put('/auth/logout')
  //     .withCredentials()
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .set('Cookie', 'refresh_token=' + refreshToken)
  //     .send({
  //       userId: userId,
  //     })
  //     .expect(201);
  // });

  afterAll(() => {
    app.close();
  });
});
