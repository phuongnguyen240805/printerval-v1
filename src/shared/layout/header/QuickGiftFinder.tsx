import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const QUICK_LINKS = [
  { name: 'For Him', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941285/gift-for-him_hr4cqc.png' },
  { name: 'For Her', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941339/gift-for-her_vmzgs9.png' },
  { name: 'For Dog Lovers', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941504/gift-for-dog_yyila2.png' },
  { name: 'For Pet Lovers', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941440/gift-for-pet_jdljjy.png' },
  { name: 'For Couple', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941454/gift-for-couple_d7jlqs.png' },
  { name: 'For Family', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774941285/gift-for-family_zrrw4p.png' },
];

export const QuickGiftFinder = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-5 font-Inter">
      {/* --- Tiêu đề --- */}
      <h2 className="text-2xl md:text-2xl font-semibold  text-center text-gray-900 mb-5">
        Quick Gift Finder
      </h2>

      {/* --- Danh sách hình tròn (Responsive: 3 cột mobile, 6 cột desktop) --- */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
        {QUICK_LINKS.map((item, index) => (
          <div key={index} className="flex flex-col items-center group cursor-pointer">
            {/* Div bọc ảnh: phải có relative để Image fill hoạt động */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-[3px] border-transparent group-hover:border-orange-400 group-hover:shadow-lg transition-all duration-300">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-[13px] md:text-sm font-Inter font-semibold text-gray-700 text-center group-hover:text-orange-500 transition-colors">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* --- Thanh lọc (Filter Bar) --- */}
      <div className="relative bg-[#FDE6D2] rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-end gap-1 shadow-sm">
        
        {/* Icon hộp quà (Sử dụng Image thay vì img để tối ưu) */}
        <div className="absolute -left-8 -bottom-4 w-28 h-28 hidden lg:block pointer-events-none z-10">
           <Image 
             src="https://res.cloudinary.com/dm1wqczhm/image/upload/v1774869889/tho1_pszhws.png" 
             alt="gift" 
             fill 
             className="object-contain animate-bounce-slow" 
           />
        </div>

        {/* Dropdown 1 */}
        <div className="w-full flex-1">
          <label className="block text-gray-800 font-Inter font-semibold mb-2 text-base md:text-lg ml-1">Who&apos;s This For?</label>
          <div className="relative group">
            <select className="w-full bg-white border-none rounded-2xl py-4 px-5 appearance-none focus:ring-2 focus:ring-orange-400 text-gray-500 font-semibold cursor-pointer shadow-sm">
              <option>All Recipients</option>
              <option>For Him</option>
              <option>For Her</option>
            </select>
          </div>
        </div>

        {/* Dropdown 2 */}
        <div className="w-full flex-1">
          <label className="block text-gray-800 font-Inter font-semibold mb-2 text-base md:text-lg ml-1">What&apos;s the Occasion?</label>
          <div className="relative group">
            <select className="w-full bg-white border-none rounded-2xl py-4 px-5 appearance-none focus:ring-2 focus:ring-orange-400 text-gray-500 font-semibold cursor-pointer shadow-sm">
              <option>All Occasions</option>
              <option>Birthday</option>
              <option>Anniversary</option>
              <option>Valentine</option>
            </select>
          </div>
        </div>

        {/* Nút tìm kiếm */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-[#FF3B30] hover:bg-red-600 text-white font-black py-4 px-10 rounded-2xl transition-all uppercase tracking-tight text-base md:text-lg shadow-xl active:scale-95 whitespace-nowrap">
            Find a Gift Now
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};