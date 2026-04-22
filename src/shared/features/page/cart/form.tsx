"use client"
import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Checkbox } from "@/shared/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/ui/Accordion"
import { Card, CardContent } from "@/shared/ui/card"
import Image from "next/image"

export default function CheckoutForm() {
    const [promoCode, setPromoCode] = useState("")
    const [selectedTip, setSelectedTip] = useState<string | null>(null)

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4">
            {/* Left Column - Forms */}
            <div className="flex-1 space-y-6">
                {/* Express Checkout */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Express checkout</h3>

                    {/* Link Button */}
                    <Button className="w-full bg-[#00C853] hover:bg-[#00b248] text-white font-bold py-4 rounded-lg flex items-center justify-between px-4">
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
                    <Button className="w-full bg-[#FFC439] hover:bg-[#f0b429] py-4 rounded-lg">
                        <span className="text-[#003087] font-bold text-xl italic">Pay</span>
                        <span className="text-[#009cde] font-bold text-xl italic">Pal</span>
                    </Button>

                    <p className="text-center text-sm text-gray-500">or manual entry</p>
                </div>

                {/* Billing Information */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">Billing information</h2>

                        <div className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" placeholder="First name" />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" placeholder="Last name" />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-2">
                                <Select defaultValue="+1">
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                        <SelectItem value="+84">🇻🇳 +84</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Phone (required)" className="flex-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email (required)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="xiaoding1123@email.com"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Shipping Address</h2>
                            <Button variant="link" className="text-blue-500 p-0 h-auto text-sm">
                                Fill from address book
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Send to friend checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox id="sendToFriend" />
                                <Label htmlFor="sendToFriend" className="text-sm">Send to your friend</Label>
                            </div>

                            {/* Country */}
                            <div>
                                <Label htmlFor="country">Country / Region</Label>
                                <Select defaultValue="us">
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="vn">Vietnam</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Address */}
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="Address" />
                            </div>

                            {/* Apartment */}
                            <div>
                                <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                                <Input id="apartment" placeholder="Apartment, suite, etc. (optional)" />
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City / Suburb</Label>
                                    <Input id="city" placeholder="City / Suburb" />
                                </div>
                                <div>
                                    <Label htmlFor="state">State / Province</Label>
                                    <Select>
                                        <SelectTrigger id="state">
                                            <SelectValue placeholder="State / Province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ca">California</SelectItem>
                                            <SelectItem value="ny">New York</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* ZIP Code */}
                            <div>
                                <Label htmlFor="zip">ZIP / Postal code</Label>
                                <Input id="zip" placeholder="ZIP / Postal code" />
                            </div>

                            {/* Order Notes */}
                            <div>
                                <Label htmlFor="notes">Order notes (optional)</Label>
                                <Input id="notes" placeholder="Order notes (optional)" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Billing address</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Billing address matches shipping address</span>
                                <Button variant="link" className="text-orange-500 p-0 h-auto text-sm">
                                    Change
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-[400px] space-y-4">
                <h2 className="text-xl font-bold">Order Review</h2>

                {/* Product Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <div className="relative">
                                <Image
                                    src="/placeholder-product.jpg"
                                    alt="Product"
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover"
                                />
                                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                    x1
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm mb-1">
                                    Funny Clogs for Thanksgiving Turkey Day
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">White, Size: 8 US, Kids</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <Button variant="link" className="text-blue-500 p-0 h-auto text-xs">
                                        ✏️ Edit
                                    </Button>
                                    <Button variant="link" className="text-gray-500 p-0 h-auto text-xs">
                                        🗑️ Remove
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-orange-500">
                                    <Checkbox id="digital" className="w-4 h-4" />
                                    <Label htmlFor="digital" className="text-xs">
                                        Want the digital file? Get this design as a digital download. +$2.99 ⬇️
                                    </Label>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-orange-500">${28.55}</div>
                                <div className="text-xs line-through text-gray-400">${61.87}</div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-xs">
                                <p className="font-semibold">Standard shipping from United States</p>
                                <p className="text-gray-600">10 - 23 business days with tracking</p>
                                <p className="font-bold mt-1">$7.99</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-bold mb-4">Order Summary</h3>

                        {/* User Discounts Accordion */}
                        <Accordion type="single" collapsible className="mb-4">
                            <AccordionItem value="discounts" className="border rounded-lg px-3">
                                <AccordionTrigger className="text-sm hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">💰</span>
                                        <span>USER DISCOUNTS</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-xs text-gray-600">No discounts available</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Promo Code Accordion */}
                        <Accordion type="single" collapsible className="mb-4">
                            <AccordionItem value="promo" className="border rounded-lg px-3">
                                <AccordionTrigger className="text-sm hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">🎫</span>
                                        <span>USE PROMOTION CODE</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            placeholder="Promotion Code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <Button className="bg-blue-500 hover:bg-blue-600">APPLY</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Price Summary */}
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold">$31.54</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping fee:</span>
                                <span className="font-semibold text-orange-500">+$7.99</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tips:</span>
                                <span className="font-semibold">$0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span className="text-orange-500">$39.53</span>
                            </div>
                            <p className="text-xs text-gray-500">Tax (if applicable): included</p>
                        </div>

                        {/* Tips Section */}
                        <div className="p-3 bg-green-50 rounded-lg mb-4">
                            <p className="text-sm font-semibold text-green-700 mb-2">
                                Loved your purchase? Leave a small tip to support our team. Thank you ❤️
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {['No tips', '$5.00', '$3.00', '$0.47'].map((tip) => (
                                    <Button
                                        key={tip}
                                        variant={selectedTip === tip ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedTip(tip)}
                                        className={selectedTip === tip ? "bg-green-600" : ""}
                                    >
                                        {tip}
                                    </Button>
                                ))}
                                <Button variant="outline" size="sm">Other</Button>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">Payment Methods</h4>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                    </svg>
                                    <span className="text-xs">Card</span>
                                </Button>
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                                    <div className="font-bold text-green-600">$</div>
                                    <span className="text-xs">Buy now, pay later</span>
                                </Button>
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1">
                                    <span className="text-blue-600 font-bold">P</span>
                                    <span className="text-xs">PayPal</span>
                                </Button>
                            </div>

                            {/* Payment Icons */}
                            <div className="flex justify-center gap-2 mb-4 flex-wrap">
                                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                                <div className="w-8 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                                <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-[8px] font-bold">AMEX</div>
                                <div className="w-8 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-[8px] font-bold">JCB</div>
                                <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center text-white text-[8px] font-bold">DC</div>
                                <div className="w-8 h-6 bg-pink-500 rounded flex items-center justify-center text-white text-[8px] font-bold">CB</div>
                                <div className="w-8 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[8px] font-bold">UP</div>
                            </div>

                            {/* Card Input Fields */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Input
                                        placeholder="1234 1234 1234 1234"
                                        className="pr-24"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white px-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold">link</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className="text-blue-700 font-bold">VISA</span>
                                            <span className="font-bold">0704</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="MM / YY" />
                                    <div className="relative">
                                        <Input placeholder="CVC" className="pr-6" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
