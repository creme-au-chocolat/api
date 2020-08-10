import { Pagination } from '../../../common/types/pagination.entity';
import { PostEntity } from './post.entity';

export class PostListEntity {
  data: PostEntity[];
  pagination: Pagination;
}
