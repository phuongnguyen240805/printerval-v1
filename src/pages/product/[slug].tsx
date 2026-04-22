"use client";
import { PrimaryLayout } from "@/layouts";
import { ReactElement, useEffect } from "react";
import { NextPageWithLayout } from "../_app";
import FAQ from "@/shared/features/page/Product/FAQ";
import Thumbnail from "@/shared/features/page/Product/Thumbnail";
import Detail from "@/shared/features/page/Product/Detail";
import Reviews from "@/packages/reviews/Reviews";
import Description from "@/shared/features/page/Product/Description";
import CarouselProductList from "@/shared/features/page/Product/CarouselProductList";
import { useState, useMemo } from "react";
import { mockProduct, mockProducts, getMockProductByHandle, getBoughtTogetherSuggestions } from "@/lib/mockProduct";
import { useRouter } from 'next/router';
import { useRecentlyViewed } from "@/packages/browsing-history/hooks/useRecentlyViewed";
import BoughtTogether from "@/packages/bought-together/BoughtTogether";
import { MOCK_REVIEWS } from "@/packages/reviews/Reviews";
import YouMightLoveThese from "@/packages/YouMightLoveThese/components/YouMightLoveThese";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import ExploreRelatedSearches from "@/packages/ExploreRelatedSearches/components/ExploreRelatedSearches";
import { QuickGiftFinder } from "@/shared/layout/header/QuickGiftFinder";
import { SaleProduct } from "@/shared/features/page/HomePage/components/Promotions";
import MoreFromThisShop from "@/packages/MoreFromThisShop/components/MoreFromThisShop";
import VirtualTour from "@/shared/features/page/Product/Thumbnail";
import { api } from "@/utils/api";

// Hàm tính toán điểm đánh giá trung bình từ review data
const calculateAverageRating = (reviews: typeof MOCK_REVIEWS): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Làm tròn 1 chữ số
};
const productSalesData = mockProducts;
const priceList = { price_lists: [{ id: 'pl1', title: 'Sale' }, { id: 'pl2', title: 'Top Picks For You' }] };

const Products: NextPageWithLayout = () => {
  const { addViewedProduct } = useRecentlyViewed();

  // Map products để add price field từ variants
  const productsWithPrice = useMemo(() =>
    mockProducts.map(product => ({
      ...product,
      price: product.variants?.[0]?.calculated_price?.calculated_amount || 0,
      originalPrice: product.variants?.[0]?.calculated_price?.original_amount || 0,
    }))
    , []);

  // === SỬ DỤNG MOCK DATA THAY THẾ ===
  const router = useRouter();
  const { slug } = router.query;
  const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : "";
  // const productData = getMockProductByHandle(slug as string) || getMockProductByHandle("custom-comfort-colors-tee");
  // const cart = productData;

  const { data: productData, isLoading: isFetching } = api.medusa.getProduct.useQuery(
    {
      handle: slug as string,
      regionID: regionID || ""
    },
    {
      enabled: !!slug, // Chỉ chạy khi router đã sẵn sàng và có slug
      retry: 1
    }
  );

  // console.log('check data: ', productData)
  // validate productData 
  const currentProductWithPrice = useMemo(() => {
    if (!productData) return null;
    const variant = productData.variants?.[0];
    const calcPrice = variant?.calculated_price;

    return {
      id: productData.id,
      title: productData.title,
      handle: productData.handle,
      thumbnail: productData.thumbnail,
      price: calcPrice?.calculated_amount ? calcPrice.calculated_amount / 100 : 0,
      originalPrice: calcPrice?.original_amount ? calcPrice.original_amount / 100 : undefined,
      category: (productData.metadata as any)?.category || 'uncategorized',
    };
  }, [productData]);

  console.log('check currentProductWithPrice: ', currentProductWithPrice)

  const cart = productData;
  const [isLoading, setIsLoading] = useState(false);
  const [boughtTogetherSelections, setBoughtTogetherSelections] = useState<Set<string>>(new Set());
  const [customDesign, setCustomDesign] = useState<any>(null);
  const [customTemplate, setCustomTemplate] = useState<any>(null);
  const [customElements, setCustomElements] = useState<any[]>([]);

  // handle trpc
  // Khai báo mutation tạo Cart
  const createCartMutation = api.medusa.createCart.useMutation();

  // Khai báo mutation thêm sản phẩm
  const addToCartMutation = api.medusa.addToCart.useMutation();

  const handleCustomizationApply = (payload: any, template: any) => {
    const { design, elements } = payload || {};
    console.log('[Product Page] handleCustomizationApply called with:', {
      elements_count: elements?.length,
      elements,
      template_id: template?.id
    });
    setCustomDesign(design);
    setCustomTemplate(template);
    setCustomElements(elements || []);
  };

  // Kiểm tra user đã mua sản phẩm chưa
  const getPurchasedProducts = () => {
    if (typeof window !== 'undefined') {
      const purchased = JSON.parse(localStorage.getItem('purchased_products') || '[]');
      return purchased;
    }
    return [];
  };

  const hasPurchased = getPurchasedProducts().includes(productData?.id);

  // Lưu sản phẩm vào recently viewed khi trang load
  useEffect(() => {
    if (productData) {
      const variant = productData.variants?.[0];
      const calcPrice = variant?.calculated_price;

      addViewedProduct({
        id: productData.id,
        name: productData.title,
        image_url: productData.thumbnail || "",
        url: `/product/${productData.handle}`,
        // Format giá thành chuỗi để lưu vào storage giống format cũ của bạn
        price: calcPrice?.calculated_amount
          ? (calcPrice.calculated_amount).toFixed(2)
          : "0.00",
        compare_at_price: calcPrice?.original_amount
          ? (calcPrice.original_amount).toFixed(2)
          : undefined,
        handle: productData.handle,
      });
    }
  }, [productData, addViewedProduct]);

  // Lấy bought together suggestions
  const boughtTogetherSuggestions = getBoughtTogetherSuggestions(productData?.id || "", 5);

  // Tính điểm đánh giá trung bình và số lượng review
  const averageRating = calculateAverageRating(MOCK_REVIEWS);
  const reviewCount = MOCK_REVIEWS.length;

  if (!router.isReady) return <div className="p-20 text-center font-sans">Loading...</div>;
  if (!productData) return <div className="p-20 text-center font-sans">Product Not Found</div>;

  const handleAddToCart = async (data: any) => {
    setIsLoading(true);
    try {
      // Lưu sản phẩm vào giỏ hàng (localStorage)
      const currentCart = JSON.parse(localStorage.getItem('cart_items') || '[]');

      // Tìm xem sản phẩm đã có trong giỏ chưa
      const existingItem = currentCart.find((item: any) => item.id === productData?.id);

      if (existingItem) {
        // Nếu đã có, tăng số lượng lên
        existingItem.quantity += 1;
      } else {
        // Nếu chưa có, thêm mới
        currentCart.push({
          id: productData?.id,
          title: productData?.title,
          thumbnail: productData?.thumbnail,
          quantity: 1,
          price: productData?.variants?.[0]?.calculated_price?.calculated_amount || 0,
        });
      }

      // Lưu lại vào localStorage
      localStorage.setItem('cart_items', JSON.stringify(currentCart));
      console.log("Updated cart:", currentCart);

      // Lưu vào danh sách sản phẩm đã mua để allow review
      if (productData?.id) {
        const purchased = JSON.parse(localStorage.getItem('purchased_products') || '[]');
        if (!purchased.includes(productData.id)) {
          purchased.push(productData.id);
          localStorage.setItem('purchased_products', JSON.stringify(purchased));
        }
      }

      // Gửi sự kiện để cart page cập nhật
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { success: true, cart: currentCart } }));
      // TODO: Show success toast or redirect to cart page
    } catch (error) {
      console.error("Mock add to cart error:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile layout */}
      <div className="md:hidden">
        <Thumbnail product={productData} customDesign={customDesign} customTemplate={customTemplate} customElements={customElements} />
        <Detail
          product={productData}
          cart={[cart]}
          boughtTogetherSelections={boughtTogetherSelections}
          boughtTogetherProducts={boughtTogetherSuggestions}
          rating={averageRating} // Điểm đánh giá thực từ reviews
          reviewCount={reviewCount} // Số lượng review thực
          onCustomizationApply={handleCustomizationApply}
          addToCart={{
            mutate: () => { }, // tắt mutate thật
            isLoading: false
          }}
          createCart={{
            mutate: () => { }, // tắt
            isLoading: false
          }}
        />
        <Reviews
          productId={productData?.id}
          star={4.8}
          date={'11/2/2025'}
          canReview={hasPurchased}
        />
        <FAQ />
        <YouMightLoveThese
          currentProduct={currentProductWithPrice}
          allProducts={productsWithPrice}
          title="You Might Love These"
        />
        <ExploreRelatedSearches
          currentProduct={productData}
          title="Explore related searches"
        />
        {/* Chỉ hiển thị form viết review nếu đã mua sản phẩm */}

        {/* Fix lỗi TypeScript: thêm fallback || [] */}
        {productData?.product_builder?.complementary_products?.length > 0 && (
          <CarouselProductList products={productData?.product_builder?.complementary_products || []} />
        )}
        <BoughtTogether
          currentProduct={productData}
          products={getBoughtTogetherSuggestions(productData.id, 3)}
          onAddSelectedToCart={handleAddToCart}
          addToCart={{ mutate: () => { }, isLoading: false }}
          createCart={{ mutate: () => { }, isLoading: false }}
        />
        <Description description={productData?.description || ''} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-3 md:px-2 xl:max-w-7xl xl:mx-auto xl:gap-4 xl:p-6">
        <div className="flex flex-col gap-3 col-span-2 sticky top-0 h-fit">
          {/* Thumbnail - Sticky on left */}
          {/* <Thumbnail product={productData} customDesign={customDesign} customTemplate={customTemplate} customElements={customElements} /> */}
          <VirtualTour
            spots={productData.images}           // mảng các phòng có panorama
            floorPlanImage="/images/floor-plan.jpg"   // ← ảnh bản đồ sàn nhà
            // Nếu bạn vẫn muốn giữ custom design + try on thì truyền thêm
            customDesign={customDesign}
            customTemplate={customTemplate}
            customElements={customElements}
          />
          <BoughtTogether
            currentProduct={productData}
            products={getBoughtTogetherSuggestions(productData.id, 3)}
            onAddSelectedToCart={handleAddToCart}
            addToCart={{ mutate: () => { }, isLoading: false }}
            createCart={{ mutate: () => { }, isLoading: false }}
          />
          {productData?.product_builder?.complementary_products?.length > 0 && (
            <CarouselProductList products={productData?.product_builder?.complementary_products || []} />
          )}
          {/* Chỉ hiển thị form viết review nếu đã mua sản phẩm */}
          <Reviews
            productId={productData?.id}
            star={4.8}
            date={'11/2/2025'}
            canReview={hasPurchased}
          />
          <YouMightLoveThese
            currentProduct={currentProductWithPrice}
            allProducts={productsWithPrice}
            title="You Might Love These"
          />
          <ExploreRelatedSearches
            currentProduct={productData}
            title="Explore related searches"
          />
          <Description description={productData?.description || ''} />
        </div>
        <div className="flex flex-col gap-3">
          <Detail
            product={productData}
            cart={[cart]}
            boughtTogetherSelections={boughtTogetherSelections}
            boughtTogetherProducts={boughtTogetherSuggestions}
            rating={averageRating}
            reviewCount={reviewCount}
            onCustomizationApply={handleCustomizationApply}
            addToCart={{
              mutate: addToCartMutation.mutateAsync,
              isLoading: addToCartMutation.isLoading
            }}
            createCart={{
              mutate: createCartMutation.mutateAsync,
              isLoading: createCartMutation.isLoading
            }}
          />
          <FAQ />
          {/* ── STICKY MINI CART (desktop only) ── */}
          <div className="bg-[#F3F3F5] items-center gap-3 h-32 rounded-xl sticky overflow-hidden shadow-sm border border-gray-200 flex" style={{ top: '180px' }}>
            {/* <Image
              src={productData?.thumbnail || productData?.images?.[0]?.url || "/assets/placeholder.png"}
              alt={productData?.title || "Product"}
              width={200} height={200}
              className="h-full w-28 object-cover rounded-l-xl flex-shrink-0"
              onError={(e) => { e.currentTarget.src = "/assets/placeholder.png"; }}
            /> */}
            <div className="flex flex-col gap-1.5 w-full pr-3">
              <h3 className="font-semibold text-sm line-clamp-1 text-gray-800">{productData?.title}</h3>
              <div className="flex gap-0.5 items-center">
                <span className="underline text-xs font-bold mr-1">{averageRating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => {
                  const index = i + 1;
                  return (
                    <span key={index} className="text-yellow-400 text-sm">
                      {averageRating >= index ? <BsStarFill /> : averageRating >= index - 0.5 ? <BsStarHalf /> : <BsStar />}
                    </span>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/* /100 neu dung boi 100 */}
                <span className="font-bold text-green-700">${(productData?.variants?.[0]?.calculated_price?.calculated_amount || 14.95).toFixed(2)}</span>
                <span className="line-through text-gray-400 text-xs">${(productData?.variants?.[0]?.calculated_price?.original_amount || 29.90).toFixed(2)}</span>
              </div>
              <Button
                className="w-full text-xs h-8 bg-[#C72C37] hover:bg-[#a82530] text-white rounded-lg"
                onClick={() => handleAddToCart({})}
                disabled={false}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MORE FROM THIS SHOP ── */}

    </div>
  );
};

// Wrapper để access productData
function MoreFromThisShopWrapper() {
  const router = useRouter();
  const { slug } = router.query;
  const productData = getMockProductByHandle(slug as string) || getMockProductByHandle("custom-comfort-colors-tee");

  if (!productData) return null;

  return (
    <MoreFromThisShop
      currentProduct={{ id: productData?.id }}
      shopId={productData?.sellerId || ''}
      shopName={productData?.title || 'This Shop'}
      seller={{ id: productData?.sellerId || '', name: productData?.title }}
      limit={4}
    />
  );
}

Products.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Product', canonical: '/product' }}>
      {page}
      <QuickGiftFinder />
      <SaleProduct TopSale={productSalesData as any} title={priceList?.price_lists?.[0]?.title as string} />
      <MoreFromThisShopWrapper />
    </PrimaryLayout>
  );
};

export default Products;