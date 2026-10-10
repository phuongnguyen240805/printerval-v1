import { useRouter } from "next/router";
import { AiAccountDetailPage } from "../page/AiAccountDetailPage/AiAccountDetailPage";
import { AiProductDetailPage } from "../page/AiAccountDetailPage/AiProductDetailPage";
import { useAiCatalog } from "./useAiCatalog";
import { AiCatalogStatus } from "./AiCatalogStatus";

export function AiCatalogDetailRoute({ param }: { param: "id" | "slug" }) {
  const router = useRouter();
  const catalog = useAiCatalog();
  if (!router.isReady || catalog.isLoading) return <AiCatalogStatus loading />;
  if (catalog.isError)
    return (
      <AiCatalogStatus
        error={
          catalog.error instanceof Error
            ? catalog.error.message
            : "Không tải được gói AI."
        }
        onRetry={() => void catalog.refetch()}
      />
    );
  const identifier = router.query[param];
  const product = catalog.data?.products.find(
    (p) => p.id === identifier || p.handle === identifier,
  );
  if (!product) return <AiCatalogStatus />;
  const detail = catalog.data?.details[product.handle || product.id];
  return product.type === "marketplace" && detail ? (
    <AiAccountDetailPage key={product.id} data={detail} />
  ) : (
    <AiProductDetailPage key={product.id} product={product} />
  );
}
