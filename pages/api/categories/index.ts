import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Category, Svg } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";
import { formatTextToUrlName } from "../../../utils";
import { isValidText } from "../../../validators";
import { title } from "process";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  if (req.method == "GET") {
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
  } else if (req.method == "POST") {
    const data: any = req.body;
    if (!isValidText(data.title)) {
      res.send(JSON.stringify({ target: "title", error: "Not a valid title" }));
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
                res.send(JSON.stringify({ success: true, data: data }));
              },
              (errorReason) => {
                if (errorReason.code === "P2002") {
                  res.send(JSON.stringify({ target: errorReason.meta.target[0], error: "Already exists" }));
                }
              }
            )
            .catch((err) => {
              console.error(err);
              res.sendStatus(500).end();
            });
        },
        (errorReason) => {
          res.sendStatus(500).end(errorReason);
        }
      )
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).end();
      });
  } else if (req.method == "PUT") {
    const data: any = req.body;
    if (!isValidText(data.title)) {
      res.send(JSON.stringify({ target: "title", error: "Not a valid title" }));
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
        where: { id: data.id },
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
                res.send(JSON.stringify({ success: true, data: categoryData }));
              },
              (errorReason) => {
                res.sendStatus(500).end(errorReason);
              }
            )
            .catch((err) => {
              console.error(err);
              res.sendStatus(500).end();
            });
        },
        (errorReason) => {
          console.log(errorReason);
          if (errorReason.code === "P2002") {
            res.send(JSON.stringify({ target: errorReason.meta.target[0], error: "Already exists" }));
          }
        }
      )
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).end();
      });
  }
}
