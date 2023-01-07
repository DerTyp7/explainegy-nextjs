import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  await prisma.category
    .findMany({ include: { svg: true } })
    .then((result: Category[]) => {
      if (result !== null) {
        res.end(JSON.stringify(result));
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No categories found!",
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
