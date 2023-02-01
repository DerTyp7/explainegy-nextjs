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

  title?: string;
  svg?: {
    path?: string;
    viewbox?: string;
  }
  color?: string;
}
