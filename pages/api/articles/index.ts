import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Article, Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const categoryName: string = req.query.categoryName?.toString() ?? "";
  const limit: number = req.query.limit ? Number(req.query.limit) : undefined;
  const orderBy: string = req.query.orderBy?.toString() ?? "";

  const category = await prisma.category.findUnique({ where: { name: categoryName } });

  let orderByObj: Prisma.Enumerable<Prisma.ArticleOrderByWithRelationInput>;

  if (orderBy === "recent") {
    orderByObj = {
      dateCreated: "desc"
    }
  } else if (orderBy === "popularity") {

  }


  await prisma.article
    .findMany({
      where: { category: categoryName.length > 0 ? category : undefined },
      include: { category: true, contentTableEntries: true },
      take: limit,
      orderBy: orderByObj
    })
    .then((result: Article[]) => {
      if (result !== null) {

        res.end(JSON.stringify(result));
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No articles found!",
        };
        res.status(404).send(JSON.stringify(error));
      }
    })
    .catch((err) => {
      const error: ResponseError = {
        code: "500",
        message: err,
      };
      res.status(500).send(JSON.stringify(error));
    });
}
