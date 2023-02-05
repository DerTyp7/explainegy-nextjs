import { Article, Category } from '@prisma/client';
import { Prisma } from "@prisma/client";
import urlJoin from "url-join";
import { apiUrl } from "../global";

const GLOBAL_NO_CACHE: boolean = true;
export type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { category: true, image: true } }>
export type CategoryWithIncludes = Prisma.CategoryGetPayload<{ include: { svg: true } }>

export interface FetchError {
  code: number;
  message?: string;
  data?: any;
}

export class FetchManager {


  static Article = class {
    static async list(noCache: boolean = false): Promise<ArticleWithIncludes[]> {
      console.log(urlJoin(apiUrl, `articles`))
      const response = await fetch(urlJoin(apiUrl, `articles`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })
      return await response.json()
    }

    static async get(id: string, noCache: boolean = false): Promise<ArticleWithIncludes> {
      urlJoin(apiUrl, `articles/${id}`)
      const response = await fetch(urlJoin(apiUrl, `articles/${id}`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })

      return await response.json()
    }

    static async getByName(name: string, noCache: boolean = false): Promise<ArticleWithIncludes> {

      const response = await fetch(urlJoin(apiUrl, `articles/name/${name}`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })
      return await response.json()
    }

    static async getByCategory(name: string, noCache: boolean = false): Promise<ArticleWithIncludes[]> {

      const response = await fetch(urlJoin(apiUrl, `articles?categoryName=${name}`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })
      return await response.json()
    }
  }


  static Category = class {
    static async list(noCache: boolean = false): Promise<CategoryWithIncludes[]> {
      const response = await fetch(urlJoin(apiUrl, `categories`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })
      return await response.json()
    }

    static async get(id: string, noCache: boolean = false): Promise<CategoryWithIncludes> {
      const response = await fetch(urlJoin(apiUrl, `categories/${id}`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })

      return await response.json()
    }

    static async getByName(name: string, noCache: boolean = false): Promise<CategoryWithIncludes> {

      const response = await fetch(urlJoin(apiUrl, `categories/name/${name}`), {
        cache: GLOBAL_NO_CACHE || noCache ? "no-cache" : "force-cache",
        next: { revalidate: 60 * 10 },
      })
      return await response.json()
    }
  }

}

