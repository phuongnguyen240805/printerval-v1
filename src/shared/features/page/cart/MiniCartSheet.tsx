"use client"
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface CartItem {
    id: string;
    title: string;
    thumbnail: string;
    quantity: number;
    price: number;
    handle: string;
    metadata?: any;
}

interface BoughtTogetherItem {
    id: string;
    title: string;
    thumbnail: string;
    variants?: any[];
}

interface MiniCartSheetProps {
    displayCart: CartItem[];
    boughtTogetherSelections?: Set<string>;
    boughtTogetherProducts?: BoughtTogetherItem[];
    onDeleteItem?: (itemId: string) => void;
}

export const MiniCartSheet = ({
    displayCart = [],
    boughtTogetherSelections = new Set(),
    boughtTogetherProducts = [],
    onDeleteItem,
}: MiniCartSheetProps) => {
    const subtotal =
        displayCart.reduce((sum: number, item: any) => {
            return sum + ((Number(item.price) || 0) / 100 * (Number(item.quantity) || 1));
        }, 0) +
        Array.from(boughtTogetherSelections).reduce((sum, id) => {
            const product = boughtTogetherProducts?.find((p: any) => p.id === id);
            const price = product?.variants?.[0]?.calculated_price?.calculated_amount || 0;
            return sum + price / 100;
        }, 0);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Main Product */}
                {displayCart?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 justify-between py-2 lg:py-4">
                        <Image
                            src={item?.thumbnail || "/assets/placeholder.png"}
                            alt={item?.title || "Product"}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="w-full grid grid-cols-4 items-center gap-1">
                            <h6 className="truncate col-span-3 text-sm font-medium">{item.title}</h6>
                            <Button
                                variant="ghost"
                                className="col-span-1 p-0 h-8 justify-end"
                                onClick={() => onDeleteItem?.(item.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                            <span className="col-span-4 text-xs text-gray-500">{item.handle}</span>
                            <span className="col-span-1 text-sm font-bold">
                                ${(Number(item.price) / 100 || 0).toFixed(2)}
                            </span>
                            <div className="col-span-3 flex justify-end items-center gap-2">
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                    -
                                </Button>
                                <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Bought Together Items */}
                {boughtTogetherSelections && boughtTogetherSelections.size > 0 && (
                    <div className="border-t pt-3 mt-3">
                        <h6 className="text-sm font-bold text-gray-700 mb-3">
                            Bought Together ({boughtTogetherSelections.size})
                        </h6>
                        {boughtTogetherProducts
                            ?.filter((p: any) => boughtTogetherSelections?.has(p.id))
                            .map((item: any) => {
                                const price = item.variants?.[0]?.calculated_price?.calculated_amount
                                    ? (item.variants[0].calculated_price.calculated_amount / 100).toFixed(2)
                                    : "0.00";
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 justify-between py-2 lg:py-3"
                                    >
                                        <Image
                                            src={item?.thumbnail || "/assets/placeholder.png"}
                                            alt={item?.title || "Product"}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                        <div className="w-full grid grid-cols-4 items-center gap-1">
                                            <h6 className="truncate col-span-3 text-xs font-medium">{item.title}</h6>
                                            <Button variant="ghost" className="col-span-1 p-0 h-8 justify-end">
                                                <Trash2 size={14} />
                                            </Button>
                                            <span className="col-span-1 text-xs font-bold">${price}</span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Cart Summary - Always at Bottom */}
            <div className="border-t pt-4 pb-4 px-4 bg-white flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold">Subtotal:</span>
                    <span className="text-lg font-bold text-orange-600">${subtotal.toFixed(2)}</span>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-2 mb-2">
                    PayPal
                </Button>

                <div className="text-center text-sm text-gray-600 mb-2">or</div>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg py-2 mb-2">
                    Checkout
                </Button>

                <div className="grid grid-cols-2 gap-2">
                    <Link href="/cart">
                        <Button variant="outline" className="text-gray-700 font-semibold rounded-lg py-2 w-full">
                            View cart
                        </Button>
                    </Link>
                    <Button variant="outline" className="text-gray-700 font-semibold rounded-lg py-2">
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MiniCartSheet;
