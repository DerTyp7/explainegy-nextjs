import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatTextToUrlName } from '../../utils';
import { Prisma } from '@prisma/client';

type SearchArticle = Prisma.ArticleGetPayload<{ select: { title: true, name: true } }>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let query: string = req.query.q?.toString() ?? "";
  query = formatTextToUrlName(query)
  if (query.length > 0) {
    await prisma.article.findMany({
      select: { title: true, name: true },
      take: 5,
    }).then((result: SearchArticle[]) => {
      let searchResult: SearchArticle[] = []
      result.forEach((a: SearchArticle) => {
        if (a.name.includes(query)) {
          searchResult.push(a);
        }
      });
      res.status(200).json(searchResult);
    }, (err: any) => {
      console.log(err)
      res.status(200).json([]);
    });
  } else {
    res.status(200).json([]);
  }
}