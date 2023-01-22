import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Article, Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { PostArticle } from "../../../types/postData";
import { isValidText } from "../../../validators";
import { formatTextToUrlName } from "../../../utils";
import { json } from "stream/consumers";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const postData: any = req.body;
  console.log(postData);
  if (!isValidText(postData.title)) {
    res.send(JSON.stringify({ target: "title", error: "Not a valid title" }));
    return;
  }

  if (!isValidText(postData.introduction)) {
    res.send(JSON.stringify({ target: "introduction", error: "Not a valid introduction" }));
    return;
  }

  if (!postData.categoryId) {
    res.send(JSON.stringify({ target: "category", error: "Category is required" }));
    return;
  }

  postData.name = formatTextToUrlName(postData.title);
  prisma.article
    .create({ data: postData, include: { category: true } })
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
