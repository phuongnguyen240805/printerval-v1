'use client'; // Directive theo yêu cầu của bạn

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
const Langdingblog1 = () => {
  return (
    <section className="w-full min-h-screen bg-purple-100 p-4 md:p-8 flex items-center justify-center font-sans">
      {/* Container chính (Giả lập khung cửa sổ trình duyệt) */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-200">
        {/* Thanh tiêu đề giả lập (3 dấu chấm) */}
        <div className="bg-[#F8F5FF] px-6 py-4 flex gap-2 border-b border-purple-100">
          <div className="w-3 h-3 rounded-full bg-purple-200"></div>
          <div className="w-3 h-3 rounded-full bg-purple-200"></div>
          <div className="w-3 h-3 rounded-full bg-purple-200"></div>
        </div>

        {/* Nội dung chính bên trong */}
        <div className="bg-gradient-to-b from-[#F8F5FF] to-purple-50 p-8 md:p-16">
          {/* Header text */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              <span className="text-[#F28C38]">Nguồn tài nguyên</span> để doanh
              nghiệp <br className="hidden md:block" />
              phát triển trên Internet
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Kiến thức tại Mona Blog không phải để kiếm tiền, bán khóa học hay
              các việc kiếm lợi nhuận tương tự.
              <br />
              Chúng tôi chia sẻ miễn phí nguồn tài nguyên dành cho các khách
              hàng và những bạn đọc quan tâm.
            </p>
          </div>

          {/* Card Component - BỌC VIỀN VÀNG Ở ĐÂY */}
          <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-8 items-center">
                {/* Cột trái: Nội dung text */}
                <div className="flex-1 space-y-4">
                  {/* Badge */}
                  <span className="bg-[#7D3C98] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide">
                    SEO
                  </span>

                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    Kiến thức SEO
                  </h3>

                  <div className="text-gray-500 text-sm space-y-3">
                    <p>
                      Kiến thức tại Mona Blog không phải để kiếm tiền, bán khóa học
                      hay các mục đích kinh doanh tại lợi nhuận.
                    </p>
                    <p>
                      100% nguồn tài nguyên chúng tôi chia sẻ tại đây là miễn phí
                      cho newbie và khách hàng quan tâm.
                    </p>
                  </div>

                  {/* Link xem thêm */}
                  <button
                    onClick={() => console.log('Navigate to details')}
                    className="flex items-center text-xs font-bold text-gray-500 mt-4 hover:text-[#7D3C98] transition-colors group"
                  >
                    Xem thêm
                    <ChevronRight
                      size={14}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>

                {/* Cột phải: Hình ảnh */}
                <div className="flex-1 w-full">
                  <div className="relative w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src="https://res.cloudinary.com/dzkcqktcl/image/upload/f_auto,q_auto/v1765183829/thumbnail-cong-cu-seo_bqydzt.png"
                      alt="Kiến thức SEO tối ưu công cụ tìm kiếm"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Langdingblog1;