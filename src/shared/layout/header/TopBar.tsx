import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Smartphone, ArrowRight } from "lucide-react"
import Link from "next/link"

const TopBar = ({ campaign, blogs }: { campaign?: any, blogs?: any[] | null }) => {
  // Đề phòng trường hợp Strapi chưa tải xong hoặc không có bài viết, 
  // ta để sẵn vài slogan mặc định cho đẹp.
  const displayItems = blogs && blogs.length > 0 ? blogs : [
    { id: 'default-1', Title: 'Elevate Your Style with Our Latest Collection', slug: '/designs' },
    { id: 'default-2', Title: 'Discover the Art of Minimalist Living', slug: '/blog' }
  ];

  return (
    <div className="relative w-full border-b border-black/10 overflow-hidden"
        style={{ 
        background: 'linear-gradient(90deg, #E56262 0%, #FE861F 100%)',
      }} 
    >
      <div className="max-w-7xl mx-auto md:flex md:justify-between md:items-center md:px-4 p-2">
        
        <Carousel 
          className="w-full max-w-sm lg:max-w-xl mx-auto md:mx-0" 
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 3500 })]} // Tăng delay lên một chút để user kịp đọc text
        >
          <CarouselContent>
            {displayItems.map((post: any, index: number) => {
              // Xử lý link: nếu là bài từ Strapi thì dùng documentId/id, nếu là mặc định thì dùng slug
              const postLink = post.slug ? post.slug : `/blog/${post.documentId || post.id}`;
              const postTitle = post.Title || post.title || post.name;

              return (
                <CarouselItem key={index}>
                  <div className="flex justify-center md:justify-start items-center h-full">
                    <Link 
                      href={postLink}
                      className="group flex items-center gap-2 text-xs sm:text-[13px] text-white font-Inter font-semibold hover:text-yellow-400 transition-colors py-0.5"
                    >
                      <span className="truncate max-w-[250px] sm:max-w-md">
                        {postTitle}
                      </span>
                      <ArrowRight 
                        size={12} 
                        className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" 
                      />
                    </Link>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        {/* Right Section */}
        <div className="hidden md:flex justify-end items-center text-xs text-white font-medium flex-shrink-0">
          <Smartphone size={16} color="white" className="mr-1" />
          <span className="border-r border-white/20 px-2">Get the Printerval app</span>
          <Link href="/app-download" className="px-2 text-yellow-400 font-bold underline hover:text-gray-300 transition-colors">
            Download App
          </Link>
        </div>
      </div>
    </div>
  )
}

export { TopBar }