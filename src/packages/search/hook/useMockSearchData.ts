import { useState, useEffect } from "react";

export interface MockSearchResult {
  id: string;
  name: string;
  description: string;
  image: string;
}

const MOCK_SEARCH_RESULTS: MockSearchResult[] = [
  {
    id: "1",
    name: "Áo thun Lacoste",
    description: "Áo thun cao cấp, chất liệu cotton thoáng mát.",
    image: "/assets/products/lacoste.jpg"
  },
  {
    id: "2",
    name: "Áo hoodie Basic",
    description: "Hoodie unisex, nhiều màu sắc trẻ trung.",
    image: "/assets/products/hoodie.jpg"
  },
  {
    id: "3",
    name: "Quần jeans Slimfit",
    description: "Quần jeans co giãn, form ôm vừa vặn.",
    image: "/assets/products/jeans.jpg"
  }
];

export function useMockSearchData() {
  const [results, setResults] = useState<MockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập delay gọi API
    const timeout = setTimeout(() => {
      setResults(MOCK_SEARCH_RESULTS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return { results, isLoading };
}


