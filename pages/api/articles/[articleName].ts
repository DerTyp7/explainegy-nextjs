import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma, ContentTableEntry } from '@prisma/client';
import { ResponseError } from "../../../types/responseErrors";
import { getUrlSafeString } from "../../../app/utils";

type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { contentTableEntries: true, category: true, image: true } }>

function sortContentTableEntries(entries: ContentTableEntry[]): ContentTableEntry[] {
  return entries.sort((a, b) => a.orderIndex - b.orderIndex);
}


export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const articleName: string = getUrlSafeString(req.query.articleName.toString())
  console.log(articleName)
  await prisma.article
    .findUnique({ where: { name: articleName }, include: { category: true, contentTableEntries: true, image: true } })
    .then((result: ArticleWithIncludes) => {
      if (result !== null) {
        result.contentTableEntries = sortContentTableEntries(result.contentTableEntries);
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
