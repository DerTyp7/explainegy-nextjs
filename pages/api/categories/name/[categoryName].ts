import { Request, Response } from "express";

import { Category } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { ResponseError } from "../../../../types/responseErrors";


export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const categoryName: string = req.query.categoryName.toString() ?? undefined;

  await prisma.category
    .findUnique({ where: { name: categoryName }, include: { svg: true } })
    .then((result: Category) => {
      if (result !== null) {
        res.end(JSON.stringify(result));
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No category with this name found!",
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
