import * as mongoose from 'mongoose';
import { app, database } from './constants';
import * as request from 'supertest';
import axios from 'axios';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreateProductDTO } from 'src/types/product';
import { HttpStatus } from '@nestjs/common';

let sellerToken: string;
let productSeller: RegisterDTO = {
  username: 'productSeller',
  password: 'password',
  seller: true,
};

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
  await dropCollections();
  const {
    data: { token },
  } = await axios.post(`${app}/auth/register`, productSeller);
  sellerToken = token;
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('PRODUCTS', () => {
  const product: CreateProductDTO = {
    title: 'phone',
    description: 'mobile',
    image: 'n/a',
    price: '10',
  };
  let productID: string;

  it('list all products', () => {
    return request(app)
      .get('/product')
      .expect(200);
  });

  it('list my products', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });

  it('create product', () => {
    return request(app)
      .post('/product')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(product)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        productID = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      });
  });

  it('read one product', () => {
    return request(app)
      .get(`/product/${productID}`)
      .expect(({ body }) => {
        expect(body._id).toEqual(productID);
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });

  it('update product', () => {
    return request(app)
      .put(`/product/${productID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: 'newer phone' })
      .expect(({ body }) => {
        expect(body._id).toEqual(productID);
        expect(body.title).not.toEqual(product.title);
        expect(body.title).toEqual('newer phone');
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.OK);
  });

  it('delete product', async () => {
    await axios.delete(`${app}/product/${productID}`, {
      headers: {
        Authorization: `Bearer ${sellerToken}`,
      },
    });
    return request(app)
      .get(`/product/${productID}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});

async function dropCollections() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
}
