import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

export function useCatalog() {
  const [regionID, setRegionID] = useState<string>();
  const [ready, setReady] = useState(false);
  const regions = api.medusa.getRegions.useQuery(undefined, { staleTime: 300000, retry: false, refetchOnWindowFocus: false });
  useEffect(() => {
    if (!regions.isSuccess && !regions.isError) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem('selected_region'); } catch { /* Storage may be unavailable. */ }
    const selected = regions.data?.find(region => region.id === saved) || regions.data?.[0];
    setRegionID(selected?.id);
    setReady(true);
  }, [regions.data, regions.isSuccess, regions.isError]);
  const catalog = api.medusa.getCollectionCatalog.useQuery({ regionID }, {
    enabled: ready, staleTime: 300000, retry: false, refetchOnWindowFocus: false,
  });
  return { ...catalog, isLoading: !ready || catalog.isLoading };
}
