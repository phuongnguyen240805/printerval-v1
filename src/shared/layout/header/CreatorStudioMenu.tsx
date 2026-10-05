"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

const studioItems = [
  {
    title: 'Create Your Own',
    description: 'Build products your way',
    href: '/create-your-own',
    image: 'https://printerval.com/assets/images/studio-1.png?v=20260716094544',
    background: '#EAF8FC',
  },
  {
    title: 'AI Design Gen',
    description: 'Generate unique designs',
    href: '/create-your-own?tool=ai-design',
    image: 'https://printerval.com/assets/images/studio-2.png?v=20260716094544',
    background: '#FFF0E4',
  },
  {
    title: 'Virtual Try-On',
    description: 'See it before buying',
    href: '/create-your-own?tool=virtual-try-on',
    image: 'https://printerval.com/assets/images/studio-3.png?v=20260716094544',
    background: '#E9ECFF',
  },
];

export function CreatorStudioMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:block">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open Creator Studio"
            className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full outline-none transition-all duration-200 hover:bg-[#fff4e8] focus-visible:ring-2 focus-visible:ring-[#ff6600]/30 ${
              open ? 'bg-[#fff4e8]' : 'bg-transparent'
            }`}
          >
            <Sparkles
              size={27}
              strokeWidth={2.2}
              className="text-[#ff6600] transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="relative z-[120] w-[min(654px,calc(100vw-24px))] overflow-visible rounded-[28px] border-0 bg-white p-0 shadow-[0_18px_46px_rgba(0,0,0,0.20)]"
        >
          {/* Small pointer aligned under the sparkle trigger */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[7px] right-[57px] h-4 w-4 rotate-45 bg-white"
          />

          <div className="relative p-7 pb-8">
            <button
              type="button"
              aria-label="Close Creator Studio"
              onClick={() => setOpen(false)}
              className="absolute right-7 top-8 flex h-8 w-8 items-center justify-center rounded-full text-[#8b8b8b] transition-colors hover:bg-black/[0.04] hover:text-[#555]"
            >
              <X size={28} strokeWidth={1.7} />
            </button>

            <div className="mb-7 flex items-center gap-4 pr-12">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#ff6600] text-white">
                <Sparkles size={27} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <h3 className="m-0 font-Inter text-[21px] font-bold leading-[1.2] text-[#111]">
                  Creator Studio
                </h3>
                <p className="mt-1 font-Inter text-[17px] font-normal leading-[1.35] text-[#777]">
                  Your all-in-one design workspace
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[15px]">
              {studioItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group block min-w-0 overflow-hidden rounded-[12px] no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]/30"
                  style={{ backgroundColor: item.background }}
                >
                  <div className="flex h-[154px] items-center justify-center overflow-hidden px-3 pt-4">
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  </div>

                  <div className="px-4 pb-5 pt-1 text-center">
                    <div className="font-Inter text-[19px] font-bold leading-[1.25] text-[#111]">
                      {item.title}
                    </div>
                    <div className="mt-2 min-h-[46px] font-Inter text-[17px] font-normal leading-[1.35] text-[#8a8a8a]">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
