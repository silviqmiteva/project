import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

describe('Post', () => {
  let app: INestApplication;
  const createdIds: string[] = [];
  const randomUsername = 'userTest';
  const randomEmail = 'testPost@gmail.com';
  let jwtToken = '',
    refreshToken = '',
    userId = '';

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/users/delete')
      .send({ usersId: createdIds })
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    app.use(passport.initialize());
    app.useGlobalPipes(new ValidationPipe());
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
    createdIds.push(userId);
  });

  it('register user when object is empty - 400 bad request', async () => {
    const obj = {};
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when object is not provided - 400 bad request', async () => {
    await request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it('register user when email is not provided - 400 bad request', async () => {
    const obj = { username: randomUsername, password: '123456789' };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when email is null - 400 bad request', async () => {
    const obj = {
      username: randomUsername,
      password: '123456789',
      email: null,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when email is empty - 400 bad request', async () => {
    const obj = {
      username: randomUsername,
      password: '123456789',
      email: '',
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when username is not provided - 400 bad request', async () => {
    const obj = { email: randomEmail, password: '123456789' };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when password is null - 400 bad request', async () => {
    const obj = {
      username: randomUsername,
      password: null,
      email: randomEmail,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when password is empty - 400 bad request', async () => {
    const obj = {
      username: randomUsername,
      password: '',
      email: randomEmail,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when password is not provided - 400 bad request', async () => {
    const obj = { email: randomEmail, username: randomUsername };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when username is null - 400 bad request', async () => {
    const obj = {
      username: null,
      password: '12345678',
      email: randomEmail,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('register user when username is empty - 400 bad request', async () => {
    const obj = {
      username: '',
      password: '12345678',
      email: randomEmail,
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(obj)
      .expect(400);
  });

  it('login user with empty object - status 400 bad request', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({}).expect(400);
  });

  it('login user when object is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer()).post('/auth/login').expect(400);
  });

  it('login user when password is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: randomUsername,
      })
      .expect(400);
  });

  it('login user when username is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: '12345678',
      })
      .expect(400);
  });

  it('login user when username is null - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: null,
      })
      .expect(400);
  });

  it('login user when username is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: '',
      })
      .expect(400);
  });

  it('login user when password is null - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: null,
      })
      .expect(400);
  });

  it('login user when password is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: '',
      })
      .expect(400);
  });

  it('login user and includes a jwt token in the response - status 201', async () => {
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
    expect(refreshToken).toMatch(regex);
  });

  it('access test protected route - status 201 ok', async () => {
    await request(app.getHttpServer())
      .post('/auth/test')
      .send({
        test: 'hi from jest test',
      })
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201);
  });

  it('access test protected route when object is not provided - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/test')
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it('access test protected route when object is empty - status 400 bad request', async () => {
    await request(app.getHttpServer())
      .post('/auth/test')
      .send({})
      .withCredentials()
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it('access test protected route without jwt - status 401 unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/test')
      .send({
        test: 'hi from jest test',
      })
      .expect(401);
  });
});
