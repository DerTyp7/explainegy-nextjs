import { Category } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { ResponseError } from "../../../../types/responseErrors";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categoryName: string = req.query.categoryName.toString() ?? undefined;

  await prisma.category
    .findUnique({ where: { name: categoryName }, include: { svg: true } })
    .then((result: Category) => {
      if (result !== null) {
        res.json(result);
      } else {
        const error: ResponseError = {
          code: "404",
          message: "No category with this name found!",
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
}
