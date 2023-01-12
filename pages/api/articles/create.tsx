import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { Article, Category } from "@prisma/client";
import { ResponseError } from "../../../types/responseErrors";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  await prisma.article.create({ data: req.body });
  console.log();
}
