import { Prisma, Article } from "@prisma/client";
import { Request, Response } from "express";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import prisma from "../../../lib/prisma";


type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { contentTableEntries: true, category: true, image: true } }>



export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const articleId: string = formatTextToUrlName(req.query.articleId.toString())

  await prisma.article
    .findUnique({ where: { id: articleId }, include: { category: true, image: true } })
    .then((result: ArticleWithIncludes) => {
      if (result !== null) {
        res.end(JSON.stringify(result));
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No article with this name found!",
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
