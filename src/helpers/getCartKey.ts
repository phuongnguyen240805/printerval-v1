export const getCartKey = () => {
  if (typeof window === "undefined") return "medusa_cart_id_guest";

  // Lấy thông tin user đã lưu khi login (giả sử bạn lưu vào localStorage sau khi login)
  const userData = localStorage.getItem("medusa_user");
  if (userData) {
    const customer = JSON.parse(userData);
    return `medusa_cart_id_${customer.id}`;
  }

  return "medusa_cart_id_guest"; // Key cho khách vãng lai
};