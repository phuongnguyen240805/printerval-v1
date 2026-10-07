export interface DetailOffer {
  id: string;
  meta: string;
  title: string;
  seller: string;
  sellerAvatar?: string;
  rating: number;
  positive: string;
  reviews: string;
  price: number;
  delivery: string;
  warranty: string;
}

export interface FilterItem {
  label: string;
  count?: number;
}

export interface AccountDetailData {
  slug: string;
  name: string;
  title: string;
  logo: string;
  resultCount: number;
  warning: string;
  filters: Array<{ title: string; items: FilterItem[] }>;
  offers: DetailOffer[];
  introTitle: string;
  intro: string[];
  sections: Array<{ title: string; paragraphs?: string[]; bullets?: Array<{ title?: string; text: string }> }>;
}

const commonFilters = (plans: string[]): AccountDetailData['filters'] => [
  { title: 'Khoảng giá (VND)', items: [{ label: 'Từ 0₫' }, { label: 'Đến 10.000.000₫' }] },
  { title: 'Giao hàng cam kết', items: [{ label: 'Ngay lập tức', count: 4 }, { label: '20 phút', count: 36 }, { label: '1 giờ', count: 5 }, { label: '12 giờ', count: 1 }, { label: '1 ngày', count: 4 }] },
  { title: 'Tình trạng có sẵn', items: [{ label: 'Đang trực tuyến', count: 14 }, { label: 'Giờ phục vụ', count: 33 }] },
  { title: 'Thời lượng', items: [{ label: '1 tháng', count: 41 }, { label: '1 năm', count: 9 }] },
  { title: 'Phương thức chia sẻ', items: [{ label: 'Toàn quyền truy cập', count: 50 }] },
  { title: 'Gói', items: plans.map((label, index) => ({ label, count: [35, 10, 3, 1, 1][index] ?? 4 })) },
];

const cursorAvatars = [
  '/assets/ai-accounts/detail/sellers/2554259.png',
  '/assets/ai-accounts/detail/sellers/2597822.jpg',
  '/assets/ai-accounts/detail/sellers/2359261.png',
  '/assets/ai-accounts/detail/sellers/2354337.png',
  '/assets/ai-accounts/detail/sellers/2548723.jpg',
  '/assets/ai-accounts/detail/sellers/2918258.png',
  '/assets/ai-accounts/detail/sellers/2266673.jpg',
  '/assets/ai-accounts/detail/sellers/3186024.jpg',
];

const cursorOffers: DetailOffer[] = [
  { id: 'cursor-ultra-official', meta: '1 tháng-Toàn quyền truy cập-Ultra', title: 'Cursor Official Ultra Plan', seller: 'XiaTian Luo', sellerAvatar: cursorAvatars[0], rating: 5, positive: '100%', reviews: '(12)', price: 4650559, delivery: '12 giờ', warranty: '30 ngày' },
  { id: 'cursor-ultra-private', meta: '1 tháng-Toàn quyền truy cập-Ultra', title: 'Cursor Ultra 1 tháng | 0% Tự động và 0% API đã dùng | Truy cập qua email', seller: 'BNBGAMING', sellerAvatar: cursorAvatars[1], rating: 4.9, positive: '96.8%', reviews: '(178)', price: 5170174, delivery: 'Ngay lập tức', warranty: '20 ngày' },
  { id: 'cursor-pro-nexora', meta: '1 tháng-Toàn quyền truy cập-Pro', title: 'Cursor Tài khoản - 1 Tháng - Truy cập đầy đủ - Pro', seller: 'Nexora Digital Hub', sellerAvatar: cursorAvatars[2], rating: 5, positive: '100%', reviews: '(43)', price: 779163, delivery: '20 phút', warranty: '10 ngày' },
  { id: 'cursor-pro-sk', meta: '1 tháng-Toàn quyền truy cập-Pro', title: 'Cursor Tài khoản-1 Tháng-Truy cập đầy đủ-Pro', seller: 'SK Zone', sellerAvatar: cursorAvatars[3], rating: 5, positive: '100%', reviews: '(152)', price: 883087, delivery: '20 phút', warranty: '10 ngày' },
  { id: 'cursor-year', meta: 'Toàn quyền truy cập-Pro-1 năm', title: '1 NĂM 🔏 Nhận tài khoản thiết lập riêng cá nhân ✅ | Giao hàng ngay lập tức | (Không phải lời mời)', seller: 'Gemini Ai Pro', sellerAvatar: cursorAvatars[4], rating: 5, positive: '99.4%', reviews: '(2,122)', price: 5170174, delivery: 'Ngay lập tức', warranty: '90 ngày' },
  { id: 'cursor-year-email', meta: 'Toàn quyền truy cập-Pro-1 năm', title: 'Cursor Pro 1 Năm qua Email của bạn', seller: 'Sagar Aggarwal', sellerAvatar: cursorAvatars[5], rating: 4.5, positive: '87.6%', reviews: '(33)', price: 4676539, delivery: '20 phút', warranty: '90 ngày' },
  { id: 'cursor-private', meta: '1 tháng-Toàn quyền truy cập-Pro', title: 'Cursor AI Pro 1 Tháng Tài Khoản Riêng (Toàn cầu)', seller: 'Tool Nest', sellerAvatar: cursorAvatars[6], rating: 5, positive: '99.8%', reviews: '(347)', price: 779163, delivery: '20 phút', warranty: '10 ngày' },
  { id: 'cursor-pro-plus', meta: '1 tháng-Toàn quyền truy cập-Pro+', title: 'Cursor-Tài khoản Cursor-1 Tháng-Truy cập đầy đủ-Pro+', seller: 'Elvira Nitro', sellerAvatar: cursorAvatars[7], rating: 4.9, positive: '98%', reviews: '(1,977)', price: 1558846, delivery: '1 giờ', warranty: '10 ngày' },
];

const cursor: AccountDetailData = {
  slug: 'cursor',
  name: 'Cursor',
  title: 'Tài khoản Cursor',
  logo: '/assets/ai-accounts/detail/cursor.webp',
  resultCount: 50,
  warning: 'Để bảo vệ quyền lợi và mang lại trải nghiệm tốt hơn, chúng tôi khuyên bạn nên chọn gói đăng ký có thời gian sử dụng ngắn và thời gian bảo hành dài.',
  filters: commonFilters(['Pro', 'Pro+', 'Nhóm', 'Ultra', 'Enterprise']),
  offers: cursorOffers,
  introTitle: 'Tài khoản Cursor AI để bán',
  intro: [
    'Cursor AI là một trong những công cụ nổi bật trong lĩnh vực lập trình hỗ trợ AI. Phiên bản Pro mở rộng đáng kể khả năng hoàn thành mã, Agent và phân tích dự án. Trang này mô phỏng giao diện marketplace bằng dữ liệu frontend để đánh giá trải nghiệm duyệt và so sánh ưu đãi.',
  ],
  sections: [
    { title: 'Cursor AI là gì?', paragraphs: ['Cursor AI là trình soạn thảo mã được hỗ trợ bởi AI, xây dựng trên nền Visual Studio Code. Công cụ tập trung vào việc giúp lập trình viên viết mã, gỡ lỗi và hiểu codebase hiệu quả hơn thông qua lệnh ngôn ngữ tự nhiên và các mô hình AI hiện đại.'] },
    { title: 'Cursor cung cấp những gói đăng ký nào?', paragraphs: ['Cursor AI có bốn nhóm gói phổ biến trong bản mô phỏng này: Hobby, Pro, Pro+ và Ultra.'], bullets: [
      { title: 'Hobby', text: 'Phù hợp người mới bắt đầu, có giới hạn yêu cầu Agent và tính năng Tab.' },
      { title: 'Pro', text: 'Tự động hoàn thành Tab không giới hạn, ngữ cảnh dài hơn và hỗ trợ Agent nền.' },
      { title: 'Pro+', text: 'Hạn mức sử dụng cao hơn cho các mô hình OpenAI, Claude và Gemini.' },
      { title: 'Ultra', text: 'Mức sử dụng cao nhất và quyền truy cập ưu tiên vào các tính năng mới.' },
    ] },
    { title: 'Cursor AI Pro cung cấp những tính năng gì?', bullets: [
      { title: 'Tạo mã thông minh hơn', text: 'Tạo hàm hoặc mô-đun từ mô tả tự nhiên và đưa ra gợi ý theo ngữ cảnh của dự án.' },
      { title: 'Gỡ lỗi hiệu quả', text: 'Phân tích lỗi, đề xuất sửa chữa và giảm thời gian lặp lại trong quy trình debug.' },
      { title: 'Hiểu codebase', text: 'Giải thích hàm, lớp và mối quan hệ phụ thuộc trong dự án bằng ngôn ngữ tự nhiên.' },
      { title: 'Linh hoạt mô hình', text: 'Cho phép lựa chọn nhiều mô hình AI tùy loại tác vụ và mức độ phức tạp.' },
    ] },
    { title: 'Làm thế nào để chọn gói phù hợp?', paragraphs: ['So sánh thời hạn sử dụng, tốc độ giao hàng, bảo hành, đánh giá người bán và loại gói. Trong bản demo này, toàn bộ lựa chọn chỉ là mock data và không tạo giao dịch thật.'] },
  ],
};

function genericDetail(slug: string, name: string, logo: string, plans: string[], basePrice: number, sellers: string[]): AccountDetailData {
  const offers: DetailOffer[] = Array.from({ length: 8 }, (_, index) => ({
    id: `${slug}-${index + 1}`,
    meta: `${index % 3 === 0 ? '1 năm' : '1 tháng'}-Toàn quyền truy cập-${plans[index % plans.length]}`,
    title: `${name} ${plans[index % plans.length]} | ${index % 3 === 0 ? '12 Tháng' : '1 Tháng'} | Tài khoản riêng tư`,
    seller: sellers[index % sellers.length],
    rating: index === 5 ? 4.7 : 4.9 + (index % 2) * 0.1,
    positive: index === 5 ? '92.6%' : index % 2 ? '100%' : '98.4%',
    reviews: `(${24 + index * 37})`,
    price: Math.round(basePrice * (1 + index * 0.11) * (index % 3 === 0 ? 4.5 : 1)),
    delivery: index % 3 === 0 ? 'Ngay lập tức' : '20 phút',
    warranty: index % 3 === 0 ? '30 ngày' : '10 ngày',
  }));
  return {
    slug,
    name,
    title: `Tài khoản ${name}`,
    logo,
    resultCount: 30 + offers.length * 2,
    warning: 'Hãy ưu tiên người bán có đánh giá tốt, thời gian giao hàng rõ ràng và thời gian bảo hành phù hợp với nhu cầu sử dụng.',
    filters: commonFilters(plans),
    offers,
    introTitle: `Tài khoản ${name} để bán`,
    intro: [`Trang ${name} sử dụng cùng layout marketplace với Cursor để mô phỏng trải nghiệm “Xem tất cả”: lọc ưu đãi, so sánh người bán, giá, thời gian giao và bảo hành hoàn toàn ở frontend.`],
    sections: [
      { title: `${name} là gì?`, paragraphs: [`${name} là dịch vụ số được mô phỏng trong khu vực Tài khoản AI của Printerval. Nội dung, giá và người bán trên trang này là mock data dùng để đánh giá frontend.`] },
      { title: 'Cách chọn ưu đãi phù hợp', bullets: [
        { title: 'Kiểm tra gói', text: 'Đối chiếu loại gói và thời hạn trước khi chọn.' },
        { title: 'Đánh giá người bán', text: 'Ưu tiên rating và tỷ lệ phản hồi tích cực cao.' },
        { title: 'Giao hàng và bảo hành', text: 'So sánh thời gian giao dự kiến với số ngày bảo hành.' },
      ] },
    ],
  };
}

export const accountDetails: Record<string, AccountDetailData> = {
  cursor,
  claude: genericDetail('claude', 'Claude', '/assets/ai-accounts/claude.webp', ['Pro', 'Max 5x', 'Max 20x'], 246946, ['Nova Digital', 'Cloud Hub', 'AI Market']),
  replit: genericDetail('replit', 'Replit', '/assets/ai-accounts/replit.webp', ['Core', 'Teams'], 571874, ['Dev Tools Store', 'Cloud Studio', 'Code Market']),
  higgsfield: genericDetail('higgsfield', 'Higgsfield', '/assets/ai-accounts/higgsfield.webp', ['Basic', 'Plus', 'Pro'], 441903, ['Creative Hub', 'Video AI Store', 'Studio Market']),
  deepl: genericDetail('deepl', 'DeepL', '/assets/ai-accounts/deepl.webp', ['Advanced', 'Write Pro', 'Ultimate'], 129711, ['Language Hub', 'Translate Store', 'Digital Keys']),
};

export const accountDetailSlugs = Object.keys(accountDetails);
