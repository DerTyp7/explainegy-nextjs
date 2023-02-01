import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Article, Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";
import { title } from 'process';
import { UpdateArticle } from "../../../types/api";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") { //* GET
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
      // TODO filter with views
    }

    await prisma.article
      .findMany({
        where: { category: categoryName.length > 0 ? category : undefined },
        include: { category: true },
        take: limit,
        orderBy: orderByObj
      })
      .then((result: Article[]) => { //! ContentTableEntries not sorted
        if (result !== null) {
          res.end(JSON.stringify(result));
        } else {
          const error: ResponseError = {
            code: "404",
            message: "No articles found!",
          };
          res.status(404).json(error);
        }
      })
      .catch((err) => {
        const error: ResponseError = {
          code: "500",
          message: err,
        };
        res.status(500).json(JSON.stringify(error));
      });


  } else if (req.method == "POST") { //* POST
    const data: any = req.body;
    console.log(data)
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

    data.name = formatTextToUrlName(data.title);
    data.categoryId = data.categoryId.toString();

    prisma.article
      .create({ data: data, include: { category: true } })
      .then(
        (data) => {
          console.log("success")
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
