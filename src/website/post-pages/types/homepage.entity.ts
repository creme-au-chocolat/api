import { Pagination } from '../../common/types/pagination.interface';
import { PostEntity } from './post.entity';

export interface HomepageEntity {
  data: HomepagePosts;
  pagination: Pagination;
}

export type HomepagePosts = {
  popular: PostEntity[];
  recent: PostEntity[];
};
