import { Tag } from '../../common/types/tag.interface';

export interface PostDetailsEntity {
  id?: number;
  name?: Name;
  thumbnail?: string;
  tags?: Tag[];
  languages?: Tag[];
  artists?: Tag[];
  categories?: Tag[];
  parodies?: Tag[];
  groups?: Tag[];
  characters?: Tag[];
  pages?: number;
  uploadDate?: string;
}

type Name = {
  before: string;
  after: string;
  content: string;
};
