// src/data/landingData.ts

export interface Blogpost {
  id: number;
  title: string;
  image?: string;
}

export interface LandingData {
  [key: string]: Blogpost[];
}

export const landingData: LandingData = {
  landing1: [
    {
      id: 1,
      title:
        'Vì sao website quan trọng? Lý do doanh nghiệp nên thiết kế website?',
      image: 'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549843/1-4-95ab413062bd5052f452b8b50bc001082_pyiihf.jpg',
    },
    {
      id: 2,
      title: 'Hướng dẫn tự học lập trình website từ A-Z cho người mới bắt đầu',
      image: 'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549844/1-4-a523d61bcde36f793c412457319a9a652_qkvnhf.jpg',
    },
    {
      id: 3,
      title: 'Xu Hướng Màu Sắc Trong Thiết Kế Website Mới Nhất 2025',
      image: 'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549843/1-4-0b4972d89ec0ee9d5581a977a5971f952_ihw0rm.jpg',
    },
    {
      id: 4,
      title:
        'UI UX Là Gì? Tại Sao Thiết Kế UI UX Lại Cực Kỳ Quan Trọng Với Website',
      image: 'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549839/1-3-6589372fcbee6226232ab57226fc13532_ojtzxn.jpg',
    },
    {
      id: 5,
      title: 'Thiết Kế Website Responsive Chuyên Nghiệp, Chuẩn SEO – Trọn Gói',
      image: 'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549847/1-5-72abfffea10fcd7e98a9399370ac902e2_bgp2h1.jpg',
    },
    {
      id: 6,
      title:
        'Vì sao website quan trọng? Lý do doanh nghiệp nên thiết kế website?',
      image:
        'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549838/1-2be68b8604a7db29265697ed8bacf96d2_yqf2da.jpg',
    },
    {
      id: 7,
      title: 'Vì sao website quan trọng',
      image:
        'https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1774549838/1-2-b2faedb8ef9e84b47d04b7a2d99775202_ftw0mz.jpg',
    },
  ],

  landing2: [
    {
      id: 1,
      title: 'Cách tối ưu tốc độ tải trang cho website doanh nghiệp',
      image: 'https://placehold.co/600x600/06B6D4/FFFFFF?text=Speed',
    },
    {
      id: 2,
      title: 'Top 5 sai lầm khi thiết kế giao diện người dùng (UI)',
      image: 'https://placehold.co/600x600/8B5CF6/FFFFFF?text=UI+Mistakes',
    },
    {
      id: 3,
      title: 'SEO là gì? 7 Bước tối ưu SEO cơ bản bạn nên biết',
      image: 'https://placehold.co/600x600/FB923C/FFFFFF?text=SEO',
    },
    {
      id: 4,
      title: 'Làm sao chọn màu thương hiệu phù hợp cho website của bạn?',
      image: 'https://placehold.co/600x600/06B6D4/FFFFFF?text=Color',
    },
  ],

  landing3: [
    {
      id: 1,
      title: 'Thiết kế trải nghiệm người dùng hiện đại trong năm 2025',
      image: 'https://placehold.co/600x600/0EA5A4/FFFFFF?text=UX+2025',
    },
    {
      id: 2,
      title: 'Những yếu tố quan trọng khi chọn hosting cho website',
      image: 'https://placehold.co/600x600/14B8A6/FFFFFF?text=Hosting',
    },
    {
      id: 3,
      title: 'Tầm quan trọng của bảo mật SSL trong website hiện nay',
      image: 'https://placehold.co/600x600/0EA5A4/FFFFFF?text=SSL',
    },
    {
      id: 4,
      title: 'Cách cải thiện UX khi người dùng truy cập trên di động',
      image: 'https://placehold.co/600x600/7C3AED/FFFFFF?text=Mobile+UX',
    },
  ],
};
