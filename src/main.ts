import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'test') {
  // process.env.MONGO_URI = process.env.MONGO_URI_TEST;
  console.log('----------TESTING IN PROGRESS----------');
  console.log('using database', process.env.MONGO_URI_TEST);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
