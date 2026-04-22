"use client"
import { StoreCartLineItem } from "@medusajs/types";
import Image from "next/image";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/shared/ui/drawer"
import { TbEdit } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { api } from "@/utils/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import Trpc from "@/pages/api/trpc/[trpc]";
const CartStep = ({ product = [], nextStep, cartDelete }: { product: StoreCartLineItem[]; nextStep: () => void, cartDelete: any }) => {
    // console.log('check product cart: ', productData)
    // const product = productData.items; 
    const [quantities, setQuantities] = useState<number[]>([])
    const handleDeleteItem = async (productId: string) => {
        try {
            // Call cartDelete với productId (mock data version)
            if (cartDelete && typeof cartDelete === 'function') {
                cartDelete(productId);
            }
        } catch (error) {
            console.error("Error deleting item from cart:", error)
        }
    }
    useEffect(() => {
        setQuantities(product.map(item => item.quantity))
    }, [product])
    const priceTotal = product.reduce((total, item, index) => {
        const unitPrice = typeof item.unit_price === 'number' ? item.unit_price : 0;
        const qty = typeof quantities[index] === 'number' ? quantities[index] : 0;
        return total + unitPrice * qty;
    }, 0);

    // update cart khi thay doi so luong
    const updateLocalStorageQuantity = (productId: string, newQty: number) => {
        try {
            const cartData = JSON.parse(localStorage.getItem('cart_items') || '[]');
            const updatedCart = cartData.map((item: any) => {
                if (item.id === productId) {
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            localStorage.setItem('cart_items', JSON.stringify(updatedCart));

            // Bắn event để các component khác (như Navbar) cập nhật theo
            window.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (error) {
            console.error("Failed to update localStorage:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:justify-between">
            <div className="flex flex-col gap-3 w-full">
                <Table>
                    <thead>
                        <TableRow className="bg-[#F4F4F4] rounded-lg w-full">
                            <TableCell className="font-semibold">Item</TableCell>
                            <TableCell className="hidden md:table-cell font-semibold text-center">Price</TableCell>
                            <TableCell className="hidden md:table-cell font-semibold text-center">Quantity</TableCell>
                            <TableCell className="hidden md:table-cell font-semibold text-right">Total</TableCell>
                        </TableRow>
                    </thead>
                    <TableBody>
                        {product.map((item, index) => (
                            <TableRow key={index} className="border-b">
                                <TableCell>
                                    <div className="flex gap-3">
                                        {item.thumbnail && (
                                            <Image
                                                src={item.thumbnail}
                                                width={90}
                                                height={135}
                                                alt={item.title}
                                                className="w-[90px] h-auto object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex flex-col gap-2">
                                            <h6 className="font-medium text-[#544D7A]">{item.title}</h6>
                                            <span className="text-xs text-gray-600">{item.variant_title}</span>
                                            <div className="flex gap-4 items-center">
                                                <Drawer>
                                                    <DrawerTrigger asChild>
                                                        <Button variant="ghost" className="p-0 text-blue-500 h-auto">
                                                            <TbEdit /> Edit
                                                        </Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent>
                                                        {/* Edit content */}
                                                    </DrawerContent>
                                                </Drawer>
                                                <Button
                                                    variant="ghost"
                                                    className="p-0 text-gray-500 h-auto"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                >
                                                    <RiDeleteBinLine /> Remove
                                                </Button>
                                            </div>
                                            <div className="flex gap-2 items-start text-orange-600">
                                                <Checkbox
                                                    id={`digital-${index}`}
                                                    className="border-2 border-orange-600 data-[state=checked]:bg-white data-[state=checked]:text-orange-600 mt-0.5"
                                                />
                                                <Label htmlFor={`digital-${index}`} className="text-xs leading-tight">
                                                    Want the digital file? Get this design as a digital download. +$2.99
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center align-top">
                                    <div className="font-semibold">${typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : '0.00'}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center align-top">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => {
                                            const newQty = Math.max(1, quantities[index] - 1); // Không để giảm xuống 0
                                            setQuantities(prev => {
                                                const next = [...prev];
                                                next[index] = newQty;
                                                return next;
                                            });
                                            updateLocalStorageQuantity(item.id, newQty);
                                        }}>-</Button>
                                        <span className="font-semibold w-8 text-center">{quantities[index]}</span>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                            const newQty = Math.max(1, quantities[index] + 1);
                                            setQuantities(prev => {
                                                const next = [...prev];
                                                next[index] = newQty;
                                                return next;
                                            });
                                            updateLocalStorageQuantity(item.id, newQty);
                                        }}>+</Button>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right align-top">
                                    <div className="font-bold">${typeof item.unit_price === 'number' && typeof quantities[index] === 'number' ? (item.unit_price * quantities[index]).toFixed(2) : '0.00'}</div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col items-end bg-[#F9F9F9] p-4 rounded-lg gap-4 w-full xl:w-2/3">
                <Table>
                    <TableBody>
                        <TableRow className="flex justify-end gap-16">
                            <TableCell className="font-bold">Subtotal</TableCell>
                            <TableCell className="font-bold text-right">${typeof priceTotal === 'number' ? priceTotal.toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                        <TableRow className="flex justify-end gap-16">
                            <TableCell className="font-bold">Shipping fee</TableCell>
                            <TableCell className="font-bold text-right">${(priceTotal).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow className="flex justify-end gap-16">
                            <TableCell className="font-bold">Shipping fee</TableCell>
                            <TableCell className="font-bold text-right">${(priceTotal).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow className="flex justify-end gap-16">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="font-bold text-right">${(priceTotal).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow className="flex justify-end gap-16">
                            <TableCell className="font-bold">Tax (if applicable)</TableCell>
                            <TableCell className="font-bold text-right">${(priceTotal).toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="flex gap-16 items-center text-center">
                    <span>Deliver to United States</span>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="text-orange-500 p-0">Change</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Change Delivery Location</DialogTitle>
                            </DialogHeader>
                            {/* <Select>
                                <SelectTrigger className="w-full p-6 rounded-xl">
                                    <SelectValue placeholder={ship?.[0].name} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {ship?.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                <span className="font-bold">{item.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select> */}
                            <div className="flex justify-end mt-4">
                                <Button>Save</Button>
                                <Button variant="ghost" className="ml-2">Cancel</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Checkout Section */}
                <div className="mt-6 space-y-3">
                    {/* Google Reviews */}
                    <div className="flex flex-wrap items-center justify-center gap-1 text-xs px-2">
                        <span className="text-gray-600">Our customers are saying:</span>
                        <div className="flex items-center">
                            {[1, 2, 3, 4].map((i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                            <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        </div>
                        <span className="font-semibold">4 out of 5</span>
                        <span className="text-gray-600">based on</span>
                        <span className="font-semibold">68354 reviews</span>
                        <span className="text-blue-600 font-bold">Google</span>
                        <span className="text-xs text-gray-500">Customer Reviews</span>
                    </div>

                    {/* Checkout Button */}
                    <Button
                        className="w-full bg-[#FF4757] hover:bg-[#e63946] text-white font-bold py-4 text-base rounded-md"
                        onClick={nextStep}
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        CHECKOUT
                    </Button>

                    {/* Payment Methods */}
                    <div className="flex justify-center items-center gap-2 py-2 flex-wrap">
                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">AMEX</div>
                        <div className="w-8 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                        <div className="w-8 h-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
                        <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center text-white text-[10px] font-bold">$</div>
                        <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-[8px] font-bold">P</div>
                        <div className="w-8 h-6 bg-black rounded flex items-center justify-center text-white text-[8px] font-bold">AP</div>
                    </div>

                    {/* Express Checkout */}
                    <p className="text-center text-sm text-gray-600 py-1">Express checkout</p>

                    {/* Onepay Link Button */}
                    <Button
                        className="w-full bg-[#00C853] hover:bg-[#00b248] text-white font-bold py-4 rounded-md flex items-center justify-between px-4"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold">link</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded">
                            <div className="text-blue-700 font-bold text-sm">VISA</div>
                            <span className="text-black font-bold">0704</span>
                        </div>
                    </Button>

                    {/* PayPal Button */}
                    <Button
                        className="w-full bg-[#FFC439] hover:bg-[#f0b429] py-4 rounded-md flex items-center justify-center"
                    >
                        <span className="text-[#003087] font-bold text-xl italic">Pay</span>
                        <span className="text-[#009cde] font-bold text-xl italic">Pal</span>
                    </Button>

                    {/* Guarantee Section */}
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-full border-4 border-orange-500 flex items-center justify-center bg-white">
                                <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                GUARANTEE
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">Don&apos;t love it? We&apos;ll fix it. For free.</p>
                            <a href="#" className="text-orange-500 hover:text-orange-600 font-semibold">
                                Printerval Guarantee »
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CartStep