import { Prisma, Article } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from 'next'
import { UpdateArticle } from "../../../types/api";
import { isValidText } from "../../../validators";

type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { contentTableEntries: true, category: true, image: true } }>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method == "PUT") {//* PUT
    console.log("PUT")
    const articleId: string = formatTextToUrlName(req.query?.articleId?.toString() ?? "")

    console.log(`API articleId: ${articleId}`)
    const articleData: UpdateArticle = req.body;

    if (articleData.title && !isValidText(articleData.title)) {
      res.json({ target: "title", error: "Not a valid title" });
      return;
    }

    if (articleData.introduction && !isValidText(articleData.introduction)) {
      res.json({ target: "introduction", error: "Not a valid introduction" });
      return;
    }

    const newArticle: Prisma.ArticleUncheckedUpdateInput = {
      title: articleData.title ?? undefined,
      name: articleData.title ? formatTextToUrlName(articleData.title) : undefined,
      introduction: articleData.introduction ?? undefined,

      categoryId: articleData.categoryId ?? undefined,
      contentTable: articleData.contentTable ?? undefined,
      markdown: articleData.markdown ?? undefined,
      imageUrl: articleData.imageUrl ?? undefined,
    }
    console.log(newArticle)
    await prisma.article.update({ data: newArticle, where: { id: articleId }, include: { category: true } })
      .then(
        (data) => {
          res.json({ success: true, data: data });
        },
        (errorReason) => {
          console.log(errorReason)
          if (errorReason.code === "P2002") {
            res.json({ target: errorReason.meta.target[0], error: "Already exists" });
          }
        }
      )
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  }

}
