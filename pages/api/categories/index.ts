
import prisma, { CategoryWithIncludes } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Category, Svg } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";

import type { NextApiRequest, NextApiResponse } from 'next'
import { CreateCategory } from "@/types/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    console.log("API new category")
    const categoryData: CreateCategory = req.body;
    console.log(categoryData)

    if (!isValidText(categoryData.title)) {
      res.json({ target: "title", error: "Not a valid title" });
      return;
    }

    categoryData.svg.viewbox = categoryData.svg.viewbox.length > 1 ? categoryData.svg.viewbox : "";

    const newSvg: Prisma.SvgUncheckedCreateInput = {
      viewbox: categoryData.svg.viewbox,
      path: categoryData.svg.path
    }

    await prisma.svg
      .create({ data: newSvg })
      .then(
        async (createdSvg: Svg) => {
          const newCategory: Prisma.CategoryUncheckedCreateInput = {
            title: categoryData.title,
            name: formatTextToUrlName(categoryData.title),
            color: categoryData.color ?? "teal",
            svgId: createdSvg.id,
          }

          await prisma.category
            .create({
              data: newCategory,
              include: { svg: true, articles: true },
            })
            .then(
              (createdCategory: CategoryWithIncludes | null) => {
                if (createdCategory) {
                  res.json({ success: true, data: createdCategory });
                } else {
                  res.json({ error: true, message: "Could not create category" });
                }
              },
              (errorReason) => {
                console.log(errorReason)
                if (errorReason.code === "P2002") {
                  res.json({ target: errorReason.meta.target[0], error: "Already exists" });
                }
              }
            )
            .catch((err) => {
              console.error(err);
              res.status(500).end();
            });
        },
        (errorReason) => {
          res.status(500).end(errorReason);
        }
      )
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  }
}
