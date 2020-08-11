import { Pagination } from '../../../shared/types/pagination.entity';
import { TagWithCategory } from '../../../shared/types/tag-with-category.entity';

export class TagListEntity {
  data: TagWithCategory[];
  pagination: Pagination;
}
