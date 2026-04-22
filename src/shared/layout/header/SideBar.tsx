"use client";

import { FiChevronRight, FiX, FiPackage, FiTruck, FiStar, FiEdit3, FiLayout, FiBookOpen, FiCalendar } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const SIDEBAR_MENU = [
  { name: 'Easter Day', href: '/footer/sell-your-product', icon: <FiCalendar />, color: "text-pink-600" },
  { name: 'Create Your Own', href: '/create-your-own', icon: <FiEdit3 />, color: "text-purple-600" },
  { name: 'Order Tracking', href: '/order-tracking', icon: <FiTruck />, color: "text-blue-600" },
  { name: "Happy New Year", href: '/happy-new-year', icon: <FiStar />, color: "text-red-600" },
  { name: 'Products', href: '/product', icon: <FiPackage />, color: "text-emerald-600" },
  { name: 'Explore Designs', href: '/designs', icon: <FiLayout />, color: "text-indigo-600" },
  { name: "Free E-Cart", href: '/free-ecart', icon: <FiBookOpen />, color: "text-orange-600" },
  { name: 'Blog', href: '/blog', icon: <FiBookOpen />, color: "text-amber-600" },
];

const FOOTER_LINKS = [
  { name: 'Delivery', href: '/delivery' },
  { name: 'Returns', href: '/returns' },
  { name: 'Help Center', href: '/help' },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] xl:hidden">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="absolute top-0 left-0 h-full w-[90%] max-w-[320px] bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="w-full bg-[#f6f7e6] border-b border-gray-100 h-16 flex items-center justify-between px-4 flex-shrink-0">
          <Image
            priority
            src="/logo.png"
            alt="logo"
            width={120}
            height={32}
            className="w-auto h-7 object-contain"
          />
          <button
            onClick={onClose}
            className="p-1.5 bg-white rounded-full text-black hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="flex flex-col gap-1">
            {SIDEBAR_MENU.map((item, idx) => (
              <li key={idx} className="border-b border-gray-50 last:border-0">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-xl ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className={`font-Inter font-semibold text-[15px] ${item.color}`}>
                      {item.name}
                    </span>
                  </div>
                  <FiChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-black transition-colors"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4 px-3">
            {FOOTER_LINKS.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={onClose}
                className="text-[14px] font-Inter font-semibold text-gray-500 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Slogan */}
        <div className="p-6 bg-gray-50 flex-shrink-0">
          <p className="text-[11px] text-center text-gray-400 font-Inter font-semibold uppercase tracking-widest">
            Minimalist & Premium
          </p>
        </div>
      </div>
    </div>
  );
}