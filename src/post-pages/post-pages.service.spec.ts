import { Test, TestingModule } from '@nestjs/testing';
import { PostPagesService } from './post-pages.service';

describe('PostPagesService', () => {
  let service: PostPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostPagesService],
    }).compile();

    service = module.get<PostPagesService>(PostPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
