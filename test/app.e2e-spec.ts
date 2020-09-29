import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/:user/:repository (GET)', () => {
    return request(app.getHttpServer())
      .get('/rosostolato/curriculum')
      .expect(200)
      .expect([
        { extension: 'svg', lines: 4, size: 1881 },
        { extension: 'png', lines: null, size: 85197 },
        { extension: 'others', lines: 21, size: 1065 },
        { extension: 'md', lines: 2, size: 35 },
        { extension: 'ico', lines: null, size: 606 },
        { extension: 'html', lines: 376, size: 16282 },
        { extension: 'css', lines: 34, size: 520 },
      ]);
  });
});
