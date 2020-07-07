import { Pagination } from '../../common/types/pagination.type';

export interface PostResponse {
  data: PostComponent[];
  pagination: Pagination;
}

export type PostComponent = {
  thumbnail: string;
  name: string;
  lang: string;
  id: number;
};
