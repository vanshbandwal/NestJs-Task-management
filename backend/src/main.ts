import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieParser = require('cookie-parser'); // ✅ works

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); 
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
