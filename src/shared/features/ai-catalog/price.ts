export function formatAiPrice(
  amount: number,
  currencyCode = "vnd",
  hasPrice = true,
) {
  if (!hasPrice) return "Chưa có giá";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: currencyCode.toLowerCase() === "vnd" ? 0 : 2,
  }).format(amount);
}
