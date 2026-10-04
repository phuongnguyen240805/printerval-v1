
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { PrimaryLayout } from "@/layouts";
import Image from "next/image";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { LiquidSurface } from '@/shared/ui/liquid/LiquidSurface';

const OrderTracking = () => {
    const form = useForm({ defaultValues: { billingEmail: '', orderCode: '' } })
    return (
        <>
            <div className="my-5 px-2 md:px-4 lg:px-8">
                <LiquidSurface className="max-w-7xl mx-auto flex flex-col md:flex-row items-center lg:items-start p-5 md:p-6 gap-5">
                    <Image src={'/assets/track-order-shipping.webp'} alt="shiping" width={1200} height={780} className="w-72 h-72 md:w-48 md:h-48 lg:w-64 lg:h-64" />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-md font-Inter font-semibold uppercase text-center md:p-4">Tracking Your Order</h1>
                        <p className="text-[16px]">
                            Enter your email to track your order. You can also include your Order Code for faster lookup, then press the Track button.
                        </p>
                        <Form {...form}>
                            <form action="submit" className="md:flex items-end gap-2">
                                <FormField
                                    control={form.control}
                                    name="billingEmail"
                                    render={({ field }) => (
                                        <FormItem className="mt-2 min-w-0 flex-1">
                                                <FormLabel>Billing Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" autoComplete="email" placeholder="Enter the email used to place your order" {...field} className="h-11" />
                                                </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="orderCode"
                                    render={({ field }) => (
                                        <FormItem className="mt-2 min-w-0 flex-1">
                                                <FormLabel>Order Code <small>(optional)</small></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your Order code" {...field} className="h-11" />
                                                </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="mt-3 md:mt-0 h-11 w-full md:w-auto uppercase bg-orange-500 px-6 text-base border-none">Track</Button>
                            </form>
                        </Form>
                    </div>
                </LiquidSurface>
            </div>
            {/* <Recently /> */}
        </>
    )
}
OrderTracking.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Order Tracking', canonical: '/order-tracking' }}>
            {page}
        </PrimaryLayout>
    );
};
export default OrderTracking
