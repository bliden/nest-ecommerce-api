import 'dotenv/config';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { RegisterDTO, LoginDTO } from 'src/auth/auth.dto';
import { HttpStatus } from '@nestjs/common';

const app = 'http://localhost:3000';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  await mongoose.connection.dropCollection('users');
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ROOT', () => {
  it('should ping', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect({
        hello: 'world',
      });
  });
});

describe('AUTH', () => {
  it('should register', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password',
    };
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(user.username);
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should reject dupe registration', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password',
    };
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toBe('User already exists');
        expect(body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should login', () => {
    const user: LoginDTO = {
      username: 'username',
      password: 'password',
    };

    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(user.username);
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });
});
