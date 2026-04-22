import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

export const RegionSelector = () => {
    const [selectedRegion, setSelectedRegion] = useState<string>("");

    // Fetch regions from Medusa
    const { data: regions, isLoading } = api.medusa.getRegions.useQuery();

    // Load selected region from localStorage on mount
    useEffect(() => {
        const storedRegion = localStorage.getItem('selected_region');
        if (storedRegion) {
            setSelectedRegion(storedRegion);
        } else if (regions && regions.length > 0) {
            // Default to first region
            const defaultRegion = regions[0].id;
            setSelectedRegion(defaultRegion);
            localStorage.setItem('selected_region', defaultRegion);
        }
    }, [regions]);

    const handleRegionChange = (regionId: string) => {
        const selectedRegionData = regions?.find((r) => r.id === regionId);
        if (!selectedRegionData) return;

        setSelectedRegion(regionId);
        localStorage.setItem('selected_region', regionId);

        // Clear cart when region changes
        localStorage.removeItem('cart_id');

        // Reload page to apply new region
        window.location.reload();
    };

    if (isLoading || !regions || regions.length === 0) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-2xl">🌍</span>
                <span>Loading...</span>
            </div>
        );
    }

    const currentRegion = regions.find(r => r.id === selectedRegion);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border-0 outline-none focus:outline-none">
                <span className="text-2xl">{currentRegion?.metadata?.flag || "🌍"}</span>
                <span className="text-sm font-medium">{currentRegion?.name || "Select Region"}</span>
                <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Region</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={selectedRegion}
                    onValueChange={handleRegionChange}
                >
                    {regions.map((region) => (
                        <DropdownMenuRadioItem key={region.id} value={region.id}>
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-2xl">{region.metadata?.flag || "🌍"}</span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{region.name}</span>
                                    <span className="text-xs text-gray-500">{region.currency_code.toUpperCase()}</span>
                                </div>
                            </div>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
