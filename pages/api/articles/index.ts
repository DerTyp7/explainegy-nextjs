import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
//@ts-ignore
import { Prisma } from "@prisma/client";
//@ts-ignore
import { Article, Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";
import { title } from 'process';
import { UpdateArticle } from "../../../types/api";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  if (req.method == "GET") {
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
  } else if (req.method == "POST") {
    const data: any = req.body;

    if (!isValidText(data.title)) {
      res.send(JSON.stringify({ target: "title", error: "Not a valid title" }));
      return;
    }

    if (!isValidText(data.introduction)) {
      res.send(JSON.stringify({ target: "introduction", error: "Not a valid introduction" }));
      return;
    }

    if (!data.categoryId) {
      res.send(JSON.stringify({ target: "category", error: "Category is required" }));
      return;
    }

    data.name = formatTextToUrlName(data.title);
    prisma.article
      .create({ data: data, include: { category: true } })
      .then(
        (data) => {
          res.send(JSON.stringify({ success: true, data: data }));
        },
        (errorReason) => {
          if (errorReason.code === "P2002") {
            res.send(JSON.stringify({ target: errorReason.meta.target[0], error: "Already exists" }));
          }
        }
      )
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).end();
      });
  } else if (req.method == "PUT") {
    const data: UpdateArticle = req.body;

    if (!isValidText(data.title)) {
      res.send(JSON.stringify({ target: "title", error: "Not a valid title" }));
      return;
    }

    if (!isValidText(data.introduction)) {
      res.send(JSON.stringify({ target: "introduction", error: "Not a valid introduction" }));
      return;
    }

    if (!data.categoryId) {
      res.send(JSON.stringify({ target: "category", error: "Category is required" }));
      return;
    }

    const newArticle: Prisma.ArticleUncheckedUpdateInput = {
      title: data.title,
      name: formatTextToUrlName(data.title),
      introduction: data.introduction,
      //@ts-ignore
      categoryId: data.categoryId,
      contentTable: data.contentTable,
      markdown: data.markdown,
      //@ts-ignore
      imageId: data.imageId,
    }

    await prisma.article.update({ data: newArticle, where: { id: data.id }, include: { category: true } })
      .then(
        (data) => {
          res.send(JSON.stringify({ success: true, data: data }));
        },
        (errorReason) => {
          if (errorReason.code === "P2002") {
            res.send(JSON.stringify({ target: errorReason.meta.target[0], error: "Already exists" }));
          }
        }
      )
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).end();
      });
  }

}
