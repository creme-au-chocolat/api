import { Tag } from 'src/shared/types/tag.entity';
import { Pagination } from '../../../shared/types/pagination.entity';

export class TagListEntity {
  data: Tag[];
  pagination: Pagination;
}
