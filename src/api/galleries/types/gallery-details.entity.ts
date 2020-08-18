import { HtmlTag } from 'src/shared/types/html-tag.entity';

type Name = {
  before: string;
  after: string;
  content: string;
};

export class GalleryDetailsEntity {
  id?: number;
  name?: Name;
  thumbnail?: string;
  tags?: HtmlTag[];
  languages?: HtmlTag[];
  artists?: HtmlTag[];
  categories?: HtmlTag[];
  parodies?: HtmlTag[];
  groups?: HtmlTag[];
  characters?: HtmlTag[];
  pages?: number;
  uploadDate?: string;
}
