import { PrimaryLayout } from "@/layouts";
import SaleCodeComponent from "@/shared/components/SaleCode";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui/breadcrumb";
import { api } from "@/utils/api";
import { ReactElement } from "react";

const ECard = () => {
    const { data: collection } = api.medusa.getCollections.useQuery()
    const { data: product } = api.medusa.getProducts.useQuery({ regionID: "reg_01KEBTGVSJEJNJ4AP2GSAXGXA8", collection_id: collection?.[0].id })
    const { data: allProduct } = api.medusa.getDigitalProduct.useQuery()
    const { data: campaign } = api.medusa.listCampaigns.useQuery()
    console.log(allProduct)
    return (
        <div>
            <SaleCodeComponent campaign={campaign?.[0]} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
ECard.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Free E-Card', canonical: '/free-ecart' }}>
            {page}
        </PrimaryLayout>
    );
};
export default ECard