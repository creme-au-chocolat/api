import { Tag } from '../../common/types/tag.interface';
import { Pagination } from '../../common/types/pagination.interface';

export interface TagListEntity {
  data: Tag[];
  pagination: Pagination;
}
