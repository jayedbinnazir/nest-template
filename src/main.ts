import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("------------------>",path.join(__dirname,'../../'));
  
  // Enable cookie parsing
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('globalPrefix') || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port, ()=>console.log(`application starts at port ${port}`));
  // Log health check result after startup
  try {
    const healthUrl = `http://localhost:${port}/${globalPrefix}/health`;
    const { data } = await axios.get(healthUrl);
    console.log('Health check:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Health check failed:', e.message);
  }
}
bootstrap();
