// "use client"

// import Image from "next/image"
// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

// const mockProducts = Array.from({ length: 40 }).map((_, i) => ({
//     id: i + 1,
//     title: "Santa Riding Unicorn T Shirt Christmas",
//     author: "HArdlireBU",
//     price: 15,
//     oldPrice: 24,
//     discount: 45,
//     image: "/assets/products/product-1.jpg"
// }))

// const ListProduct = () => {
//     const [visibleCount, setVisibleCount] = useState(10)

//     const loadMore = () => {
//         setVisibleCount(prev => prev + 10)
//     }

//     return (
//         <div>
//             <div>
//                 <h1 className="font-bold text-xl mb-4">Best Items for Christmas Gifts Shopping</h1>
//                 <Tabs defaultValue="T-shirts">
//                     <TabsList className="w-full bg-transparent overflow-hidden justify-start border-b-2 pb-3 gap-2">
//                         <TabsTrigger value="T-shirts">T-shirts</TabsTrigger>
//                         <TabsTrigger value="Ugly">Ugly Sweaters</TabsTrigger>
//                         <TabsTrigger value="Ornaments">Ornaments</TabsTrigger>
//                         <TabsTrigger value="Pajamas">Pajamas Sets</TabsTrigger>
//                         <TabsTrigger value="Chrismas">Chrismas Stockings</TabsTrigger>
//                         <TabsTrigger value="Hawaiian">Hawaiian Shirts</TabsTrigger>
//                         <TabsTrigger value="Family">Family T-shirts</TabsTrigger>
//                         <TabsTrigger value="Hoodies">Hoodies</TabsTrigger>
//                         <TabsTrigger value="SweatShirt">Sweatshirts</TabsTrigger>
//                         <TabsTrigger value="Wooden">Wooden Collection</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="T-shirts">
//                         <div className="grid grid-cols-5 gap-6 mt-4">
//                             {mockProducts.slice(0, visibleCount).map(prod => (
//                                 <div key={prod.id} className="rounded-md">
//                                     <Image
//                                         src={prod.image}
//                                         width={300}
//                                         height={300}
//                                         alt={prod.title}
//                                         className="rounded-md"
//                                     />
//                                     <h3 className="font-bold truncate text-sm mt-2">{prod.title}</h3>
//                                     <p className="text-gray-500 text-xs mb-1">by {prod.author}</p>

//                                     <div className="flex items-center gap-2 text-sm">
//                                         <span className="text-green-500">${prod.price}</span>
//                                         <span className="text-gray-400 line-through">${prod.oldPrice}</span>
//                                         <span className="text-red-500">({prod.discount}%)</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {visibleCount < mockProducts.length && (
//                             <div className="flex justify-center mt-6">
//                                 <button
//                                     onClick={loadMore}
//                                     className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
//                                 >
//                                     Load More
//                                 </button>
//                             </div>
//                         )}
//                     </TabsContent>
//                 </Tabs>
//             </div>
//             <div>
//                 <h3 className="font-bold text-xl my-8">New Christmas Gifts Arrivals </h3>
//                 <div className="grid grid-cols-5 gap-6 mt-4">
//                     {mockProducts.slice(0, visibleCount).map(prod => (
//                         <div key={prod.id} className="rounded-md">
//                             <Image
//                                 src={prod.image}
//                                 width={300}
//                                 height={300}
//                                 alt={prod.title}
//                                 className="rounded-md"
//                             />
//                             <h3 className="font-bold truncate text-sm mt-2">{prod.title}</h3>
//                             <p className="text-gray-500 text-xs mb-1">by {prod.author}</p>

//                             <div className="flex items-center gap-2 text-sm">
//                                 <span className="text-green-500">${prod.price}</span>
//                                 <span className="text-gray-400 line-through">${prod.oldPrice}</span>
//                                 <span className="text-red-500">({prod.discount}%)</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {visibleCount < mockProducts.length && (
//                     <div className="flex justify-center mt-6">
//                         <button
//                             onClick={loadMore}
//                             className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
//                         >
//                             Load More
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default ListProduct
