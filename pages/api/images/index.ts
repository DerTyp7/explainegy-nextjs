import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");

  if (req.method == "GET") {
    res.send(await prisma.image.findMany())
  }
}