import { PrimaryLayout } from "@/layouts";
import DesignComponent from "@/shared/features/page/DesignExplore/design";
import HotSearchComponent from "@/shared/features/page/DesignExplore/hotsearch";
import { ReactElement } from "react";
const hotsearch = ['charlie kirk freedom', 'justic for charlie kirk', 'Harris Walz 2024', 'rip Charlie Kirk', 'Harris Walz 2024 Vote', 'Harris Walz 2024 Vote Kamala', 'mickey and minnie halloween', 'charlie kirk suspect']
const images = [
    "/assets/1.jpg",
    "/assets/animal.webp",
    "/assets/1.jpg",
    "/assets/design-color,transparent,print-2026-01-20_ae7050a9-eee7-454f-9d6d-0c6335cf4bb6,transparent.webp",
    "/assets/design-color,transparent,print-2026-01-21_2871002c-1bba-4eca-903c-7eeb54c23b09,transparent.webp",
    "/assets/design-color,transparent,print-2026-01-22_cc808cb3-2680-4666-9797-98c554689030,transparent.webp",
    "/assets/design-color,transparent,print-2026-01-22_cc808cb3-2680-4666-9797-98c554689030,transparent.webp",

    "/assets/design-color,transparent,print-2026-01-22_cc808cb3-2680-4666-9797-98c554689030,transparent.webp",

    "/assets/design-color,transparent,print-2026-01-22_cc808cb3-2680-4666-9797-98c554689030,transparent.webp",

    "/assets/design-color,transparent,print-2026-01-21_7214f6fb-ec1e-47c8-9f1c-55938537c908,transparent.webp",

]
const Designs = () => {
    return (
        <div className="max-w-7xl mx-auto px-2">
            <HotSearchComponent hotsearch={hotsearch} />
            <DesignComponent image={images} />
        </div>
    )
}
Designs.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Designs', canonical: '/designs' }}>
            {page}
        </PrimaryLayout>
    );
};
export default Designs