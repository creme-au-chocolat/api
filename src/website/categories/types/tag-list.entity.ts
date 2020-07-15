import { Pagination } from '../../common/types/pagination.entity';
import { TagWithCategory } from './tag-with-category.entity';

export class TagListEntity {
  data: TagWithCategory[];
  pagination: Pagination;
}
