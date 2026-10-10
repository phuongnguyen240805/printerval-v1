import Link from 'next/link';
import Image from 'next/image';
import { FiCheckCircle, FiDownload, FiEye, FiStar } from 'react-icons/fi';
import type { ContractItem } from './mockData';
import { formatVnd } from './mockData';

export function ContractCard({ item }: { item: ContractItem }) {
  const discount = Math.max(0, Math.round((1 - item.price / item.oldPrice) * 100));

  return (
    <Link
      data-liquid-card=""
      href={`/collection/mau-hop-dong/chi-tiet/${item.id}`}
      className="relative block w-full rounded-xl bg-white p-3 text-left transition-colors duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white md:p-4"
    >
      {item.kind === 'bundle' ? (
        <div className="absolute right-0 top-0 z-20 rounded-bl-lg rounded-tr-lg bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 text-[11px] font-medium text-white md:text-xs">
          <span className="hidden sm:inline">Tiết kiệm </span>- {discount}%
        </div>
      ) : null}

      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:gap-3">
        <div className="flex min-w-0 flex-1 items-start space-x-2 md:space-x-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 md:h-12 md:w-12">
            <Image
              src={item.kind === 'bundle' ? '/mau-hop-dong/ui/winrar-logo.jpeg' : '/mau-hop-dong/ui/microsoft-word-icon.png'}
              alt={item.kind === 'bundle' ? 'Package icon' : 'Word icon'}
              width={40}
              height={40}
              className={item.kind === 'bundle' ? 'h-full w-full object-contain p-1.5' : 'h-6 w-6 object-contain'}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className={`font-medium text-gray-900 ${item.kind === 'bundle' ? 'w-[calc(100%-50px)]' : ''} text-sm md:text-base`}>
                <span>{item.title}</span>
                {item.verified ? <FiCheckCircle className="ml-1 inline-block h-3 w-3 text-green-500 md:h-4 md:w-4" /> : null}
              </h3>
              {item.hot && item.kind === 'contract' ? (
                <span className="hidden items-center rounded-full border border-blue-200 bg-blue-100 px-1.5 py-[2px] text-[11px] font-medium text-blue-800 sm:inline-flex">
                  <span className="mr-1">🔥</span>Standard
                </span>
              ) : null}
            </div>

            {item.kind === 'bundle' ? (
              <p className="mb-2 line-clamp-2 text-xs leading-5 text-gray-600 md:text-sm">{item.description}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 md:gap-x-4 md:text-sm">
              <span className="flex items-center"><FiStar className="mr-1 h-3 w-3 fill-current text-yellow-400 md:h-4 md:w-4" />{item.rating}</span>
              <span className="flex items-center"><FiEye className="mr-1 h-3 w-3 md:h-4 md:w-4" /><span className="hidden sm:inline">{item.views} lượt xem</span><span className="sm:hidden">{item.views}</span></span>
              <span className="flex items-center"><FiDownload className="mr-1 h-3 w-3 md:h-4 md:w-4" /><span className="hidden sm:inline">{item.downloads} lượt tải</span><span className="sm:hidden">{item.downloads}</span></span>
            </div>
          </div>
        </div>

        <div className="w-full flex-shrink-0 text-right md:w-auto">
          <div className="flex items-end justify-end space-x-2 text-lg font-bold md:flex-col md:text-xl">
            <span className={`text-xs text-gray-500 line-through md:text-sm ${item.kind === 'bundle' ? 'md:pt-3' : ''}`}>{formatVnd(item.oldPrice)}</span>
            <span className="text-lg font-bold text-green-600 md:text-xl">{formatVnd(item.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
