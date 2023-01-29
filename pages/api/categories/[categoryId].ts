import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  const categoryId: string = req.query.categoryId.toString() ?? undefined;

  await prisma.category
    .findUnique({ where: { id: categoryId }, include: { svg: true } })
    .then((result: Category) => {
      if (result !== null) {
        res.end(JSON.stringify(result));
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No category with this id found!",
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
