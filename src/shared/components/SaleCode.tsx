import { Button } from "@/shared/ui/button";
import { BsCopy } from "react-icons/bs";
import { useEffect, useState } from "react";

const SaleCodeComponent = ({ campaign }: { campaign?: any }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!campaign?.ends_at) return;

        const endTime = new Date(campaign.ends_at).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                clearInterval(interval);
                return;
            }
            const days = Math.floor(diff / 86400000);
            const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
            const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
            const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

            setTimeLeft(`${days}d:${hours}h:${minutes}m:${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [campaign?.ends_at]);

    return (
        <div className="max-w-7xl mx-auto lg:px-2 w-full my-1 md:my-4 lg:my-6">
            <div className="w-full lg:rounded-xl bg-[#f6f7e6] border border-gray-200 px-2 py-1 xl:py-2 text-[#000000] grid grid-cols-5 xl:grid-cols-7 gap-1 items-stretch justify-between shadow-sm">
                
                {/* Desktop Description */}
                <span className="w-full font-medium text-sm hidden xl:inline-flex col-span-3 items-center">
                    {campaign?.description}
                </span>

                {/* Mobile Name */}
                <span className="font-medium text-sm w-full xl:hidden col-span-5 flex items-center">
                    {campaign?.name}
                </span>

                {/* Timer */}
                <span className="font-medium text-xs bg-gray-100 border border-gray-200 px-2 rounded-lg col-span-3 xl:col-span-1 text-center items-center flex justify-center">
                    End in {timeLeft}
                </span>

                {/* Code & Copy Section */}
                <div className="font-medium text-sm bg-gray-100 border border-gray-200 py-1 px-2 rounded-lg flex justify-around items-center col-span-2 xl:col-start-6 gap-2">
                    <span className="hidden md:inline">Use code</span>
                    
                    {/* Desktop Code */}
                    <span className="p-1 rounded-lg bg-white border border-gray-200 text-[#000000] hidden md:inline">
                        {campaign?.promotions?.[0]?.code}
                    </span>

                    {/* Mobile Code / Copied Text */}
                    <span className="rounded-md bg-white border border-gray-200 text-[#000000] text-xs md:hidden p-1">
                        {copied ? "Copied!" : campaign?.promotions?.[0]?.code}
                    </span>

                    {/* Copy Button */}
                    <Button 
                        className="bg-[#111111] text-white hover:bg-black rounded-lg w-7 h-7 flex-shrink-0" 
                        onClick={() => {
                            navigator.clipboard.writeText(campaign?.promotions?.[0]?.code || "");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                    >
                        <BsCopy size={12} />
                    </Button>

                    {/* Desktop Copied Success Message */}
                    {copied && <span className="text-xs text-green-600 hidden md:inline">Copied!</span>}
                </div>
            </div>
        </div>
    );
};

export default SaleCodeComponent;