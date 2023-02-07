import { IContentTableEntry } from "./contentTable";
import { Prisma } from '@prisma/client';

export interface CreateArticle {
  title: string;
  markdown: string;
  introduction: string;
  categoryId: string;
  contentTable: Prisma.JsonArray
  imageUrl?: string;
}

export interface UpdateArticle {

  title?: string;
  markdown?: string;
  introduction?: string;
  categoryId?: string;
  contentTable?: Prisma.JsonArray
  imageUrl?: string;
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
