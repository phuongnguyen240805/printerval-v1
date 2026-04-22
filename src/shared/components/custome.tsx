import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react"


const CustomeProduct = (product: { images: any[]; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | Iterable<ReactNode> | null | undefined }) => {
    return (
        <div className="w-full h-full px-2 xl:p-0 relative bg-[#F8F8FA]">
            <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent>
                    {product?.images?.slice(0, 2).map((image, index) => (
                        <CarouselItem key={index} className="flex justify-end">
                            <Image src={image.url} alt={image.alt || `Image ${index + 1}`} width={500} height={700} className="w-full object-cover h-full max-w-xl" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 xl:hidden" />
                <CarouselNext className="absolute right-0 xl:hidden" />
            </Carousel>
            <h1 className="absolute top-2 left-1/2 transform -translate-x-1/2 p-3 text-xl font-medium">{product?.title}</h1>
        </div>
    )
}
export default CustomeProduct