import { url } from "inspector"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
const Blog = [
    {
        Title: "50+ Quotes To Write Into Gift Card For Thanksgiving",
        url: "/blog/50-quotes-to-write-into-gift-card-for-thanksgiving",
    },
    {
        Title: "Top 10 Unique Thanksgiving Gift Ideas for Loved Ones",
        url: "/blog/top-10-unique-thanksgiving-gift-ideas-for-loved-ones",
    },
    {
        Title: "How to Choose the Perfect Thanksgiving Gift",
        url: "/blog/how-to-choose-the-perfect-thanksgiving-gift",
    },
]
const ListStory = () => {
    return (
        <div className="px-2 py-4 w-full bg-[#FCF1D4] rounded-xl lg:max-w-xs">
            <h1 className="text-xl font-bold p-4 text-center">Stories</h1>
            <div className="px-2 flex flex-col items-stretch justify-evenly">
                <Image src={'/assets/culture-4125c0fdfe75a125cb51d68eb9eea6a3.jpg'} width={1200} height={600} alt="Stories" className="w-full h-auto rounded-xl" />
                <div className="text-gray-500">
                    Oct 30, 2024
                </div>
                <h3 className="font-medium text-lg">
                    50+ Quotes To Write Into Gift Card For Thanksgiving
                </h3>
                <hr className="bg-orange-500 my-2" />
                <div>
                    {Blog.map((item, index) => (
                        <Link href={item.url} key={index} className="flex items-center gap-2 mb-4 justify-between">
                            <h4 className="text-gray-500 font-medium text-md">{item.Title}</h4>
                            <ArrowRightIcon size={32}/>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ListStory