import { Prisma, Article } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from 'next'
import { UpdateArticle } from "../../../types/api";
import { isValidText } from "../../../validators";

type ArticleWithIncludes = Prisma.ArticleGetPayload<{ include: { contentTableEntries: true, category: true, image: true } }>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const articleId: string = formatTextToUrlName(req.query.articleId.toString())

  if (req.method == "GET") { //* GET
    await prisma.article
      .findUnique({ where: { id: articleId }, include: { category: true, image: true } })
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
  } else if (req.method == "PUT") {//* PUT
    const data: UpdateArticle = req.body;

    if (!isValidText(data.title)) {
      res.json({ target: "title", error: "Not a valid title" });
      return;
    }

    if (!isValidText(data.introduction)) {
      res.json({ target: "introduction", error: "Not a valid introduction" });
      return;
    }

    if (!data.categoryId) {
      res.json({ target: "category", error: "Category is required" });
      return;
    }

    const newArticle: Prisma.ArticleUncheckedUpdateInput = {
      title: data.title,
      name: formatTextToUrlName(data.title),
      introduction: data.introduction,

      categoryId: data.categoryId.toString(),
      contentTable: data.contentTable,
      markdown: data.markdown,
      imageId: data.imageId.toString(),
    }

    await prisma.article.update({ data: newArticle, where: { id: articleId }, include: { category: true } })
      .then(
        (data) => {
          res.json({ success: true, data: data });
        },
        (errorReason) => {
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
