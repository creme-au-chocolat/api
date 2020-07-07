export interface DetailsResponse {
  id?: number;
  name?: string;
  thumbnail?: string;
  tags?: TagComponent[];
  languages?: TagComponent[];
  artists?: TagComponent[];
  categories?: TagComponent[];
  parodies?: TagComponent[];
  groups?: TagComponent[];
  characters?: TagComponent[];
  pages?: number;
  uploadDate?: string;
}

export type TagComponent = {
  name: string;
  tagged: number;
  uri: string;
};
