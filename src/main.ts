import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import morgan from 'morgan';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? 3000;
  const apiVersion = process.env.API_VERSION ?? 'v1';

  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  });
  const prefix = `/api/${apiVersion}`;

  app.setGlobalPrefix(prefix);
  app.enableShutdownHooks();
  app.use(
    morgan(':method :url :status - :res[content-length] b - :response-time ms')
  );

  const config = new DocumentBuilder()
    .setTitle('File Service')
    .setDescription('File service with upload/download APIs and local storage.')
    .setVersion(apiVersion)
    .addServer(prefix)
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });

  SwaggerModule.setup(`${prefix}/docs`, app, documentFactory);

  await app.listen(port);

  console.info(
    '==> 💻  Open http://%s:%s%s/docs in a browser to view the app.',
    host,
    port,
    prefix
  );
}

bootstrap();
