import prisma from "../../../../lib/prisma";
import { Prisma } from '@prisma/client';
import { ResponseError } from "../../../../types/responseErrors";
import { formatTextToUrlName } from "../../../../utils";
import type { NextApiRequest, NextApiResponse } from 'next'

type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { category: true, image: true } }>



export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  const articleName: string = formatTextToUrlName(req.query.articleName.toString())
  await prisma.article
    .findUnique({ where: { name: articleName }, include: { category: true, image: true } })
    .then((result: ArticleWithIncludes) => {

      if (result !== null) {
        res.json(result);
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No article with this name found!",
        };
        res.status(404).json(error);
      }
    })
    .catch((err) => {

      const error: ResponseError = {
        code: "500",
        message: err,
      };
      res.status(500).json(error);
    });
}
