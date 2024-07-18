import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log all environment variables (be careful with sensitive data in production)
  logger.log('Environment variables:');
  Object.keys(process.env).forEach(key => {
    logger.log(`${key}: ${process.env[key]}`);
  });

  // Explicitly check for required environment variables
  const requiredEnvVars = ['JWT_SECRET', 'PORT'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});