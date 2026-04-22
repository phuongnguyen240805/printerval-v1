"use client";
import { FiTrendingUp } from 'react-icons/fi';

interface Props {
  data: string[];
  isLoading: boolean;
  onItemClick: (term: string) => void; // Khai báo prop này là hết lỗi ngay
}

export function TrendingList({ data, isLoading, onItemClick }: Props) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold font-Inter text-gray-900">Trending searches</h3>
      
      {isLoading ? (
        <div className="text-sm text-gray-400 px-3 py-2">Đang tải xu hướng...</div>
      ) : (
        <div className="space-y-1">
          {data.map((term, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onItemClick(term)}
              // Dùng class hover màu cam giống hệt RecentList cho đồng bộ
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group"
            >
              <FiTrendingUp className="text-gray-400 flex-shrink-0 group-hover:text-orange-500 transition-colors" size={16} />
              <span className="group-hover:text-orange-600 transition-colors">{term}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

