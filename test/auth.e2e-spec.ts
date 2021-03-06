import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { RegisterDTO, LoginDTO } from 'src/auth/auth.dto';
import { HttpStatus } from '@nestjs/common';
import { app, database } from './constants';

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
  await dropCollections();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('AUTH', () => {
  const user: RegisterDTO | LoginDTO = {
    username: 'username',
    password: 'password',
  };
  let userToken: string;

  const sellerRegister: RegisterDTO = {
    username: 'seller',
    password: 'password',
    seller: true,
  };
  let sellerToken: string;

  const sellerLogin: LoginDTO = {
    username: 'seller',
    password: 'password',
  };

  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(user.username);
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should register a seller', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(sellerRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(sellerRegister.username);
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should reject dupe registration', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toBe('User already exists');
        expect(body.code).toEqual(HttpStatus.BAD_REQUEST);
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should login user', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(user.username);
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeFalsy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should login seller', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(sellerLogin)
      .expect(({ body }) => {
        sellerToken = body.token;
        expect(body.token).toBeDefined();
        expect(body.user.username).toBe(sellerLogin.username);
        expect(body.user.password).toBeUndefined();
        expect(body.user.seller).toBeTruthy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('respects seller token', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });
});

async function dropCollections() {
  const collections = await mongoose.connection.db.collections();
  // for (const collection of collections) {
  //   await collection.drop();
  // }
  return await Promise.all(
    Object.keys(collections).map(c => {
      return collections[c].drop();
    }),
  );
}
