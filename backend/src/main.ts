import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
  config(); // Load .env file
  console.log('JWT_SECRET from main:', process.env.JWT_SECRET);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
