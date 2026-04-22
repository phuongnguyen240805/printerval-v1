"use client";
import { FiClock } from 'react-icons/fi'; // Dùng icon từ thư viện bạn đang có sẵn

interface Props {
  data: string[];
  onItemClick: (term: string) => void; // Thêm hàm này để xử lý khi user click vào từ khóa
}

export function RecentList({ data, onItemClick }: Props) {
  // Nếu chưa có lịch sử tìm kiếm thì ẩn khối này đi
  if (data.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold font-Inter text-gray-900 mb-4">Recent searches</h3>
      <div className="space-y-1">
        {data.map((term, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onItemClick(term)}
            // Đồng bộ class Tailwind y hệt như file Search.tsx của bạn
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group"
          >
            <FiClock className="text-gray-400 flex-shrink-0 group-hover:text-orange-500 transition-colors" size={16} />
            <span className="group-hover:text-orange-600 transition-colors">{term}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

