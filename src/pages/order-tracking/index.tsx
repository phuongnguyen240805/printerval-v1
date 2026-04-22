
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { PrimaryLayout } from "@/layouts";
import Image from "next/image";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import Recently from "@/packages/browsing-history/components/recently";

const OrderTracking = () => {
    const form = useForm()
    return (
        <>
            <div className="my-5 px-2 md:px-4 lg:px-8">
                <div className="max-w-7xl mx-auto bg-orange-100 rounded-md flex flex-col md:flex-row items-center lg:items-start p-3 gap-5">
                    <Image src={'/assets/track-order-shipping.webp'} alt="shiping" width={1200} height={780} className="w-72 h-72 md:w-48 md:h-48 lg:w-64 lg:h-64" />
                    <div>
                        <h1 className="text-md font-Inter font-semibold uppercase text-center md:p-4">Tracking Your Order</h1>
                        <p className="text-[16px]">
                            Enter your email to track your order. You can also include your Order Code for faster lookup, then press the Track button.
                        </p>
                        <Form {...form}>
                            <form action="submit" className="md:flex items-end gap-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col md:flex-row md:gap-2 md:items-center">
                                            <div className="mt-2 w-full">
                                                <FormLabel>Billing Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter the email used to place your order" {...field} className="text-md bg-white border-1 text-gray-300 border-gray-500" />
                                                </FormControl>
                                            </div>
                                            <div className="mt-2 w-full">
                                                <FormLabel>Order Code <small>(optional)</small></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your Order code" {...field} className="text-md bg-white border-1 text-gray-300 border-gray-500" />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="uppercase bg-orange-500 p-6 text-lg border-none rounded-none">Track</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <Recently />
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