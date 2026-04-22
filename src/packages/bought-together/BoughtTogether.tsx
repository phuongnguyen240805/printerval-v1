import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { MiniCartSheet } from '@/shared/features/page/cart/MiniCartSheet';
import { Edit2 } from 'lucide-react';

type Product = {
    id: string;
    title: string;
    thumbnail: string;
    handle: string;
    variants: {
        id: string;
        calculated_price: { calculated_amount: number; original_amount?: number };
    }[];
};

interface BoughtTogetherProps {
    currentProduct: Product;
    products: Product[];
    onAddSelectedToCart?: (selectedProducts: Product[]) => void;
    addToCart?: {
        mutate: (variables: { cart_id: string; variant_id: string; quantity: number; metadata?: Record<string, any> }) => void;
        isLoading: boolean;
    };
    createCart?: {
        mutate: (variables?: any) => void;
        isLoading: boolean;
        data?: { cart: { id: string } };
    };
}

export default function BoughtTogether({ currentProduct, products, onAddSelectedToCart, addToCart, createCart }: BoughtTogetherProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set([currentProduct.id, ...products.map(p => p.id)])
    );
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showCartSheet, setShowCartSheet] = useState(false);
    const [displayCart, setDisplayCart] = useState<any[]>([]);

    if (!products || products.length === 0) return null;

    const toggleSelect = (productId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedIds(newSelected);
    };

    const handleAddAllToCart = async () => {
        const allProducts = [currentProduct, ...products];
        const selected = allProducts.filter(p => selectedIds.has(p.id));

        if (onAddSelectedToCart) {
            onAddSelectedToCart(selected);
        }

        // Lưu tất cả sản phẩm được chọn vào localStorage
        if (selected.length > 0) {
            setIsAddingToCart(true);
            try {
                // Lấy giỏ hàng hiện tại
                const currentCart = JSON.parse(localStorage.getItem('cart_items') || '[]');

                // Thêm từng sản phẩm vào giỏ
                for (const product of selected) {
                    const existingItem = currentCart.find((item: any) => item.id === product.id);

                    if (existingItem) {
                        // Nếu đã có, tăng số lượng lên
                        existingItem.quantity += 1;
                    } else {
                        // Nếu chưa có, thêm mới với đầy đủ thông tin
                        currentCart.push({
                            id: product.id,
                            title: product.title,
                            thumbnail: product.thumbnail,
                            quantity: 1,
                            price: product.variants?.[0]?.calculated_price?.calculated_amount || 0,
                            handle: product.handle,
                        });
                    }
                }

                // Lưu lại vào localStorage
                localStorage.setItem('cart_items', JSON.stringify(currentCart));
                console.log("🛒 Added to cart:", currentCart);

                // Update displayCart và mở sheet
                const validCart = currentCart.map((item: any) => ({
                    ...item,
                    price: Number(item.price) || 0,
                    quantity: Number(item.quantity) || 1,
                }));
                setDisplayCart(validCart);
                setShowCartSheet(true);

                // Gửi sự kiện để cart page cập nhật
                window.dispatchEvent(new CustomEvent('cart:updated', { detail: { success: true, cart: currentCart } }));
            } catch (error) {
                console.error("Error adding to cart:", error);
            } finally {
                setIsAddingToCart(false);
            }
        }
    };

    const getPrice = (product: Product) =>
        product.variants?.[0]?.calculated_price?.calculated_amount
            ? (product.variants[0].calculated_price.calculated_amount / 100).toFixed(2)
            : '0.00';

    const getOriginalPrice = (product: Product) =>
        product.variants?.[0]?.calculated_price?.original_amount
            ? (product.variants[0].calculated_price.original_amount / 100).toFixed(2)
            : null;

    // Thumbnail height per item — must match row height in right column (desktop only)
    const THUMB_H = 140;
    const THUMB_GAP = 16; // gap-4 = 16px
    const totalHeight = products.length * THUMB_H + (products.length - 1) * THUMB_GAP;

    return (
        <div className="w-full bg-white py-8 border-t border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Frequently Bought Together
                    </h2>
                    <Link href="#" className="text-orange-500 text-sm font-semibold hover:underline flex items-center gap-1">
                        See all items <span className="text-lg">›</span>
                    </Link>
                </div>

                {/* ─── MOBILE LAYOUT ─── */}
                <div className="flex flex-col md:hidden gap-0">

                    {/* Main product row */}
                    <div className="flex gap-3 items-start py-3 border-b border-gray-100">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 shrink-0"
                            style={{ width: 80, height: 80, borderColor: selectedIds.has(currentProduct.id) ? '#93c5fd' : '#e5e7eb' }}
                        >
                            <Image
                                src={currentProduct.thumbnail}
                                alt={currentProduct.title}
                                fill
                                priority
                                sizes="80px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                                <Checkbox
                                    checked={selectedIds.has(currentProduct.id)}
                                    onCheckedChange={() => toggleSelect(currentProduct.id)}
                                    className="mt-0.5 border-2 border-orange-500 data-[state=checked]:bg-orange-500 h-4 w-4 shrink-0"
                                />
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                    {currentProduct.title?.split(',')[0]}
                                </h3>
                            </div>
                            {currentProduct.title?.includes(',') && (
                                <p className="text-xs text-gray-500 mb-1 ml-6">
                                    {currentProduct.title.split(',').slice(1).join(', ')}
                                </p>
                            )}
                            <Link href="#" className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:underline mb-1 ml-6">
                                <Edit2 size={12} /> Edit
                            </Link>
                            <div className="flex items-center gap-2 ml-6">
                                <span className="text-sm font-bold text-red-600">${getPrice(currentProduct)}</span>
                                {getOriginalPrice(currentProduct) && (
                                    <span className="text-xs text-gray-400 line-through">${getOriginalPrice(currentProduct)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related products rows */}
                    {products.map((product) => (
                        <div key={product.id} className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
                            <div
                                onClick={() => toggleSelect(product.id)}
                                className="relative rounded-lg overflow-hidden bg-gray-100 border-2 shrink-0 cursor-pointer transition-colors"
                                style={{ width: 80, height: 80, borderColor: selectedIds.has(product.id) ? '#93c5fd' : '#e5e7eb' }}
                            >
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-1">
                                    <Checkbox
                                        checked={selectedIds.has(product.id)}
                                        onCheckedChange={() => toggleSelect(product.id)}
                                        className="mt-0.5 border-2 border-orange-500 data-[state=checked]:bg-orange-500 h-4 w-4 shrink-0"
                                    />
                                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                        {product.title?.split(',')[0]}
                                    </h3>
                                </div>
                                {product.title?.includes(',') && (
                                    <p className="text-xs text-gray-500 mb-1 ml-6">
                                        {product.title.split(',').slice(1).join(', ')}
                                    </p>
                                )}
                                <Link href="#" className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:underline mb-1 ml-6">
                                    <Edit2 size={12} /> Edit
                                </Link>
                                <div className="flex items-center gap-2 ml-6">
                                    <span className="text-sm font-bold text-red-600">${getPrice(product)}</span>
                                    {getOriginalPrice(product) && (
                                        <span className="text-xs text-gray-400 line-through">${getOriginalPrice(product)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mobile: Add to cart */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleAddAllToCart}
                            disabled={selectedIds.size === 0 || isAddingToCart}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-base"
                        >
                            {isAddingToCart ? "Adding..." : "Add all to cart"}
                        </Button>
                    </div>
                </div>

                {/* ─── DESKTOP LAYOUT (unchanged) ─── */}
                <div className="hidden md:flex md:flex-row md:items-start gap-0">

                    {/* Column 1: Main product image */}
                    <div className="flex flex-col items-start shrink-0 w-[210px]">
                        <div
                            className="relative w-full rounded-lg overflow-hidden bg-gray-100 mb-3"
                            style={{ height: totalHeight }}
                        >
                            <Image
                                src={currentProduct.thumbnail}
                                alt={currentProduct.title}
                                fill
                                priority
                                sizes="210px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <Checkbox
                                checked={selectedIds.has(currentProduct.id)}
                                onCheckedChange={() => toggleSelect(currentProduct.id)}
                                className="border-2 border-orange-500 data-[state=checked]:bg-orange-500 h-5 w-5"
                            />
                            <p className="text-sm text-gray-700 leading-snug">
                                {currentProduct.title?.split(',').slice(1).join(', ') || currentProduct.title}
                            </p>
                        </div>
                        <Link href="#" className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline mb-2 ml-7">
                            <Edit2 size={14} /> Edit
                        </Link>
                        <div className="flex items-center gap-2 ml-7">
                            <span className="text-base font-bold text-red-600">${getPrice(currentProduct)}</span>
                            {getOriginalPrice(currentProduct) && (
                                <span className="text-sm text-gray-400 line-through">${getOriginalPrice(currentProduct)}</span>
                            )}
                        </div>
                    </div>

                    {/* Plus sign */}
                    <div
                        className="flex items-center justify-center shrink-0 px-6"
                        style={{ height: totalHeight }}
                    >
                        <span className="text-3xl text-gray-400 font-light">+</span>
                    </div>

                    {/* Column 2: Thumbnails stacked */}
                    <div className="flex flex-col shrink-0" style={{ gap: THUMB_GAP }}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => toggleSelect(product.id)}
                                className="relative rounded-lg overflow-hidden bg-gray-100 border-2 cursor-pointer transition-colors shrink-0 w-[140px]"
                                style={{ height: THUMB_H, borderColor: selectedIds.has(product.id) ? '#93c5fd' : '#e5e7eb' }}
                            >
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    sizes="140px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Column 3: Product details */}
                    <div className="flex flex-col flex-1 min-w-0 ml-6">
                        {products.map((product, idx) => {
                            const price = getPrice(product);
                            const originalPrice = getOriginalPrice(product);
                            const isLast = idx === products.length - 1;

                            return (
                                <div
                                    key={product.id}
                                    className={`flex flex-col justify-center ${!isLast ? 'border-b border-gray-200' : ''}`}
                                    style={{ height: THUMB_H + (idx < products.length - 1 ? THUMB_GAP : 0) }}
                                >
                                    <div className="flex items-start gap-3 mb-1">
                                        <Checkbox
                                            checked={selectedIds.has(product.id)}
                                            onCheckedChange={() => toggleSelect(product.id)}
                                            className="mt-0.5 border-2 border-orange-500 data-[state=checked]:bg-orange-500 h-5 w-5 shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                                {product.title?.split(',')[0]}
                                            </h3>
                                            {product.title?.includes(',') && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {product.title.split(',').slice(1).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Link href="#" className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline mb-1 ml-8">
                                        <Edit2 size={14} /> Edit
                                    </Link>
                                    <div className="flex items-center gap-2 ml-8">
                                        <span className="text-base font-bold text-red-600">${price}</span>
                                        {originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Desktop: Add all to cart */}
                        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                            <Button
                                onClick={handleAddAllToCart}
                                disabled={selectedIds.size === 0 || isAddingToCart}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-lg text-base"
                            >
                                {isAddingToCart ? "Adding..." : "Add all to cart"}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Cart Sheet - Shows when items are added */}
            <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
                <SheetContent className="p-0">
                    <SheetHeader className="p-4 border-b-2">
                        <SheetTitle className="font-bold text-xl">All items in cart</SheetTitle>
                    </SheetHeader>
                    <MiniCartSheet
                        displayCart={displayCart}
                        boughtTogetherSelections={new Set()}
                        boughtTogetherProducts={[]}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}

