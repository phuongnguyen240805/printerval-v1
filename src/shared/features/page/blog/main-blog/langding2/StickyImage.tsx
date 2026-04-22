import React from 'react';
import Image from 'next/image';

interface StickyImageColumnProps {
  // Thay vì nhận mảng, chỉ nhận đúng cái ảnh đang cần hiện
  activeImage?: string;
}

const StickyImageColumn: React.FC<StickyImageColumnProps> = ({
  activeImage,
}) => {
  const fallback =
    'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549847/1-5-72abfffea10fcd7e98a9399370ac902e2_bgp2h1.jpg';

  const imageToShow = activeImage ?? fallback;

  return (
    <div className="sticky top-24 flex justify-center items-center z-20">
      <div className="bg-white/5 p-3 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm">
        <div className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-100 relative">
          {/* Key quan trọng: Khi src đổi, React sẽ hủy ảnh cũ và tạo ảnh mới => có hiệu ứng fade-in */}
          <Image
            key={imageToShow}
            src={imageToShow}
            alt="Preview"
            fill
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 animate-fade-in"
            sizes="(max-width: 420px) 100vw, 420px"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default StickyImageColumn;
