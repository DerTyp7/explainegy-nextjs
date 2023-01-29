import { IContentTableEntry } from "./contentTable";
import { Prisma } from '@prisma/client';

export interface CreateArticle {
  title: string;
  markdown: string;
  introduction: string;
  categoryId: number;
  contentTable: Prisma.JsonArray
  imageId?: number;
}

export interface UpdateArticle {
  id: string;
  title?: string;
  markdown?: string;
  introduction?: string;
  categoryId?: number;
  contentTable?: Prisma.JsonArray
  imageId?: number;
}

export interface CreateCategory {
  title: string;
  svg: {

    path: string;
    viewbox: string;
  }
  color: string;
}
export interface UpdateCategory {
  id: string;
  title?: string;
  svg?: {
    path?: string;
    viewbox?: string;
  }
  color?: string;
}
