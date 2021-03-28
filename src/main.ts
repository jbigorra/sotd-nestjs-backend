import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .use(morgan('dev'))
    .use(helmet())


  await app.listen(3000);
}
bootstrap();
