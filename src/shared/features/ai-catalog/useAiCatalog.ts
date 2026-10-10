import { useQuery } from "@tanstack/react-query";
import type { AiCatalog } from "./types";

async function fetchAiCatalog(): Promise<AiCatalog> {
  const response = await fetch("/api/ai-catalog", {
    signal: AbortSignal.timeout(45000),
  });
  const data = await response.json();
  if (!response.ok) {
    const configuration = ["AI_CATALOG_CONFIG", "AI_CATALOG_ACCESS"].includes(
      data.code,
    );
    throw new Error(
      data.code === "AI_CATALOG_CHANNEL"
        ? "Publishable API key chưa được gắn Sales Channel. Hãy gắn key với kênh chứa các gói AI trong Medusa Admin."
        : configuration
        ? "Chưa kết nối được Medusa. Cần kiểm tra backend URL, Publishable API key và Sales Channel."
        : "Không tải được các gói AI. Vui lòng thử lại.",
    );
  }
  return data as AiCatalog;
}

export function useAiCatalog() {
  return useQuery({
    queryKey: ["medusa-ai-catalog"],
    queryFn: fetchAiCatalog,
    staleTime: 60000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
