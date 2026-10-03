"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { CiFlag1, CiRuler } from "react-icons/ci";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import Image from "next/image";
import { PiShootingStarFill } from "react-icons/pi";
import { MdLibraryBooks, MdLocalShipping } from "react-icons/md";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useEffect, useState, useMemo, useCallback } from "react";
import clsx from "clsx";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { ChevronDown, Heart, Trash2, Palette, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { mockProduct, isCustomizableProduct, getCustomizationByHandle } from "@/lib/mockProduct";
import { PrintLocationSelector } from "@/packages/product-asset/print-location";
import { CustomizationController } from "@/packages/customization";
import { MiniCartSheet } from "@/shared/features/page/cart/MiniCartSheet";
import { api } from "@/utils/api";
import { medusaClient } from "@/lib/medusaClient";
import { getCartKey } from "@/helpers/getCartKey";

const Detail = ({ product, cart = [], addToCart, createCart, boughtTogetherSelections = new Set(), boughtTogetherProducts = [], rating = 5, reviewCount = 0, onCustomizationApply }: {
  product?: any;
  cart: any[];
  boughtTogetherSelections?: Set<string>;
  boughtTogetherProducts?: any[];
  rating?: number; // Điểm đánh giá trung bình
  reviewCount?: number; // Tổng số review
  onCustomizationApply?: (payload: any, template: any) => void;
  addToCart: {
    mutate: (variables: { cart_id: string; variant_id: string; quantity: number; metadata?: Record<string, any> }) => void;
    isLoading: boolean;
  };
  createCart: {
    mutate: (variables?: any) => void;
    isLoading: boolean;
    data?: { cart: { id: string } };
  }
}) => {
  const safeProduct = product && Object.keys(product).length > 0 ? product : null;
  const customizationData = safeProduct?.handle ? getCustomizationByHandle(safeProduct.handle) : null;
  const Payment = ["affirm.svg", "after-pay.svg", "klarna.svg", "paypal.svg"];

  console.log('check product site detail:', safeProduct)

  const [showMore, setShowMore] = useState(false);
  const [mount, setMount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("Men");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [selectedPrintLocation, setSelectedPrintLocation] = useState<any>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customDesign, setCustomDesign] = useState<any>(null);
  const [displayCart, setDisplayCart] = useState<any[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 10, s: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        clearInterval(timer);
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (safeProduct) {
      const defaultVariant = safeProduct.options?.[0]?.values?.[0]?.value || "";
      const defaultColor = safeProduct.options?.find((o: any) => o.title.toLowerCase() === "color")?.values?.[0]?.value || "";
      setSelectedColor(defaultColor);
      setSelectedVariant(defaultVariant);

      if (safeProduct.id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setIsInWishlist(wishlist.includes(safeProduct.id));
      }
    }
  }, [safeProduct]);

  useEffect(() => {
    setQuantities(cart.map((item: any) => item.quantity));
  }, [cart]);

  // Load cart from localStorage and ensure prices are valid
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem('cart_items') || '[]');
        const validCart = cartData.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0, // Ensure price is a valid number
          quantity: Number(item.quantity) || 1,
        }));
        setDisplayCart(validCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setDisplayCart([]);
      }
    };

    // Initial load
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart:updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cart:updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const matchingVariant = useMemo(() => {
    if (!safeProduct?.variants || safeProduct.variants.length === 0) return null;

    // 1. Nếu chưa chọn bất kỳ option nào, trả về variant mặc định
    if (!selectedColor && !selectedVariant && !selectedSize) {
      return safeProduct.variants[0];
    }

    // 2. Tìm kiếm chính xác
    const exactMatch = safeProduct.variants.find((variant: any) => {
      const title = variant.title.toLowerCase();

      // Tách các thành phần trong title (thường phân cách bằng " / ")
      const titleParts = title.split("/").map((p: string) => p.trim());

      // Kiểm tra từng điều kiện (Nếu người dùng đã chọn thì PHẢI khớp)
      const matchesColor = selectedColor
        ? titleParts.includes(selectedColor.toLowerCase())
        : true;

      const matchesType = selectedVariant
        ? titleParts.includes(selectedVariant.toLowerCase())
        : true;

      const matchesSize = selectedSize
        ? titleParts.includes(selectedSize.toLowerCase())
        : true;

      // Chỉ trả về true nếu TẤT CẢ các lựa chọn hiện tại đều nằm trong title
      return matchesColor && matchesType && matchesSize;
    });

    // 3. Log để kiểm tra thực tế trong Console
    if (exactMatch) {
      console.log("✅ Đã tìm thấy Variant ID:", exactMatch.id);
    } else {
      console.warn("❌ Không tìm thấy variant nào khớp với lựa chọn.");
    }

    return exactMatch || null;
  }, [safeProduct?.variants, selectedColor, selectedVariant, selectedSize]);

  // console.log('check matching variant: ', matchingVariant.id, safeProduct.variants)

  const handleAddToCart = async () => {
    if (!matchingVariant?.id) {
      setCartMessage("Please select a variant before adding to cart.");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    setAddingToCart(true);

    try {
      const cartKey = getCartKey(); // Lấy key động: ví dụ medusa_cart_id_cus_123
      let currentCartId = localStorage.getItem(cartKey);
      const accessToken = sessionStorage.getItem("authToken");

      if (!currentCartId) {
        console.log("🛒 No Cart ID found, creating new cart...");
        const regionId = localStorage.getItem("selected_region") || "reg_01"; // Đảm bảo có fallback ID hợp lệ

        // Dùng await với mutateAsync để đợi server trả về ID mới
        const createResponse = await createCart.mutate({ id: regionId });

        if (createResponse?.cart?.id) {
          currentCartId = createResponse.cart.id;
          localStorage.setItem(cartKey, currentCartId as string);
          console.log("✅ New Cart ID saved to Local Storage:", currentCartId);
        } else {
          throw new Error("Failed to retrieve new Cart ID from server.");
        }
      }

      const addResponse = await addToCart.mutate({
        cart_id: currentCartId as string,
        variant_id: matchingVariant.id,
        quantity: mount,
      });

      if (addResponse?.cart) {
        updateLocalMirror(addResponse.cart);

        setCartMessage("Successfully added to cart!");

        window.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { cart: addResponse?.cart }
        }));
      }

      setTimeout(() => setCartMessage(""), 3000);

    } catch (error: any) {
      console.error("❌ Cart Logic Error:", error);

      // Xử lý lỗi đặc biệt: Nếu Cart ID ở local đã hết hạn hoặc bị xóa trên server Medusa
      if (error.message?.includes("not found") || error.shape?.message?.includes("not found")) {
        localStorage.removeItem("medusa_cart_id");
        setCartMessage("Cart session expired. Please try again.");
      } else {
        setCartMessage("Could not add to cart. Please try again later.");
      }
    } finally {
      setAddingToCart(false); // Tắt loading
    }
  };

  // Hàm cập nhật bản sao cart ở local (tùy chọn)
  const updateLocalMirror = (cartData: any) => {
    localStorage.setItem('cart_items', JSON.stringify(cartData.items));
  };

  const handleWishlistToggle = () => {
    if (!safeProduct?.id) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isInWishlist) {
      const updated = wishlist.filter((id: string) => id !== safeProduct.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsInWishlist(false);
    } else {
      wishlist.push(safeProduct.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const colorMap: Record<string, string> = {
    Black: "#111111",
    White: "#ffffff",
    Red: "#cc2222",
    Blue: "#2244aa",
    Green: "#22aa44",
    Gray: "#888888",
    Navy: "#1a2a5e",
    "Dark Gray": "#444444",
    "Light Blue": "#aaccee",
  };

  const typeOptions = ["Men", "Women", "Youth", "Kids"];
  const calculatedPrice = matchingVariant?.calculated_price?.calculated_amount || 14.95;
  const originalPrice = matchingVariant?.calculated_price?.original_amount || 29.90;
  const discountPct = Math.round(((originalPrice - calculatedPrice) / originalPrice) * 100);

  const colorOptions = safeProduct?.options?.find((opt: any) => opt.title.toLowerCase() === "color")?.values || [];
  const styleOptions = safeProduct?.options?.find((opt: any) => opt.title.toLowerCase() === "style")?.values || [];
  const sizeOptions = safeProduct?.options?.find((opt: any) => opt.title.toLowerCase() === "size")?.values || [];

  return (
    <div className="w-full px-1 sm:px-2 font-sans">

      {/* ── TITLE ── */}
      <h1 className="text-[20px] sm:text-base md:text-lg font-semibold text-gray-900 leading-snug mb-2">
        {safeProduct?.title}
      </h1>

      {/* ── ĐÁNH GIÁ + SỐ REVIEW + YÉU THØCH ── */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
        {/* Sao và điểm đánh giá thực */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-gray-800 underline">{rating.toFixed(1)}</span>
          <div className="flex text-orange-400 text-sm">
            {[...Array(5)].map((_, i) => {
              const index = i + 1;
              return (
                <span key={index}>
                  {rating >= index ? (
                    <BsStarFill />
                  ) : rating >= index - 0.5 ? (
                    <BsStarHalf />
                  ) : (
                    <BsStar />
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Số lượng review thực */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-3">
          <span className="font-bold text-gray-800 underline">{reviewCount}</span>
          <span className="text-gray-600">Đánh giá</span>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={clsx(
            "flex items-center gap-1.5 ml-auto text-sm border-l border-gray-300 pl-3 transition-colors",
            isInWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"
          )}
        >
          <Heart className={clsx("w-4 h-4", isInWishlist && "fill-red-500")} />
          <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
        </button>
      </div>

      {/* ── PROMO BANNER ── */}
      <div className="hidden sm:flex bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg overflow-hidden mb-3 text-xs">
        <div className="bg-[#fdd835] px-3 flex items-center justify-center flex-shrink-0">
          <Image src="/assets/early-bird.webp" width={40} height={40} alt="Early Bird" />
        </div>
        <div className="flex items-center divide-x divide-[#c8e6c9] w-full">
          <div className="flex items-center gap-2 px-4 py-2 flex-1">
            <Image src="/assets/verified_6764458.png" width={16} height={16} alt="check" />
            <span className="text-gray-700 line-clamp-2">
              Use Code <b>APPFRIEND</b> for $3 Off First App Order
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 flex-1">
            <Image src="/assets/verified_6764458.png" width={16} height={16} alt="check" />
            <span className="text-gray-700 line-clamp-2">
              $5 Credit for Late Delivery
            </span>
          </div>
        </div>
      </div>

      {/* ── PRICE BLOCK ── */}
      <div className="relative bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-3 shadow-sm">
        {/* FREE Returns - top right */}
        <div className="absolute top-3 right-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 h-auto rounded-lg font-semibold hover:bg-orange-100">
                FREE Returns <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50">
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold block mb-1">Return this item for free</span>

                Bạn có thể trả lại hàng miễn phí theo địa chỉ giao hàng đã chọn. Bạn có thể trả lại sản phẩm vì bất kỳ lý do gì, miễn là sản phẩm còn mới và chưa qua sử dụng: không mất phí vận chuyển trả lại.
              </p>
              <Link href="/" className="text-orange-500 text-xs mt-2 block">Read the full returns policy</Link>
            </PopoverContent>
          </Popover>
        </div>

        {/* Price row */}
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-bold text-green-700">${calculatedPrice.toFixed(2)}</span>
          <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{discountPct}% off</span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <span>St. Patrick's Day Sales ends in</span>
          <div className="flex items-center gap-1">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-green-700 text-white font-bold text-xs px-2 py-0.5 rounded min-w-[28px] text-center">{t}</span>
                {i < 2 && <span className="text-green-700 font-bold">:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TYPE (Men / Women / Youth / Kids) ── */}
      <div className="mb-4">
        <h3 className="font-bold underline text-sm mb-2">Type</h3>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-sans border transition-all",
                selectedType === type
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── STYLE DROPDOWN ── */}
      {styleOptions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold underline text-sm">Style</h3>
            <span className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
              <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold">?</span>
            </span>
          </div>
          <Select onValueChange={setSelectedVariant} defaultValue={styleOptions[0]?.value}>
            <SelectTrigger className="w-full h-10 text-sm border-gray-300 rounded-lg bg-white">
              <SelectValue placeholder="Choose style" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((item: any) => (
                <SelectItem key={item.id} value={item.value} className="text-sm">
                  {item.value} (${calculatedPrice.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── COLOR ── */}
      {colorOptions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold underline text-sm">
              Color: <span className="font-normal">{selectedColor}</span>
            </h3>
            <span className="text-xs text-gray-500 cursor-pointer hover:underline">+17 colors</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colorOptions.slice(0, 7).map((item: any) => {
              const bg = colorMap[item.value] || "#cccccc";
              const isSelected = selectedColor === item.value;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedColor(item.value)}
                  title={item.value}
                  className={clsx(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all relative flex-shrink-0",
                    isSelected
                      ? "border-blue-500 ring-2 ring-offset-2 ring-blue-400"
                      : "border-gray-200 hover:border-gray-400",
                    item.value === "White" && "shadow-inner border-gray-300"
                  )}
                  style={{ backgroundColor: bg }}
                >
                  {isSelected && (
                    <span className={clsx(
                      "absolute inset-0 flex items-center justify-center text-xs font-bold",
                      item.value === "White" ? "text-gray-800" : "text-white"
                    )}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SIZE DROPDOWN ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold underline text-sm">Size</h3>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:underline">
                <CiRuler size={14} /> View Size Guide
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Size Guide</DialogTitle>
                <DialogDescription>Size guide content here...</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <Select onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full h-10 text-sm border-gray-300 rounded-lg bg-white">
            <SelectValue placeholder="Choose a size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((item: any) => (
              <SelectItem key={item.id} value={item.value} className="text-sm">{item.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* ── CUSTOMIZE SECTION (if applicable) ── */}
      {isCustomizableProduct(safeProduct) && customizationData && (
        <div>
          <CustomizationController
            product={customizationData}
            template={customizationData?.template}
            onApply={useCallback((payload: any) => {
              const { design, elements } = payload || {};
              console.log('[Detail] onApply callback received:', { elements_count: elements?.length, elements, design });
              setCustomDesign(design);
              setIsCustomizing(design ? true : false);
              // Gọi callback để parent cập nhật preview
              if (onCustomizationApply) {
                console.log('[Detail] Calling onCustomizationApply with elements:', elements);
                onCustomizationApply({ design, elements }, customizationData?.template);
              }
            }, [onCustomizationApply])}
            onClose={() => {
              // No need to close, it's always visible
            }}
          />
        </div>
      )}
      {/* ── PRINT LOCATION ── */}
      {safeProduct?.print_locations?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold underline text-sm mb-2">
            Print Location: <span className="font-normal">{selectedPrintLocation?.position || "Front"}</span>
          </h3>
          <PrintLocationSelector
            positions={safeProduct.print_locations || []}
            additionalPrice={safeProduct.print_additional_prices || {}}
            categoryIds={safeProduct.categories?.map((c: any) => c.id) || []}
            defaultValue={safeProduct?.default_print_position}
            onChange={(selected) => setSelectedPrintLocation(selected)}
          />
        </div>
      )}


      {/* ── QUANTITY SECTION ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
          Quantity
          <button className="text-orange-500 hover:text-orange-600 transition-colors">
            Buying In Bulk?
          </button>
        </div>

        {/* Nút tăng giảm số lượng */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => mount > 1 && setMount(mount - 1)}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            −
          </button>

          <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border border-gray-300 rounded-md bg-white flex-shrink-0">
            {mount}
          </span>

          <button
            onClick={() => setMount(mount + 1)}
            className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
      {/* ── PAY ONLY SECTION ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex justify-between">
          <div className="flex items-end gap-2">
            <span className="text-sm text-gray-600 mb-1">Pay only</span>
            <span className="text-xl font-bold text-black-700">
              ${calculatedPrice.toFixed(2)}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-600 flex items-center gap-2">
          <span>Interest-free with</span>
          <div className="flex items-center gap-1.5">
            <Image src="/assets/payments/klarna.svg" width={40} height={24} alt="Klarna" className="h-5 w-auto" />
            <Image src="/assets/payments/after-pay.svg" width={40} height={24} alt="Afterpay" className="h-5 w-auto" />
            <Image src="/assets/payments/affirm.svg" width={40} height={24} alt="Affirm" className="h-5 w-auto" />
            <Image src="/assets/payments/paypal.svg" width={40} height={24} alt="PayPal" className="h-5 w-auto" />
          </div>
        </div>
      </div>

      {/* ── STICKY ADD TO CART (Dính dưới cùng ở Mobile, Hiển thị bình thường ở Desktop) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-3 border-t md:border-none shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.1)] md:static md:p-0 md:shadow-none">
        <Sheet>
          <SheetTrigger asChild>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !matchingVariant?.id}
              className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold py-3.5 md:py-4 px-4 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Icon Ổ khoá (Lock) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              {addingToCart ? "Adding..." : "ADD TO CART"}
            </button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="p-4 border-b-2">
              <SheetTitle className="font-bold text-xl">All items in cart</SheetTitle>
            </SheetHeader>
            <MiniCartSheet
              displayCart={displayCart}
              boughtTogetherSelections={boughtTogetherSelections}
              boughtTogetherProducts={boughtTogetherProducts}
            />
          </SheetContent>
        </Sheet>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* ── KARA GUARANTEE + DELIVERY ── */}
      <div className="bg-[#FEF1D3] rounded-xl p-3 mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Image src="/assets/guarantee.png" width={44} height={44} alt="guarantee" className="flex-shrink-0" />
          <div>
            <p className="text-orange-600 font-semibold text-xs">Kara Guarantee</p>
            <p className="text-xs text-gray-700">Don't love it? We'll fix it. For free.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MdLocalShipping size={28} className="text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-gray-800">Deliver to Viet Nam</p>
            <p className="text-xs text-gray-600"><b>Standard</b> — Order today to get by Dec.8 - Dec.22</p>
            <p className="text-xs text-gray-600"><b>Ready to ship in:</b> 1 business day</p>
          </div>
        </div>
      </div>

      {/* ── DESIGNER ── */}
      <div className="mb-4">
        <h3 className="flex gap-1 items-center text-sm flex-wrap mb-3">
          Designed by <Link href="/" className="font-bold hover:underline ml-1">Entreaty Livid</Link>
          <PiShootingStarFill color="#3b82f6" className="flex-shrink-0" />
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="bg-[#FEF1D3] rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0">
              <MdLibraryBooks size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-sm">Policies</p>
              <p className="text-xs text-gray-600">Eligible for Refund or Return and Replacement within 30 days from the date of delivery</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="bg-[#FEF1D3] rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0">
              <CiFlag1 size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-sm">Need Support?</p>
              <p className="text-xs text-gray-600">Eligible for Refund or Return and Replacement within 30 days from the date of delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES TABLE ── */}
      <div>
        <h4 className="font-bold underline text-sm mb-2">Features</h4>
        <Table className="text-xs border border-gray-200 rounded-lg overflow-hidden">
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold border bg-gray-50 w-28 p-2" align="center">Weight</TableCell>
              <TableCell className="border p-2" align="center">{product?.weight || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold border bg-gray-50 w-28 p-2" align="center">Description</TableCell>
              <TableCell className="border p-2" align="center">{product?.created_at || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold border bg-gray-50 w-28 p-2" align="center">{product?.handle || "Handle"}</TableCell>
              <TableCell className="border p-2" align="center">{product?.weight || "—"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Description collapse */}
        <div className={clsx("mt-3 overflow-hidden transition-all", !showMore && "max-h-10")}>
          <p className="text-xs text-gray-700">
            You are contemplating one of the best-selling products Sleep Token Flowers Red Logo Hoodie Black Sleep Token Tour 2025 New Song Concert For Kids belong theme 3D Hoodies at Printerval
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li><b>Material:</b> <span className="text-gray-600">Made from a high-quality blend of 95% polyester and 5% spandex, this fabric is durable, stretchy, and comfortable.</span></li>
            <li><b>Printing:</b> <span className="text-gray-600">360-degree all-over print is created using advanced dye-sublimation technology, ensuring vibrant, long-lasting designs.</span></li>
            <li><b>Design:</b> <span className="text-gray-600">The design will not fade, crack, flake, or peel, maintaining its quality over time.</span></li>
          </ul>
        </div>
        <Button
          onClick={() => setShowMore(!showMore)}
          variant="outline"
          className="mt-3 mx-auto flex text-orange-500 border-orange-400 hover:border-gray-800 hover:text-gray-800 text-xs h-8 px-5"
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
};

export default Detail;