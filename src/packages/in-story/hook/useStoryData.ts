"use client";

export interface Product {
  id: string;
  handle: string; // Tên URL thân thiện
  name: string;
  price: number;
  originalPrice?: number;
  images: string[]; // Mảng hình ảnh sản phẩm
  thumbnail_logo: string; // Logo thương hiệu nhỏ
}

export interface Story {
  id: string;
  thumbnail_poster: string; // Hình ảnh tĩnh đại diện cho video (poster)
  videoUrl: string; // Link video dạng mp4
  product: Product;
}

// Dữ liệu mẫu (Sử dụng hình ảnh từ ảnh bạn gửi và link video thực tế)
// Dữ liệu mẫu với ẢNH VÀ VIDEO THẬT 100% (Từ Unsplash và Pexels)
const MOCK_STORIES: Story[] = [
  {
    id: "s1",
    thumbnail_poster: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", // Ảnh nam mặc áo thun
    videoUrl: "https://videos.pexels.com/video-files/5309381/5309381-uhd_1440_2560_25fps.mp4", // Video mẫu mặc áo
    product: {
      id: "p1",
      handle: "anytime-fitness-tshirt",
      name: "Anytime Fitness T-Shirt",
      price: 12.95,
      originalPrice: 19.99,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      ], 
      thumbnail_logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&q=80"
    },
  },
  {
    id: "s2",
    thumbnail_poster: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", // Ảnh nam mặc hoodie
    videoUrl: "https://videos.pexels.com/video-files/4453258/4453258-uhd_1440_2560_25fps.mp4", // Video mặc hoodie
    product: {
      id: "p2",
      handle: "bonecrusher-skull-hoodie",
      name: "Bonecrusher Skull Hoodie",
      price: 14.95,
      originalPrice: 22.50,
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        "https://images.unsplash.com/photo-1556821838-89bd246ac681?w=800&q=80"
      ],
      thumbnail_logo: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&q=80" 
    },
  },
  {
    id: "s3",
    thumbnail_poster: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", // Ảnh nữ mặc áo thun hè
    videoUrl: "https://videos.pexels.com/video-files/7688533/7688533-uhd_1440_2560_30fps.mp4", // Video thời trang nữ
    product: {
      id: "p3",
      handle: "takayasu-akira-tanktop",
      name: "Takayasu Akira Tanktop",
      price: 14.95,
      images: [
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80"
      ],
      thumbnail_logo: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=150&q=80"
    },
  },
  {
    id: "s4",
    thumbnail_poster: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", // Ảnh streetwear
    videoUrl: "https://videos.pexels.com/video-files/6561284/6561284-uhd_1440_2560_24fps.mp4", // Video streetwear
    product: {
      id: "p4",
      handle: "annie-musical-hoodie",
      name: "Annie Musical Hoodie",
      price: 27.95,
      images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
      ],
      thumbnail_logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&q=80"
    },
  },
  {
    id: "s5",
    thumbnail_poster: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", // Ảnh streetwear
    videoUrl: "https://videos.pexels.com/video-files/5896379/5896379-hd_1080_1920_24fps.mp4", // Video lifestyle
    product: {
      id: "p5",
      handle: "mike-gift-tshirt",
      name: "MIKE Gift T-Shirt",
      price: 14.95,
      images: [
        "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80",
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80"
      ],
      thumbnail_logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&q=80"
    },
  },
];

export function useStoryData() {
  return {
    stories: MOCK_STORIES,
    isLoading: false,
  };
}

