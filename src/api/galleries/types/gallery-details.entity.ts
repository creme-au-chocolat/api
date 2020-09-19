import { HtmlTag } from 'src/shared/types/html-tag.entity';

class Name {
  before: string;
  after: string;
  content: string;
}

export class GalleryDetailsEntity {
  id?: number;
  internalId?: number;
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
