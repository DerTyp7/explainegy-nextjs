
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Category, Svg } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") { //* GET
    await prisma.category
      .findMany({ include: { svg: true } })
      .then((result: Category[]) => {
        if (result !== null) {
          res.json(result);
        } else {
          console.log("No categories found");
          res.json([]);
        }
      })
      .catch((err) => {
        console.log(err);
        res.json([]);
      });
  } else if (req.method == "POST") {
    const data: any = req.body;
    if (!isValidText(data.title)) {
      res.json({ target: "title", error: "Not a valid title" });
      return;
    }

    data.name = formatTextToUrlName(data.title);
    data.svg.viewbox = data.svg.viewbox.length > 1 ? data.svg.viewbox : null;
    console.log(data);

    await prisma.svg
      .create({ data: data.svg })
      .then(
        async (svgData) => {
          await prisma.category
            .create({
              data: { title: data.title, name: data.name, color: data.name, svgId: svgData.id },
              include: { svg: true },
            })
            .then(
              (data) => {
                res.json({ success: true, data: data });
              },
              (errorReason) => {
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
