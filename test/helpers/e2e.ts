import { ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

function createTestingApp(module: TestingModule) {
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  return app;
}

async function testBadRequests<T>(
  httpServer: any,
  datas: T[],
  assertFunction: (
    supertest: request.SuperTest<request.Test>,
    value: T,
  ) => void | Promise<void>,
): Promise<void>;
async function testBadRequests(
  httpServer: any,
  badRequests: string[],
): Promise<void>;
async function testBadRequests<T>(
  httpServer: any,
  p1: string[] | T[],
  p2?: (
    supertest: request.SuperTest<request.Test>,
    value: T,
  ) => void | Promise<void>,
): Promise<void> {
  const supertest = request(httpServer);

  if (p2 === undefined) {
    p1 = p1 as string[];
    p1.forEach(async url => {
      await supertest.get(url).expect(400);
    });

    return;
  }

  if (typeof p2 === 'function') {
    p1 = p1 as T[];
    p1.forEach(async value => {
      await p2(supertest, value);
    });

    return;
  }
}

export { createTestingApp, testBadRequests };
