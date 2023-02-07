import { CreateArticle } from "@/types/api";
import prisma, { ArticleWithIncludes } from "../../../lib/prisma";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";


import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") { //* POST
    console.log("API new article")
    const articleData: CreateArticle = req.body
    console.log(articleData)


    if (!isValidText(articleData.title)) {
      res.status(500).json({ target: "title", error: "Not a valid title" });
      return;
    }

    if (!isValidText(articleData.introduction)) {
      res.status(500).json({ target: "introduction", error: "Not a valid introduction" });
      return;
    }

    if (!articleData.categoryId) {
      res.status(500).json({ target: "category", error: "Category is required" });
      return;
    }

    const newArticle: Prisma.ArticleUncheckedCreateInput = {
      title: articleData.title,
      name: formatTextToUrlName(articleData.title),
      introduction: articleData.introduction,
      categoryId: articleData.categoryId,
      markdown: articleData.markdown ?? "",
      contentTable: articleData.contentTable ?? {},
      imageUrl: articleData.imageUrl ?? ""
    }

    prisma.article
      .create({ data: newArticle, include: { category: true } })
      .then(
        (data: ArticleWithIncludes) => {
          res.json({ success: true, data: data });
        },
        (errorReason) => {
          console.log("reason", errorReason)
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
