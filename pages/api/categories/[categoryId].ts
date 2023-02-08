import prisma, { CategoryWithIncludes } from "../../../lib/prisma";
import { Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { Prisma } from "@prisma/client";

import type { NextApiRequest, NextApiResponse } from 'next'
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";
import { UpdateCategory } from '../../../types/api';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categoryId: string = req.query.categoryId?.toString() ?? "";

  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == "PUT") {

      const categoryData: UpdateCategory = req.body;

      if (categoryData.title && !isValidText(categoryData.title)) {
        res.json({ target: "title", error: "Not a valid title" });
        return;
      }

      const newSvg: Prisma.SvgUncheckedUpdateInput = {
        viewbox: categoryData.svg?.viewbox ?? undefined,
        path: categoryData.svg?.path ?? undefined,
      };

      const newCategory: Prisma.CategoryUncheckedUpdateInput = {
        title: categoryData.title ?? undefined,
        name: categoryData.title ? formatTextToUrlName(categoryData.title) : undefined,
        color: categoryData.color ?? undefined,
      };

      await prisma.category
        .update({
          data: newCategory,
          where: { id: categoryId },
          include: { svg: true },
        })
        .then(
          async (categoryData) => {
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
    } else if (req.method == "DELETE") {
      console.log("DELETE category")
      prisma.category.delete({ where: { id: categoryId }, include: { articles: true, svg: true } }).then((result: CategoryWithIncludes | null) => {
        if (result) {
          res.status(200).json(result)
        } else {
          res.status(500).json({ error: true, message: "No category found" })
        }
      }, (err) => {
        console.log(err)
        res.status(500).end(err)
      })
    }
  } else {
    res.status(403).json({ error: true, message: "Authorization Required" });
  }
}
