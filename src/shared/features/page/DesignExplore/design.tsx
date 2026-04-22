import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog"
import Image from "next/image"
import { useState } from "react"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Card, CardContent } from "@/shared/ui/card"

const DesignComponent = ({ image }: { image: string[] }) => {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState('')
    const handleClick = (src: string) => {
        setOpen(!open)
        setActive(src)
    }
    return (
        <div className="my-6 px-2">
            {/* Masonry container */}
            <div
                className="
          columns-2 
          sm:columns-2 
          md:columns-3 
          lg:columns-4 
          xl:columns-6
          gap-4
        "
            >
                {image.map((src, i) => (
                    <div
                        key={i}
                        className="
                            mb-4 
                            break-inside-avoid 
                            bg-white 
                            rounded-xl 
                            shadow-sm 
                            transition-all 
                            duration-300 
                            hover:shadow-lg 
                            hover:scale-[1.02] 
                            hover:z-10
                            hover:cursor-pointer
                        "
                        onClick={() => handleClick(src)}
                    >
                        <Image
                            src={src}
                            alt=""
                            width={1280}
                            height={720}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                ))}
                <Dialog open={open} onOpenChange={() => setOpen(false)}>
                    <DialogContent className="p-0 flex flex-col gap-1 rounded-md lg:flex-row lg:items-stretch lg:w-96">
                        <Image src={active} alt="Thumbnail" width={1280} height={720} className="w-full h-48 lg:h-full max-w-xs rounded-md" />
                        <ScrollArea className="p-4 h-48 lg:hidden">
                            <h1 className="text-lg font-bold">Clothing</h1>
                            <div className="flex gap-2">
                                <Card className="border-none py-4">
                                    <CardContent className="p-0 flex flex-col gap-1">
                                        <Image src={'/assets/055ffd88b471563b2adc052f295eefe2.webp'} alt="product" width={1280} height={720} className="w-32" />
                                        <span>T-Shirt</span>
                                        <span className="text-red-600 font-bold">
                                            $17.25
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                        <div className="hidden lg:block w-full">
                            <h1 className="text-lg font-bold">Clothing</h1>
                            <div className="flex gap-2">
                                <Card className="border-none py-4">
                                    <CardContent className="p-0 flex flex-col gap-1">
                                        <Image src={'/assets/055ffd88b471563b2adc052f295eefe2.webp'} alt="product" width={1280} height={720} className="w-32" />
                                        <span>T-Shirt</span>
                                        <span className="text-red-600 font-bold">
                                            $17.25
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default DesignComponent