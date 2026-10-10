import Image from 'next/image';
import { FiCheckCircle, FiDownload, FiEye, FiShield, FiStar, FiX } from 'react-icons/fi';
import type { ContractItem } from './mockData';
import { formatVnd } from './mockData';
import { CatalogDialog } from '@/shared/ui/liquid/CatalogDialog';

export function ContractPreviewModal({ item, onClose }: { item: ContractItem | null; onClose: () => void }) {
  if (!item) return null;
  const discount = Math.max(0, Math.round((1 - item.price / item.oldPrice) * 100));

  return (
    <CatalogDialog open onClose={onClose} title={item.title} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              <Image src={item.kind === 'bundle' ? '/mau-hop-dong/ui/winrar-logo.jpeg' : '/mau-hop-dong/ui/microsoft-word-icon.png'} alt="Document icon" width={40} height={40} className="h-8 w-8 object-contain" />
            </div>
            <div><span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{item.kind === 'bundle' ? `Gói hợp đồng · tiết kiệm ${discount}%` : 'Mẫu hợp đồng Standard'}</span><h2 className="mt-3 text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl">{item.title}</h2></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"><FiX size={20} /></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-600">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.category}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.audience}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">Cập nhật {item.updatedAt || '09/2026'}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500"><span className="flex items-center gap-1 text-amber-500"><FiStar className="fill-current" />{item.rating}</span><span className="flex items-center gap-1"><FiEye />{item.views} lượt xem</span><span className="flex items-center gap-1"><FiDownload />{item.downloads} lượt tải</span></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">{[
          `Định dạng ${item.fileType || (item.kind === 'bundle' ? 'ZIP' : 'DOCX')}`,
          item.kind === 'bundle' ? `${item.pages || 100}+ trang tài liệu` : `${item.pages || 10} trang nội dung`,
          item.language || 'Tiếng Việt',
        ].map((text) => <div key={text} className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm font-semibold text-gray-700"><FiCheckCircle className="text-green-600" />{text}</div>)}</div>
        <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="text-xs text-gray-400 line-through">{formatVnd(item.oldPrice)}</div><div className="text-2xl font-black text-green-700">{formatVnd(item.price)}</div></div><button type="button" disabled aria-describedby="contract-file-status" className="inline-flex min-h-12 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold opacity-60"><FiDownload /> Chưa có tệp để tải</button></div></div>
        <div id="contract-file-status" className="mt-4 flex items-center gap-2 text-xs text-gray-500"><FiShield className="text-green-600" />Tài liệu gốc chưa được cung cấp. Chưa thực hiện thanh toán hoặc tải file.</div>
    </CatalogDialog>
  );
}
