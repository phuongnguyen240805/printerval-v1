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

    // Lắng nghe sự thay đổi giỏ hàng từ localStorage
    useEffect(() => {
        const loadCart = () => {
            if (typeof window !== "undefined") {
                const savedCart = localStorage.getItem("cart_items");
                if (savedCart) {
                    try {
                        const items = JSON.parse(savedCart);
                        setCart({
                            cart: {
                                items: items
                            }
                        });
                    } catch (error) {
                        console.error("Error parsing cart:", error);
                    }
                }
            }
        };

        // Load lần đầu
        loadCart();

        // Lắng nghe sự kiện cập nhật giỏ hàng từ các trang khác
        window.addEventListener("cart:updated", loadCart);
        window.addEventListener("storage", loadCart);

        return () => {
            window.removeEventListener("cart:updated", loadCart);
            window.removeEventListener("storage", loadCart);
        };
    }, []);

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

        // Gửi sự kiện để thông báo giỏ hàng đã thay đổi
        window.dispatchEvent(new CustomEvent('cart:updated', { detail: { success: true, cart: updatedCart } }));
        console.log("🗑️ Deleted product:", productId, "Remaining items:", updatedCart);
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
            <BreadcrumbComponent currentStepIndex={currentStepIndex} />
            {currentStepIndex === 0 && <CartStep product={cart?.cart.items as any} nextStep={nextStep} cartDelete={cartDelete} />}
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
