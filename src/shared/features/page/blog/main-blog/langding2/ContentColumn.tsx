import React from 'react';
import { Blogpost } from '@/components/blog/data/ContentColumndata';

// --- ICON COMPONENTS ---
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v11.494m0 0a8.487 8.487 0 01-4.243-.982m4.243.982a8.487 8.487 0 004.243-.982M15 11.25a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// --- COMPONENT CHÍNH ---

interface ContentColumnProps {
  title?: string;
  posts?: Blogpost[];
  onHoverChange?: (slotIndex: number, src?: string) => void;
  sectionRef?: React.RefObject<HTMLDivElement>;
  accentColor?: string;
  active?: boolean;
}

const ContentColumn: React.FC<ContentColumnProps> = ({
  title,
  posts,
  onHoverChange,
  accentColor,
  active,
}) => {
  const postsList = posts || [];
  const accent = accentColor ?? '#3b82f6';
  const borderColor = active ? accent : '#3b82f6';

  return (
    <div className="lg:pr-8 xl:pr-16 py-12 md:py-20">
      {/* Thông tin phụ */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-blue-100 mb-6">
        <span
          className="text-white font-bold text-xs py-1 px-3 rounded-full"
          style={{ backgroundColor: accent }}
        >
          {title ?? 'Mục'}
        </span>
        <span className="flex items-center">
          <BookOpenIcon /> {postsList.length} bài đọc
        </span>
        <span className="flex items-center">
          <ClockIcon /> 715 phút đọc
        </span>
      </div>

      {/* Tiêu đề */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-8">
        {title ?? 'Danh sách bài viết'}
      </h1>

      {/* Danh sách bài viết */}
      <div
        className="space-y-4 pl-5"
        style={{ borderLeft: `2px solid ${borderColor}` }}
      >
        {postsList.map((post, index) => (
          <a
            key={post.id}
            href="#"
            className="group block relative transition-all duration-300 flex items-center gap-3"
            onMouseEnter={() => onHoverChange?.(index % 3, post.image)}
            onFocus={() => onHoverChange?.(index % 3, post.image)}
            onMouseLeave={() => onHoverChange?.(index % 3, undefined)}
          >
            <span
              className="absolute top-1/2 -left-[26px] -translate-y-1/2 h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-150"
              style={{ backgroundColor: active ? accent : '#3b82f6' }}
            ></span>
            {/* thumbnail removed per request */}
            <p className="text-base md:text-lg text-blue-200 group-hover:text-white transition-colors">
              <span className="font-semibold text-white mr-2">
                {index + 1}.
              </span>
              {post.title}
            </p>
          </a>
        ))}
      </div>

      {/* Nút xem thêm */}
      <button className="mt-12 flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
        Xem thêm
        <span className="bg-orange-400 text-white rounded-full p-1">
          <ArrowRightIcon />
        </span>
      </button>
    </div>
  );
};

export default ContentColumn;
