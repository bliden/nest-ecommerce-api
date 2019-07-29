import * as mongoose from 'mongoose';
import { app, database } from './constants';
import * as request from 'supertest';
import axios from 'axios';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreateProductDTO, Product } from 'src/types/product';
import { HttpStatus } from '@nestjs/common';

let sellerToken: string;
let buyerToken: string;
let boughtProducts: Product[];
const orderBuyer: RegisterDTO = {
  username: 'orderBuyer',
  password: 'password',
  seller: false,
};
const orderSeller: RegisterDTO = {
  username: 'orderSeller',
  password: 'password',
  seller: true,
};
const soldProducts: CreateProductDTO[] = [
  {
    title: 'newer phone',
    description: 'mobile',
    image: 'n/a',
    price: 10,
  },
  {
    title: 'newest phone',
    description: 'mobile-er',
    image: 'n/a',
    price: 100,
  },
];

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
  await dropCollections();
  // register buyer and seller, saving tokens at top of scope
  const {
    data: { token: newSellerToken },
  } = await axios.post(`${app}/auth/register`, orderSeller);
  sellerToken = newSellerToken;
  const {
    data: { token: newBuyerToken },
  } = await axios.post(`${app}/auth/register`, orderBuyer);
  buyerToken = newBuyerToken;

  const [{ data: data1 }, { data: data2 }] = await Promise.all(
    soldProducts.map(product =>
      axios.post(`${app}/product`, product, {
        headers: { authorization: `Bearer ${sellerToken}` },
      }),
    ),
  );
  boughtProducts = [data1, data2];
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ORDERS', () => {
  it('creates order of all products', () => {
    const orderDTO = {
      products: boughtProducts.map(product => {
        return { product: product.id, quantity: 1 };
      }),
    };

    return request(app)
      .post(`order`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .set('Accept', 'application/json')
      .send(orderDTO)
      .expect(({ body }) => {
        // console.log(body);
        expect(body.owner.username).toEqual(orderBuyer.username);
        expect(body.products).toHaveLength(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body.products[0]._id),
        ).toBeTruthy();
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body.products[1]._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtProducts.reduce((acc, next) => {
            return acc + next.price;
          }, 0),
        );
      })
      .expect(HttpStatus.CREATED);
  });

  it('lists all orders of buyer', () => {
    return request(app)
      .get('order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].products).toHaveLength(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body[0].products[0]._id),
        ).toBeTruthy();
      })
      .expect(HttpStatus.OK);
  });

  // what to use? Stripe probably
  test.todo('processes payment');
});

async function dropCollections() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
}
