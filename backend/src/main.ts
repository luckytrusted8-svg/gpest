import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 G-PEST NestJS API is running on: http://localhost:${port}/api/v1`);
  logger.log(`🛰️ WebSocket Tracking Gateway is ready on port: ${port}`);
}
bootstrap();
