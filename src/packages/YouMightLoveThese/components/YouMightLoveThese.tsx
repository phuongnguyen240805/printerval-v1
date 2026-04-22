// components/YouMightLoveThese.tsx
import { useYouMightLoveThese } from "../hooks/useYouMightLoveThese";
import ProductGrid from "./ProductGrid";

type Product = {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    category?: string;
    style?: string;
    color?: string;
    tags?: string[];
    variants?: Array<{
    calculated_price?: {
      calculated_amount?: number;
      original_amount?: number;
    };
  }>;
};

interface Props {
    currentProduct: Product;
    allProducts: Product[];
    title?: string;
    limit?: number;
}

export default function YouMightLoveThese({
    currentProduct,
    allProducts,
    title = "You Might Love These",
    limit = 8,
}: Props) {

    const { recommendedProducts } = useYouMightLoveThese({
        currentProduct,
        allProducts,
        limit,
    });

    return (
        <ProductGrid
            products={recommendedProducts}
            title={title}
        />
    );
}

