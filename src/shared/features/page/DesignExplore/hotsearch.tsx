import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/input-group"
import { ChartNoAxesCombined, Search } from "lucide-react"
import Link from "next/link"

const HotSearchComponent = ({ hotsearch }: { hotsearch: string[] }) => {
    return (
        <div className="px-3">
            <div className="mt-6 flex items-center justify-between gap-2">
                <ChartNoAxesCombined color="#e65757" className="rounded-full bg-gray-200 p-1" size={28} />
                <div className="overflow-x-auto flex flex-nowrap gap-2 no-scrollbar w-full">
                    {hotsearch.map((item, idx) => (
                        <Link href={'/'} key={idx} className="text-xs text-nowrap">
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
            <InputGroup className="mt-6 rounded-lg py-6 bg-gray-100 text-gray-600 max-w-xl mx-auto">
                <InputGroupInput id="input-group-url" placeholder="Find design" />
                <InputGroupAddon align="inline-end">
                    <Search color="blue" size={43} className="p-0" />
                </InputGroupAddon>
            </InputGroup>
            <div className="mt-6 overflow-x-auto flex flex-nowrap gap-2 no-scrollbar w-full">
                {hotsearch.map((item, idx) => (
                    <Link href={'/'} key={idx} className="text-nowrap p-3 bg-orange-100 rounded-xl">
                        {item}
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default HotSearchComponent