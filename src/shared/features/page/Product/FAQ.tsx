import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";

const FAQitem = [
    {
        title: "Where do orders ship from, and how long does shipping take?",
        content: "Orders within the U.S. are typically shipped from local fulfilment centres via USPS, FedEx or Canada Post..."
    },
    {
        title: "Where do orders ship from, and how long does shipping take?",
        content: "Orders within the U.S. are typically shipped from local fulfilment centres via USPS, FedEx or Canada Post..."
    },
    {
        title: "Where do orders ship from, and how long does shipping take?",
        content: "Orders within the U.S. are typically shipped from local fulfilment centres via USPS, FedEx or Canada Post..."
    }
]

const FAQ = () => {
    return (
        <div className="p-2">
            <h1 className="font-bold py-2">FAQ</h1>

            <div className="flex w-full flex-col gap-3">
                {FAQitem.map((item, index) => (
                    // Đưa Collapsible vào từng item và thêm 'key' để React không báo lỗi
                    <Collapsible 
                        key={index} 
                        className="border border-orange-300 shadow-lg rounded-md p-2 shadow-orange-100"
                    >
                        <div className="flex items-center justify-between gap-4 px-4">
                            <h4 className="text-sm font-bold">
                                {item.title}
                            </h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <ChevronDown />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="flex flex-col gap-2 px-4 pt-2">
                            {item.content}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    )
}

export default FAQ;