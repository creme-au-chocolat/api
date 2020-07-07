import { Controller } from '@nestjs/common';
import { PostPagesService } from './post-pages.service';

@Controller('posts')
export class PostPagesController {
  constructor(private readonly postPagesService: PostPagesService) {}
}
