import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FiCheckCircle, FiSearch, FiShield } from 'react-icons/fi';
import { contractCategories } from './mockData';

interface ContractSidebarProps {
  selected?: string;
  onSelect: (category: string) => void;
  showBanner?: boolean;
}

export function ContractSidebar({ selected = 'Tất cả', onSelect, showBanner = false }: ContractSidebarProps) {
  const [categoryQuery, setCategoryQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const filtered = useMemo(() => {
    const keyword = categoryQuery.trim().toLocaleLowerCase('vi');
    const items = keyword ? contractCategories.filter((item) => item.toLocaleLowerCase('vi').includes(keyword)) : contractCategories;
    return expanded || keyword ? items : items.slice(0, 12);
  }, [categoryQuery, expanded]);

  return (
    <aside className="space-y-3 md:space-y-4">
      <div data-liquid-surface="" className="rounded-xl bg-white p-3 md:p-4">
        <h3 className="mb-2 text-xs font-medium text-gray-700 md:mb-3 md:text-sm">Danh mục phổ biến</h3>
        <div className="relative mb-3">
          <input
            value={categoryQuery}
            onChange={(event) => setCategoryQuery(event.target.value)}
            placeholder="Tìm kiếm danh mục..."
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 pr-8 text-xs outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 md:px-3 md:py-2 md:text-sm"
          />
          <FiSearch className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 md:h-4 md:w-4" />
        </div>
        <div className="space-y-1.5 md:space-y-2">
          {!categoryQuery ? (
            <button
              type="button"
              onClick={() => onSelect('Tất cả')}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition md:text-sm ${selected === 'Tất cả' ? 'bg-green-50 font-semibold text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Tất cả hợp đồng
            </button>
          ) : null}
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition md:text-sm ${selected === item ? 'bg-green-50 font-semibold text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              • {item}
            </button>
          ))}
          {!filtered.length ? <p className="px-2 py-3 text-xs text-gray-400">Không có danh mục phù hợp.</p> : null}
        </div>
        {!categoryQuery ? (
          <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-3 w-full rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 md:text-sm">
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        ) : null}
      </div>

      <div data-liquid-surface="" className="rounded-xl bg-white p-3 md:p-4">
        <h3 className="mb-2 flex items-center text-xs font-medium text-gray-700 md:mb-3 md:text-sm"><FiShield className="mr-1 h-3 w-3 text-green-600 md:h-4 md:w-4" />Đảm bảo chất lượng</h3>
        <div className="space-y-1.5 text-xs text-gray-600 md:space-y-2 md:text-sm">
          {['Kiểm duyệt bởi luật sư', 'Cập nhật theo quy định mới', 'Đảm bảo tính pháp lý'].map((text) => (
            <div key={text} className="flex items-center"><FiCheckCircle className="mr-1.5 h-3 w-3 flex-shrink-0 text-green-500 md:mr-2 md:h-4 md:w-4" /><span>{text}</span></div>
          ))}
        </div>
      </div>

      {showBanner ? (
        <div data-liquid-surface="" className="overflow-hidden rounded-xl bg-white">
          <Image src="/mau-hop-dong/ui/thienma-list.jpeg" alt="Luật sư tư vấn pháp luật" width={400} height={200} className="h-auto w-full object-cover" />
        </div>
      ) : null}
    </aside>
  );
}
