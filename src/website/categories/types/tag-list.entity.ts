import { Pagination } from '../../common/types/pagination.entity';
import { TagWithCategory } from '../../../common/types/tag-with-category.entity';

export class TagListEntity {
  data: TagWithCategory[];
  pagination: Pagination;
}
