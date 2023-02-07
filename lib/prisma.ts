
import { Prisma, PrismaClient } from "@prisma/client";


declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    // @ts-ignore
    if (!global.prisma) {
      // @ts-ignore
      global.prisma = new PrismaClient();
    }
    // @ts-ignore
    prisma = global.prisma;
  }
}
// @ts-ignore
export default prisma;

export type CategoryWithIncludes = Prisma.CategoryGetPayload<{ include: { articles: true, svg: true } }>
export type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { category: true } }>
