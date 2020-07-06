export interface TagsResponse {
  data: Tag[];
  pagination: Pagination;
}

type Pagination = {
  page: number;
};

export type Tag = {
  name: string;
  tagged: number;
  uri: string;
};
