export function AiCatalogStatus({
  loading,
  error,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center"
      role={error ? "alert" : "status"}
    >
      <p>
        {loading
          ? "Đang tải các gói AI từ Medusa…"
          : error || "Không tìm thấy gói AI này."}
      </p>
      {onRetry && (
        <button
          type="button"
          data-catalog-variant="primary"
          className="px-6 py-3"
          onClick={onRetry}
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
