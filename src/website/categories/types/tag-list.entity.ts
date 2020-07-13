import { Tag } from '../../common/types/tag.entity';
import { Pagination } from '../../common/types/pagination.entity';

export class TagListEntity {
  data: Tag[];
  pagination: Pagination;
}
