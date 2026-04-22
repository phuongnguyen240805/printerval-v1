"use client";
import { useState, useEffect } from 'react';

const RECENT_SEARCH_KEY = 'storefront_recent_searches';

export function useRecentSearch(maxItems = 3) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCH_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Lỗi parse lịch sử tìm kiếm", e);
      }
    }
  }, []);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((t) => t !== term)].slice(0, maxItems);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentSearches, addRecentSearch };
}

