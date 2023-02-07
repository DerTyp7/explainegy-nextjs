import prisma from "../../../../lib/prisma";
import { Prisma } from '@prisma/client';
import { ResponseError } from "../../../../types/responseErrors";
import { formatTextToUrlName } from "../../../../utils";
import type { NextApiRequest, NextApiResponse } from 'next'

type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { category: true, image: true } }>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const articleName: string = formatTextToUrlName(req.query.articleName.toString())
  console.log(`API: articleName: ${articleName}`)
  await prisma.article
    .findUnique({ where: { name: articleName }, include: { category: true, image: true } })
    .then((result: ArticleWithIncludes) => {
      console.log("result", result)
      if (result !== null) {
        console.log("send")
        res.json(result);
      } else {
        console.log("response no article found")
        const error: ResponseError = {
          code: "404",
          message: "No article with this name found!",
        };
        res.status(404).json(error);
      }
    }, (err) => {

      console.log("reason", err)
    })
    .catch((err) => {
      console.log("catch", err)
      const error: ResponseError = {
        code: "500",
        message: err,
      };
      res.status(500).json(error);
    });
}
