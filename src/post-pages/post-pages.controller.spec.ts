import { Test, TestingModule } from '@nestjs/testing';
import { PostPagesController } from './post-pages.controller';

describe('PostPages Controller', () => {
  let controller: PostPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostPagesController],
    }).compile();

    controller = module.get<PostPagesController>(PostPagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
