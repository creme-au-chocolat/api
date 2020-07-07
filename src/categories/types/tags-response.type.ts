import { Tag } from '../../common/types/tag.type';
import { Pagination } from '../../common/types/pagination.type';

export interface TagsResponse {
  data: Tag[];
  pagination: Pagination;
}
