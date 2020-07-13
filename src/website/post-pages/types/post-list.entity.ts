import { Pagination } from '../../common/types/pagination.interface';
import { PostEntity } from './post.entity';

export interface PostListEntity {
  data: PostEntity[];
  pagination: Pagination;
}
