import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Article } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const articleName: string = req.query.articleName.toString();

  await prisma.article
    .findUnique({ where: { name: articleName }, include: { category: true, contentTableEntries: true } })
    .then((result: Article) => {
      if (result !== null) {
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
