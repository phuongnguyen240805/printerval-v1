"use client";

import { api } from "@/utils/api";

export function useSearchData(isEnabled: boolean) {
  const { data: trending, isLoading: isLoadingTrending } = api.search.getTrending.useQuery(undefined, {
    enabled: isEnabled,
    staleTime: 1000 * 60 * 30, // 30 phút cache
  });

  const { data: picks, isLoading: isLoadingPicks } = api.search.getSpecialPicks.useQuery(undefined, {
    enabled: isEnabled,
    staleTime: 1000 * 60 * 30, // 30 phút cache
  });

  return {
    trending: trending || [],
    picks: picks || [],
    isLoading: isLoadingTrending || isLoadingPicks,
  };
}

