import Image from "next/image"
import { Button } from "@/shared/ui/button"

const ContentHero = () => {
    return (
        <div className="w-full flex h-[400px] gap-8 mb-8">
            <div className="flex flex-col items-center p-6 text-center gap-3 justify-center">
                <span>Sale Up to 10%</span>
                <h1 className="font-bold text-2xl">Unwrap the Perfect Christmas Gift Ideas! Custom Designs for Everyone</h1>
                <Button>Customize Chrismas Gifts</Button>
            </div>
            <Image alt="" src={'/assets/bannerchristmas-1212-2-5a9c6137f70394488c2eda659317e914.webp'} width={500} height={600} className="w-full rounded-md" />
        </div>
    )
}
export default ContentHero