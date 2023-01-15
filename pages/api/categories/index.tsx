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
        console.log("No categories found");
        res.end(JSON.stringify([]));
      }
    })
    .catch((err) => {
      console.log(err);
      res.end(JSON.stringify([]));
    });
}
