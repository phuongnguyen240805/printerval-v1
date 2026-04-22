// components/Sidebar.tsx
import React from "react";
export default function Sidebar() {
  return (
    <div className="sticky top-4 space-y-6">
        {/* Poster 1 - Học Marketing E-Learning */}
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-green-400 p-6 text-white">
            <div className="text-xs font-semibold mb-2 opacity-90">
              🎓 MONA.Media / Digital-2
            </div>
            <div className="text-xs font-bold mb-1">
              KHÓA HỌC KINH DOANH KHÓA HỌC
            </div>

            <h3 className="text-2xl font-bold mb-2 leading-tight">
              HỌC KINH DOANH
            </h3>
            <h3 className="text-3xl font-bold mb-3 leading-tight">
              E-LEARNING
            </h3>

            <div className="bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold inline-block mb-3">
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs mr-2">
                FREE!
              </span>
              HOÀN TOÀN
            </div>
            <div className="text-2xl font-bold text-green-300">MIỄN PHÍ</div>

            {/* Avatar/người dạy */}
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                THẾ MẠNH
              </div>
            </div>
          </div>
        </div>
        {/* Poster 2 - Dịch vụ SEO */}
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="bg-gradient-to-br from-purple-700 via-blue-600 to-purple-800 p-6 text-white">
            <div className="text-xs font-semibold mb-2 opacity-90">
              🚀 MONA.Media / Digital-2
            </div>

            <h3 className="text-2xl font-bold mb-2 leading-tight">
              ưu ĐÃI DỊCH VỤ SEO
            </h3>
            <div className="text-sm mb-3 opacity-90">
              Qua tăng trí giá lên tối
            </div>

            <div className="text-4xl font-bold text-yellow-400 mb-2">
              72 TRIỆU
            </div>

            <div className="bg-orange-500 text-white rounded-full px-4 py-2 text-sm font-bold inline-block mb-4">
              📞 Nhận ưu đãi ngay!
            </div>

            {/* Avatar/người tư vấn */}
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                TV
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-2xl">⚡</div>
            <div className="absolute bottom-20 left-4 text-yellow-400 text-lg">
              ✨
            </div>
          </div>
        </div>
    </div>
  );
}
