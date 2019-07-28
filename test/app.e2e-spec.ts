import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { app } from './constants';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true });
  await dropCollections();
});

afterAll(async done => {
  await dropCollections();
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

async function dropCollections() {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.drop();
  }
}
