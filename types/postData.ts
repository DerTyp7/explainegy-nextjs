import { IContentTableEntry } from "./contentTable";

export interface PostArticle {
  title: string;
  name?: string;
  markdown: string;
  introduction: string;
  categoryId: number;
  contentTable: IContentTableEntry[]
  imageId?: number;
}
