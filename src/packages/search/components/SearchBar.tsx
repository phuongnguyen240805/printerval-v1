"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { SearchDropdown } from "./SearchDropdown";
import { useRecentSearch } from "../hook/useRecentSearch";
import { useSearchData } from "../hook/useSearchData";
import { MOCK_TRENDING } from "../mockData";
import { MOCK_PRODUCTS_DATABASE } from "@/lib/mockProduct";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { recentSearches, addRecentSearch } = useRecentSearch();

  // Gọi API BE thật
  const { trending: beTrending, picks: bePicks, isLoading } = useSearchData(isOpen);

  // ==========================================
  // LOGIC FALLBACK (THÔNG MINH)
  // ==========================================
  // Nếu BE có trả về data và có phần tử (> 0) -> Dùng BE. 
  // Ngược lại (BE lỗi, sập, hoặc chưa có ai click) -> Dùng Mock.
  const displayTrending = (beTrending && Array.isArray(beTrending) && beTrending.length > 0) ? beTrending : MOCK_TRENDING;
  const displayPicks = (bePicks && Array.isArray(bePicks) && bePicks.length > 0) ? bePicks : MOCK_PRODUCTS_DATABASE.slice(0, 8);

  // Xử lý click ra ngoài để đóng Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý khi gõ enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    addRecentSearch(keyword);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  // Xử lý khi click vào Gợi ý (Recent / Trending)
  const handleItemClick = (term: string) => {
    setKeyword(term);
    addRecentSearch(term);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center w-full h-12 rounded-lg border-2 border-orange-500 bg-white overflow-hidden transition-all">
          <div className="grid place-items-center h-full w-12 text-gray-500">
            <FiSearch size={20} />
          </div>
          <input
            className="peer h-full w-full bg-transparent outline-none focus:outline-none focus:ring-0 border-none text-sm text-gray-700"
            type="text"
            id="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsOpen(true)}
            autoComplete="off"
          />
        </div>
      </form>

      {isOpen && (
        <SearchDropdown
          recentSearches={recentSearches}

          // Truyền data đã qua bộ lọc Fallback
          trending={displayTrending}
          picks={displayPicks}
          isLoading={isLoading}

          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}

