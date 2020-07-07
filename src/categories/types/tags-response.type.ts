import { Tag } from '../../common/types/tag.type';

export interface TagsResponse {
  data: Tag[];
  pagination: Pagination;
}

type Pagination = {
  page: number;
};
