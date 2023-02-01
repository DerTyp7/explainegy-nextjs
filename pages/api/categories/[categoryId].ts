import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { Prisma } from "@prisma/client";

import type { NextApiRequest, NextApiResponse } from 'next'
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categoryId: string = req.query.categoryId.toString() ?? undefined;

  if (req.method == "GET") {
    await prisma.category
      .findUnique({ where: { id: categoryId }, include: { svg: true } })
      .then((result: Category) => {
        if (result !== null) {
          res.json(result);
        } else {
          const error: ResponseError = {
            code: "404",
            message: "No category with this id found!",
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

  } else if (req.method == "PUT") {
    const data: any = req.body;
    if (!isValidText(data.title)) {
      res.json({ target: "title", error: "Not a valid title" });
      return;
    }

    data.name = formatTextToUrlName(data.title);

    console.log(data);
    const newSvg: Prisma.SvgUncheckedUpdateInput = {
      viewbox: data.svg.viewbox,
      path: data.svg.path,
    };

    const newCategory: Prisma.CategoryUncheckedUpdateInput = {
      title: data.title,
      name: data.name,
      color: data.color,
    };

    await prisma.category
      .update({
        data: newCategory,
        where: { id: categoryId },
        include: { svg: true },
      })
      .then(
        async (categoryData) => {
          console.log("2");
          await prisma.svg
            .update({ data: newSvg, where: { id: categoryData.svg.id } })
            .then(
              (svgData) => {
                console.log("3");
                res.json({ success: true, data: categoryData });
              },
              (errorReason) => {
                res.status(500).end(errorReason);
              }
            )
            .catch((err) => {
              console.error(err);
              res.status(500).end();
            });
        },
        (errorReason) => {
          console.log(errorReason);
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
