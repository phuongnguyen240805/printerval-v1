// types/menuTypes.ts
export interface MenuItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  items: MenuItem[];
}

export interface MegaMenuData {
  categories: MenuCategory[];
}

// data/megaMenuData.ts
export const megaMenuData: MegaMenuData = {
  categories: [
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Các chiến lược và công cụ marketing số',
      icon: '📱',
      items: [
        {
          id: 'dm-tools',
          title: 'Công cụ Digital Marketing',
          slug: 'cong-cu-digital-marketing',
          description: 'Các công cụ hỗ trợ marketing số hiệu quả',
        },
        {
          id: 'email-marketing',
          title: 'Email Marketing',
          slug: 'email-marketing',
          description: 'Chiến lược marketing qua email',
        },
        {
          id: 'google-ads',
          title: 'Google Ads',
          slug: 'google-ads',
          description: 'Hướng dẫn sử dụng Google Ads hiệu quả',
        },
        {
          id: 'brand-identity',
          title: 'Nhận diện thương hiệu',
          slug: 'nhan-dien-thuong-hieu',
          description: 'Xây dựng và phát triển thương hiệu',
        },
        {
          id: 'social-media',
          title: 'Social Media',
          slug: 'social-media',
          description: 'Marketing trên các nền tảng mạng xã hội',
        },
        {
          id: 'tiktok-ads',
          title: 'TikTok Ads',
          slug: 'tiktok-ads',
          description: 'Quảng cáo trên TikTok hiệu quả',
        },
        {
          id: 'content-marketing',
          title: 'Content Marketing',
          slug: 'content-marketing',
          description: 'Chiến lược marketing bằng nội dung',
        },
        {
          id: 'facebook-ads',
          title: 'Facebook Ads',
          slug: 'facebook-ads',
          description: 'Quảng cáo Facebook chuyên nghiệp',
        },
        {
          id: 'marketing-basics',
          title: 'Marketing cơ bản',
          slug: 'marketing-co-ban',
          description: 'Kiến thức marketing cơ bản cho người mới',
        },
        {
          id: 'marketing-analytics',
          title: 'Phân tích chỉ số marketing',
          slug: 'phan-tich-chi-so-marketing',
          description: 'Đo lường và phân tích hiệu quả marketing',
        },
        {
          id: 'conversion-rate',
          title: 'Tỉ lệ chuyển đổi website',
          slug: 'ti-le-chuyen-doi-website',
          description: 'Tối ưu tỉ lệ chuyển đổi cho website',
        },
        {
          id: 'customer-acquisition',
          title: 'Tìm Kiếm Khách Hàng',
          slug: 'tim-kiem-khach-hang',
          description: 'Phương pháp tìm kiếm và thu hút khách hàng',
        },
      ],
    },
    {
      id: 'hosting',
      title: 'Hosting',
      slug: 'hosting',
      description: 'Kiến thức về hosting và máy chủ',
      icon: '🖥️',
      items: [
        {
          id: 'hosting-security',
          title: 'Bảo Mật Hosting',
          slug: 'bao-mat-hosting',
          description: 'Bảo mật máy chủ và hosting website',
        },
        {
          id: 'hosting-technology',
          title: 'Các công nghệ Hosting',
          slug: 'cac-cong-nghe-hosting',
          description: 'Tìm hiểu các công nghệ hosting hiện đại',
        },
        {
          id: 'hosting-knowledge',
          title: 'Kiến thức Hosting',
          slug: 'kien-thuc-hosting',
          description: 'Kiến thức cơ bản và nâng cao về hosting',
        },
        {
          id: 'hosting-optimization',
          title: 'Kỹ Thuật Tối Ưu Hosting',
          slug: 'ky-thuat-toi-uu-hosting',
          description: 'Tối ưu hóa hiệu suất hosting',
        },
      ],
    },
    {
      id: 'website-knowledge',
      title: 'Kiến Thức Website',
      slug: 'kien-thuc-website',
      description: 'Kiến thức toàn diện về website',
      icon: '🌐',
      items: [
        {
          id: 'web-security',
          title: 'Bảo Mật Web',
          slug: 'bao-mat-web',
          description: 'Bảo mật website toàn diện',
        },
        {
          id: 'website-maintenance',
          title: 'Chăm sóc & duy trì website',
          slug: 'cham-soc-duy-tri-website',
          description: 'Bảo trì và cập nhật website định kỳ',
        },
        {
          id: 'website-creation',
          title: 'Khởi tạo website',
          slug: 'khoi-tao-website',
          description: 'Hướng dẫn tạo website từ A-Z',
        },
        {
          id: 'post-website-launch',
          title: 'Làm gì sau khi có website?',
          slug: 'lam-gi-sau-khi-co-website',
          description: 'Các bước tiếp theo sau khi có website',
        },
        {
          id: 'ecommerce-website',
          title: 'Nâng cấp website kinh doanh online',
          slug: 'nang-cap-website-kinh-doanh-online',
          description: 'Phát triển website thương mại điện tử',
        },
        {
          id: 'website-conversion',
          title: 'Tăng tỷ lệ chuyển đổi cho website',
          slug: 'tang-ty-le-chuyen-doi-cho-website',
          description: 'Tối ưu CRO cho website',
        },
        {
          id: 'website-faq',
          title: 'Các câu hỏi thường gặp về website',
          slug: 'cac-cau-hoi-thuong-gap-ve-website',
          description: 'FAQ về website và giải đáp thắc mắc',
        },
        {
          id: 'website-ownership',
          title: 'Điều cần làm khi sở hữu website',
          slug: 'dieu-can-lam-khi-so-huu-website',
          description: 'Trách nhiệm và quyền lợi khi có website',
        },
        {
          id: 'website-audit',
          title: 'Kiểm tra website',
          slug: 'kiem-tra-website',
          description: 'Audit và đánh giá chất lượng website',
        },
        {
          id: 'website-notes',
          title: 'Lưu ý quan trọng về website',
          slug: 'luu-y-quan-trong-ve-website',
          description: 'Những điều cần lưu ý khi vận hành website',
        },
        {
          id: 'website-development',
          title: 'Phát triển website toàn diện',
          slug: 'phat-trien-website-toan-dien',
          description: 'Chiến lược phát triển website dài hạn',
        },
        {
          id: 'website-content',
          title: 'Xây Dựng Nội Dung Cho Website',
          slug: 'xay-dung-noi-dung-cho-website',
          description: 'Tạo nội dung chất lượng cho website',
        },
      ],
    },
    {
      id: 'online-business',
      title: 'Kinh Doanh Online',
      slug: 'kinh-doanh-online',
      description: 'Kiến thức kinh doanh trực tuyến',
      icon: '💼',
      items: [
        {
          id: 'business-metrics',
          title: 'Các Chỉ Số Cần Biết Khi Kinh Doanh Online',
          slug: 'cac-chi-so-can-biet-khi-kinh-doanh-online',
          description: 'KPIs quan trọng trong kinh doanh online',
        },
        {
          id: 'business-tools',
          title: 'Phần mềm & Công cụ hỗ trợ Kinh Doanh Online',
          slug: 'phan-mem-cong-cu-ho-tro-kinh-doanh-online',
          description: 'Công cụ hỗ trợ kinh doanh online hiệu quả',
        },
        {
          id: 'sales-strategy',
          title: 'Tăng doanh số bán hàng với chiến lược Marketing',
          slug: 'tang-doanh-so-ban-hang-voi-chien-luoc-marketing',
          description: 'Chiến lược marketing để tăng doanh số',
        },
        {
          id: 'online-business-tips',
          title: 'Tips kinh doanh online',
          slug: 'tips-kinh-doanh-online',
          description: 'Mẹo và kinh nghiệm kinh doanh online',
        },
        {
          id: 'business-from-zero',
          title: 'Kiến Thức Kinh Doanh Online Từ Con Số 0',
          slug: 'kien-thuc-kinh-doanh-online-tu-con-so-0',
          description: 'Bắt đầu kinh doanh online từ đầu',
        },
        {
          id: 'business-management',
          title: 'Quản Lý Kinh Doanh Online',
          slug: 'quan-ly-kinh-doanh-online',
          description: 'Quản lý và vận hành kinh doanh online',
        },
        {
          id: 'business-foundation',
          title: 'Tạo lập nền tảng kinh doanh online',
          slug: 'tao-lap-nen-tang-kinh-doanh-online',
          description: 'Xây dựng nền tảng kinh doanh vững chắc',
        },
        {
          id: 'business-ideas',
          title: 'Ý Tưởng Kinh Doanh',
          slug: 'y-tuong-kinh-doanh',
          description: 'Ý tưởng và mô hình kinh doanh online',
        },
      ],
    },
    {
      id: 'software-apps',
      title: 'Phần mềm - Web app - Ứng dụng điện thoại',
      slug: 'phan-mem-web-app-ung-dung-dien-thoai',
      description: 'Phát triển phần mềm và ứng dụng',
      icon: '📱',
      items: [
        {
          id: 'software-design',
          title: 'Kinh nghiệm thiết kế và lập trình phần mềm',
          slug: 'kinh-nghiem-thiet-ke-va-lap-trinh-phan-mem',
          description: 'Kinh nghiệm trong phát triển phần mềm',
        },
        {
          id: 'business-software',
          title: 'Phần mềm hỗ trợ kinh doanh',
          slug: 'phan-mem-ho-tro-kinh-doanh',
          description: 'Phần mềm quản lý và hỗ trợ kinh doanh',
        },
      ],
    },
    {
      id: 'seo',
      title: 'SEO',
      slug: 'seo',
      description: 'Tối ưu hóa công cụ tìm kiếm',
      icon: '🔍',
      items: [
        {
          id: 'seo-tools',
          title: 'Công cụ SEO',
          slug: 'cong-cu-seo',
          description: 'Các công cụ hỗ trợ SEO hiệu quả',
        },
        {
          id: 'seo-knowledge',
          title: 'Kiến thức SEO',
          slug: 'kien-thuc-seo',
          description: 'Kiến thức SEO từ cơ bản đến nâng cao',
        },
        {
          id: 'seo-basics',
          title: 'SEO cơ bản',
          slug: 'seo-co-ban',
          description: 'Kiến thức SEO cơ bản cho người mới',
        },
        {
          id: 'seo-onpage',
          title: 'SEO Onpage',
          slug: 'seo-onpage',
          description: 'Tối ưu SEO onpage cho website',
        },
        {
          id: 'seo-algorithm',
          title: 'Thuật Toán SEO',
          slug: 'thuat-toan-seo',
          description: 'Hiểu về các thuật toán SEO của Google',
        },
        {
          id: 'seo-guide',
          title: 'Hướng dẫn cách làm SEO',
          slug: 'huong-dan-cach-lam-seo',
          description: 'Hướng dẫn thực hành SEO từ A-Z',
        },
        {
          id: 'keyword-research',
          title: 'Nghiên cứu từ khóa',
          slug: 'nghien-cuu-tu-khoa',
          description: 'Phương pháp nghiên cứu từ khóa hiệu quả',
        },
        {
          id: 'seo-offpage',
          title: 'SEO OffPage',
          slug: 'seo-offpage',
          description: 'Chiến lược SEO offpage và link building',
        },
        {
          id: 'seo-technical',
          title: 'SEO Technical',
          slug: 'seo-technical',
          description: 'SEO kỹ thuật và tối ưu hiệu suất',
        },
      ],
    },
    {
      id: 'domain',
      title: 'Tên Miền',
      slug: 'ten-mien',
      description: 'Quản lý và sử dụng tên miền',
      icon: '🌍',
      items: [
        {
          id: 'domain-guide',
          title: 'Hướng Dẫn Cách Thao Tác Với Tên Miền',
          slug: 'huong-dan-cach-thao-tac-voi-ten-mien',
          description: 'Hướng dẫn quản lý và cấu hình tên miền',
        },
      ],
    },
    {
      id: 'video-marketing',
      title: 'Video Marketing',
      slug: 'video-marketing',
      description: 'Marketing bằng video',
      icon: '🎬',
      items: [
        {
          id: 'corporate-video',
          title: 'Phim doanh nghiệp',
          slug: 'phim-doanh-nghiep',
          description: 'Sản xuất phim giới thiệu doanh nghiệp',
        },
        {
          id: 'tvc',
          title: 'TVC',
          slug: 'tvc',
          description: 'Quảng cáo truyền hình thương mại',
        },
      ],
    },
  ],
};

// utils/menuHelpers.ts
export const findCategoryBySlug = (slug: string): MenuCategory | undefined => {
  return megaMenuData.categories.find((category) => category.slug === slug);
};

export const findItemBySlug = (
  categorySlug: string,
  itemSlug: string
): MenuItem | undefined => {
  const category = findCategoryBySlug(categorySlug);
  if (!category) return undefined;

  return category.items.find((item) => item.slug === itemSlug);
};

export const getCategoryItems = (categoryId: string): MenuItem[] => {
  const category = megaMenuData.categories.find((cat) => cat.id === categoryId);
  return category ? category.items : [];
};

export const searchItems = (query: string): MenuItem[] => {
  const results: MenuItem[] = [];
  const searchTerm = query.toLowerCase();

  megaMenuData.categories.forEach((category) => {
    category.items.forEach((item) => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        category.title.toLowerCase().includes(searchTerm)
      ) {
        results.push(item);
      }
    });
  });

  return results;
};

// constants/menuConstants.ts
export const MENU_CONSTANTS = {
  MAX_ITEMS_PER_CATEGORY: 15,
  ANIMATION_DURATION: 300,
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
} as const;
