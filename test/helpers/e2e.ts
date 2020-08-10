import { ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

function createTestingApp(module: TestingModule) {
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  return app;
}

export { createTestingApp };
