"use client"
import { PrimaryLayout } from "@/layouts";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "@/utils/api";
import { useMultiplestepForm } from "@/shared/hooks/useMultipleStep";
import BreadcrumbComponent from "@/shared/components/sidebarCheckout";
import CartStep from "@/shared/features/page/cart/cart";
import CheckoutForm from "@/shared/features/page/cart/form";
import { useState, useEffect } from "react";

export const getStaticProps: GetStaticProps = async context => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale as string)),
        },
    };
};

const Cart = () => {
    const {
        nextStep,
        currentStepIndex,
    } = useMultiplestepForm(4);

    // Lấy dữ liệu giỏ hàng từ localStorage (tự động cập nhật)
    const [cart, setCart] = useState<any>({
        cart: {
            items: []
        }
    });
    const [cartId, setCartId] = useState<string | null>(null);

    // 1. Lấy cart_id từ localStorage khi component mount
    useEffect(() => {
        const savedCartId = localStorage.getItem("medusa_cart_id");
        if (savedCartId) {
            setCartId(savedCartId);
        } else {
            loadCartFromLocalStorage();
        }
    }, []);

    // 2. Fetch dữ liệu từ tRPC (Chỉ chạy khi có cartId)
    const { data: trpcCart, isError, isLoading } = api.medusa.getCart.useQuery(
        { id: cartId as string },
        {
            enabled: !!cartId,
            retry: 1,
            onSuccess: (data) => {
                if (data?.cart) {
                    setCart(data.cart);
                }
            }
        }
    );

    // 3. Hàm lấy dữ liệu dự phòng từ localStorage
    const loadCartFromLocalStorage = () => {
        if (typeof window !== "undefined") {
            const savedItems = localStorage.getItem("cart_items");
            if (savedItems) {
                try {
                    const items = JSON.parse(savedItems);
                    setCart({ items: items });
                    console.log("Loaded cart from localStorage (Fallback)");
                } catch (e) {
                    console.error("Error parsing cart_items", e);
                }
            }
        }
    };

    // 4. Xử lý Fallback nếu tRPC lỗi hoặc không tìm thấy cart
    useEffect(() => {
        if (isError || (!isLoading && !trpcCart && !cartId)) {
            loadCartFromLocalStorage();
        }
    }, [isError, trpcCart, isLoading, cartId]);

    // 5. Lắng nghe event thay đổi (giữ lại logic cũ của bạn)
    useEffect(() => {
        const handleUpdate = () => {
            const newId = localStorage.getItem("cart_id");
            if (newId) {
                setCartId(newId);
            } else {
                loadCartFromLocalStorage();
            }
        };

        window.addEventListener("cart:updated", handleUpdate);
        window.addEventListener("storage", handleUpdate);
        return () => {
            window.removeEventListener("cart:updated", handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, []);


    // delete item from cart handler
    const deleteMutation = api.medusa.deleterFromCart.useMutation({
        onSuccess: () => {
            // utils.getCart.invalidate({ id: cartId });
            window.dispatchEvent(new CustomEvent('cart:updated'));
        },
        onError: (error) => {
            alert("Lỗi khi xóa sản phẩm: " + error.message);
        }
    });

    const cartDelete = (productId: string) => {
        // Lấy giỏ hàng hiện tại từ localStorage
        const currentCart = JSON.parse(localStorage.getItem('cart_items') || '[]');

        // Lọc ra sản phẩm cần xóa
        const updatedCart = currentCart.filter((item: any) => item.id !== productId);

        // Lưu lại vào localStorage
        localStorage.setItem('cart_items', JSON.stringify(updatedCart));

        // Cập nhật state
        setCart({
            cart: {
                items: updatedCart
            }
        });

        if (productId) {
            deleteMutation.mutate({
                cart_id: cartId as string,
                line_item_id: productId,
            });
        }

        // Gửi sự kiện để thông báo giỏ hàng đã thay đổi
        window.dispatchEvent(new CustomEvent('cart:updated', { detail: { success: true, cart: updatedCart } }));
        console.log("🗑️ Deleted product:", productId, "Remaining items:", updatedCart);
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
            <BreadcrumbComponent currentStepIndex={currentStepIndex} />
            {currentStepIndex === 0 && <CartStep product={cart.items as any} nextStep={nextStep} cartDelete={cartDelete} />}
            {currentStepIndex === 1 && <CheckoutForm />}
        </div>
    );
};

Cart.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Cart', canonical: '/cart' }}>
            {page}
        </PrimaryLayout>
    );
};

export default Cart;
