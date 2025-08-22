import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log("----------------->",path.join(__dirname,'../../'));
  
  // Enable cookie parsing
  app.use(cookieParser());
  
  // Serve static files
  const configService = app.get(ConfigService);
  const staticRoot = configService.get<string>('files.serveStatic.root') || './public';
  const staticPrefix = configService.get<string>('files.serveStatic.prefix') || '/static';
  
  app.useStaticAssets(path.join(process.cwd(), staticRoot), {
    prefix: staticPrefix,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const appConfigService = app.get(ConfigService);
  const globalPrefix = appConfigService.get<string>('app.globalPrefix') || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = appConfigService.get<number>('app.port') || 3000;
  const host = appConfigService.get<string>('app.host')  as string ;
  await app.listen(port, host ,()=>console.log(`application starts at port ${host}:${port}`));
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
