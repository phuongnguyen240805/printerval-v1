import type { NextApiRequest, NextApiResponse } from "next";
import {
  AiCatalogError,
  getAiCatalog,
} from "@/shared/features/ai-catalog/service.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });
  }
  res.setHeader("Cache-Control", "no-store");
  try {
    return res.status(200).json(await getAiCatalog());
  } catch (error) {
    const known = error instanceof AiCatalogError;
    return res
      .status(known ? error.status : 502)
      .json({ code: known ? error.code : "AI_CATALOG_UPSTREAM" });
  }
}
