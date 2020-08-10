import { Pagination } from '../../common/types/pagination.entity';
import { PostEntity } from './post.entity';

export class HomepageEntity {
  data: HomepagePosts;
  pagination: Pagination;
}

export class HomepagePosts {
  popular: PostEntity[];
  recent: PostEntity[];
}
