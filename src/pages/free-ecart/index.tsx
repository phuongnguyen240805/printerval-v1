import { PrimaryLayout } from "@/layouts";
import SaleCodeComponent from "@/shared/components/SaleCode";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { api } from "@/utils/api";
import { SquaresIntersect } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/ui"
const collection = [
    'Animal', 'Baby', 'Birthday', 'Blank', 'Food', 'Friendship', 'Funny'
]
const Item = [
    {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }, {
        thumbanil: "https://sbqtqbfkhryqtetytzfi.supabase.co/storage/v1/object/public/medusa-db/09f039e5b8e1fc56bb4449453fdfd5bf-Catalog-Dinosaur-Growth-Chart.jpg",
        title: 'Dinosaur Growth Chart'
    }
]
const ECard = () => {
    const [filter, setFilter] = useState<boolean>(false)
    const [index, setIndex] = useState<string | null>(null)
    const [display, setDisplay] = useState<any[]>([])
    const [open, setOpen] = useState(false)
    const pagination = Math.ceil(collection.length / 6)
    const [item, setItem] = useState(Item.slice(0, 6))
    const [active, setActive] = useState(1)
    // const { data: collection } = api.medusa.getCollections.useQuery()
    const { data: product } = api.medusa.getProducts.useQuery({
        regionID: "reg_01KEBTGVSJEJNJ4AP2GSAXGXA8",
        collection_id: index ? index : undefined
    },
        { enabled: !!index } // Chỉ fetch khi có index)
    )
    const { data: allProduct, isLoading } = api.medusa.getDigitalProduct.useQuery()
    const { data: campaign } = api.medusa.listCampaigns.useQuery()
    // const sideBarItem = collection
    //     ?.filter((item) => item?.metadata?.digital_product === true)
    //     ?.sort((a, b) => a.title.localeCompare(b.title)); // hoặc a.name nếu dùng name    console.log(sideBarItem)
    useEffect(() => {
        if (filter === false && !isLoading)
            setDisplay(allProduct)
        else
            setDisplay(product as any)
    }, [filter, index, isLoading])
    const hanldePagination = (idx: number) => {
        setItem(Item.slice(idx * 6, (idx + 1) * 6))
        setActive(idx + 1)
    }
    return (
        <div className="max-w-7xl mx-auto">
            <SaleCodeComponent campaign={campaign?.[0]} />
            <Breadcrumb className="px-2 py-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>E-Card</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="md:flex">
                <div className="md:hidden px-2" onClick={() => setOpen(!open)}>
                    <Sheet open={open}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full p-6 bg-orange-500 text-white hover:bg-orange-400 text-lg" size={"icon"} onClick={() => setOpen(true)}>
                                <SquaresIntersect size={40} />
                                <span className="uppercase">occasion</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={"left"} className="p-0">
                            <SheetHeader className="uppercase bg-orange-500 w-full p-4 text-lg">
                                <SheetTitle className="text-white font-bold">occasion</SheetTitle>
                            </SheetHeader>
                            <div>
                                {collection.sort((a, b) => a.localeCompare(b))?.map((item, idx) => (
                                    <div className="px-4 py-3 border-b" onClick={() => {
                                        setFilter(true)
                                        setIndex(item)
                                        setOpen(false)
                                    }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <ul className="hidden md:block w-72 px-2 py-4">
                    <li className="w-full bg-orange-500 text-center text-white hover:bg-orange-400 text-lg p-3 rounded-t-lg">
                        <span className="uppercase">occasion</span>
                    </li>
                    {collection.sort((a, b) => a.localeCompare(b))?.map((item, idx) => (
                        <li className="px-4 py-3 border-gray-100 border" onClick={() => {
                            setFilter(true)
                            setIndex(item)
                            setOpen(false)
                        }}>
                            {item}
                        </li>
                    ))}
                </ul>
                <div className="px-2 py-4 text-center">
                    <h1 className="mb-4 text-xl font-bold">eCards</h1>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-1 lg:grid-cols-4 lg:gap-12">
                        {item?.map((item: any) => (
                            <Link href={`/free-ecart/`} className="flex flex-col gap-1 items-center">
                                <Image src={item.thumbanil} alt="f" width={1280} height={720} className="object-cover w-36 h-36 md:w-40 md:h-40 lg:w-56 lg:h-56" />
                                <span className="text-center text-lg font-medium md:text-md">{item.title}</span>
                            </Link>
                        ))}
                    </div>
                    <Pagination className="py-8">
                        <PaginationContent>
                            {Array.from({ length: pagination }).map((_, idx) => (
                                <PaginationItem className="rounded-full bg-gray-400">
                                    <PaginationLink onClick={() => hanldePagination(idx)} isActive={active === (idx + 1) ? true : false}>{idx + 1}</PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}
ECard.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Free E-Card', canonical: '/free-ecart' }}>
            {page}
        </PrimaryLayout>
    );
};
export default ECard