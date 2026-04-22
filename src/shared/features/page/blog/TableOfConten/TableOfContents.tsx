'use client';

import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse HTML content để lấy các heading
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      return {
        id: `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setTocItems(items);

    // Cập nhật content với các ID đã được gán
    const contentElement = document.querySelector('.blog-content');
    if (contentElement) {
      contentElement.innerHTML = doc.body.innerHTML;

      // Sau khi innerHTML xong → gán lại ID cho các heading trong DOM thật
      const realHeadings = contentElement.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      Array.from(realHeadings).forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    }
  }, [content]);

  useEffect(() => {
    // Theo dõi scroll để highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // Khi activeId thay đổi, scroll TOC container để phần tử active luôn visible
  useEffect(() => {
    if (!activeId) return;
    const tocButton = document.getElementById(`toc-${activeId}`);
    const container = document.querySelector('.toc-nav');
    if (tocButton && container) {
      // use scrollIntoView with nearest to avoid jumping too much
      (tocButton as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
      // If more control needed, we can adjust container.scrollTop here
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Luôn hiển thị component, không return null
  return (
    <div className="sticky top-4">
      {/* Header Nội dung */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="text-black px-4 py-4">
          <h3 className="font-semibold text-lg flex items-center">Nội dung</h3>
        </div>

        <nav className="p-8 space-y-1 max-h-[400px] overflow-y-auto toc-nav">
          {tocItems.length > 0 ? (
            // Hiển thị các heading nếu có
            tocItems.map((item) => (
              <button
                id={`toc-${item.id}`}
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left text-sm py-2 px-3 rounded transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 border-l-2 ${
                  activeId === item.id
                    ? 'text-purple-600 font-medium bg-purple-50 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600 border-transparent hover:border-purple-300'
                } pl-0`}
                style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
              >
                {item.text}
              </button>
            ))
          ) : (
            // Hiển thị thông báo khi không có heading
            <div className="text-gray-500 text-sm py-4 text-center italic">
              Không có mục lục
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
