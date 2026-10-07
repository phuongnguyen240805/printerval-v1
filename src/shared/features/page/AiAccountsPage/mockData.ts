export type CatalogCategory = 'all' | 'ai' | 'software' | 'music' | 'gaming';

export interface MarketplaceOffer {
  id: string;
  title: string;
  price: number;
}

export interface AiProduct {
  id: string;
  name: string;
  category: Exclude<CatalogCategory, 'all'>;
  logo: string;
  price: number;
  duration?: string;
  badge?: string;
  type: 'official' | 'marketplace';
  features: string[];
  tags?: string[];
  joinedText?: string;
  offerCount?: number;
  offers?: MarketplaceOffer[];
  detailSlug?: string;
}

export const catalogTabs: Array<{ id: CatalogCategory; label: string; icon: string }> = [
  { id: 'all', label: 'Tất cả', icon: '✦' },
  { id: 'ai', label: 'AI', icon: 'AI' },
  { id: 'software', label: 'Phần mềm', icon: '⌘' },
  { id: 'music', label: 'Âm nhạc', icon: '♫' },
  { id: 'gaming', label: 'Trò chơi', icon: '◈' },
];

export const products: AiProduct[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai',
    logo: '/assets/ai-accounts/chatgpt.webp',
    price: 125552,
    duration: '/ tháng',
    badge: '🖼️ ChatGPT Images 2.5',
    type: 'official',
    features: [
      'Các gói ChatGPT Plus với nhiều thời hạn đăng ký cùng tùy chọn riêng tư và dùng chung.',
      'GPT Images tạo hình ảnh nhanh, hỗ trợ chỉnh sửa và tinh chỉnh qua nhiều lượt trao đổi.',
      'Trò chuyện, viết nội dung, phân tích dữ liệu và tìm kiếm trên web trong một nơi.',
      'Mock FE: trạng thái mua hàng và thời hạn được mô phỏng hoàn toàn ở phía trình duyệt.',
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'ai',
    logo: '/assets/ai-accounts/claude.webp',
    price: 246946,
    type: 'marketplace',
    offerCount: 124,
    detailSlug: 'claude',
    tags: ['1 tháng', 'Tài khoản dùng chung', 'Toàn quyền truy cập', 'Max 5x'],
    offers: [
      { id: 'claude-1', title: 'Claude Pro | Tài khoản chia sẻ | Toàn cầu', price: 246946 },
      { id: 'claude-2', title: '1 Tháng Tài khoản Claude Pro | Mã kích hoạt', price: 259683 },
      { id: 'claude-3', title: 'Claude Pro | 1 Tháng | Giao hàng trong 20 phút', price: 286717 },
    ],
    features: [],
  },
  {
    id: 'suno',
    name: 'Suno',
    category: 'music',
    logo: '/assets/ai-accounts/suno.webp',
    price: 129711,
    duration: '/ tháng',
    type: 'official',
    joinedText: 'a5***25 đã tham gia 7 giờ trước',
    features: [
      'Gói Pro với thêm tín dụng để tạo nội dung chất lượng cao hơn.',
      'Nâng cấp giọng hát và hòa âm phối khí để tạo phong cách nhạc riêng.',
      '625 tín dụng mỗi người dùng mỗi tháng.',
      'Tối đa 10 công việc tạo nhạc chạy đồng thời.',
    ],
  },
  {
    id: 'cursor-market',
    name: 'Cursor',
    category: 'software',
    logo: '/assets/ai-accounts/cursor.webp',
    price: 779163,
    type: 'marketplace',
    offerCount: 50,
    detailSlug: 'cursor',
    tags: ['Pro+', '1 năm', 'Ultra', 'Enterprise', 'Nhóm'],
    offers: [
      { id: 'cursor-1', title: 'Cursor AI Pro - Tài khoản riêng tư, truy cập đầy đủ', price: 779163 },
      { id: 'cursor-2', title: 'Official Cursor Pro+ | Premium 1 Tháng', price: 2000260 },
      { id: 'cursor-3', title: 'Official Cursor Pro | Premium 1 Tháng', price: 883087 },
    ],
    features: [],
  },
  {
    id: 'replit',
    name: 'Replit',
    category: 'software',
    logo: '/assets/ai-accounts/replit.webp',
    price: 571874,
    type: 'marketplace',
    offerCount: 42,
    detailSlug: 'replit',
    tags: ['Core', '1 hồ sơ riêng tư', '3 tháng'],
    offers: [
      { id: 'replit-1', title: 'Replit Core Plan | 1 Tháng | $40 tín dụng AI', price: 571874 },
      { id: 'replit-2', title: 'Replit Core | Workspace lập trình AI và cloud', price: 1819600 },
      { id: 'replit-3', title: 'Replit Core | 1 Tháng | Truy cập đầy đủ', price: 389914 },
    ],
    features: [],
  },
  {
    id: 'higgsfield',
    name: 'Higgsfield',
    category: 'ai',
    logo: '/assets/ai-accounts/higgsfield.webp',
    price: 1013777,
    type: 'marketplace',
    offerCount: 39,
    detailSlug: 'higgsfield',
    tags: ['Plus', 'Gói cơ bản', '1 tháng'],
    offers: [
      { id: 'higgs-1', title: 'Higgsfield Pro | 1 Tháng | Truy cập đầy đủ', price: 1013777 },
      { id: 'higgs-2', title: 'Higgsfield Plus | 1200 credits | Seedance', price: 1117754 },
      { id: 'higgs-3', title: 'Higgsfield Basic | 180+ credits', price: 441903 },
    ],
    features: [],
  },
  {
    id: 'candy',
    name: 'Candy AI',
    category: 'ai',
    logo: '/assets/ai-accounts/candy.webp',
    price: 207694,
    duration: '/ tháng',
    type: 'official',
    joinedText: 'ya***50 đã tham gia 28 ngày trước',
    features: [
      'Gói Premium với thư viện nhân vật phong phú.',
      'Tạo người bạn đồng hành theo thiết lập riêng.',
      'Trò chuyện cá nhân hóa với hình ảnh và tin nhắn thoại.',
      'Quản lý gói và trạng thái hoàn toàn bằng dữ liệu mock.',
    ],
  },
  {
    id: 'deepl',
    name: 'DeepL',
    category: 'software',
    logo: '/assets/ai-accounts/deepl.webp',
    price: 129711,
    type: 'marketplace',
    offerCount: 34,
    detailSlug: 'deepl',
    tags: ['Advanced', 'Write Pro', 'Private'],
    offers: [
      { id: 'deepl-1', title: 'DeepL Pro Advanced + Write Pro | 1 Tháng', price: 129711 },
      { id: 'deepl-2', title: 'DeepL | 3 Months | Full Access', price: 337666 },
      { id: 'deepl-3', title: 'DeepL Advanced | 1 Tháng | Tài khoản riêng', price: 178841 },
    ],
    features: [],
  },
  {
    id: 'grok',
    name: 'Grok',
    category: 'ai',
    logo: '/assets/ai-accounts/grok.webp',
    price: 389914,
    duration: '/ tháng',
    type: 'official',
    joinedText: 'hs***xa đã tham gia 15 giờ trước',
    features: [
      'Gói SuperGrok với tần suất truy vấn cao hơn.',
      'Khả năng lập trình, suy luận và thực thi nâng cao.',
      'Cửa sổ ngữ cảnh lớn hơn cho tác vụ phức tạp.',
      'Mở khóa DeepSearch và Think Mode trong bản demo nội dung.',
    ],
  },
  {
    id: 'cursor-official',
    name: 'Cursor',
    category: 'software',
    logo: '/assets/ai-accounts/cursor.webp',
    price: 467637,
    duration: '/ tháng',
    type: 'official',
    joinedText: 'ho***84 đã tham gia 14 giờ trước',
    features: [
      'Nhiều lựa chọn Pro và Pro+ linh hoạt.',
      'Phát hiện và sửa lỗi tự động trong quy trình lập trình.',
      'Hoàn thành mã không giới hạn.',
      'Proxy agent và luồng làm việc có thể mở rộng.',
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    category: 'ai',
    logo: '/assets/ai-accounts/perplexity.webp',
    price: 106316,
    duration: '/ tháng',
    type: 'official',
    joinedText: 'ki***ol đã tham gia 9 giờ trước',
    features: [
      'Công cụ tìm kiếm AI cung cấp câu trả lời trực tiếp.',
      'Hỏi đáp nhanh với nguồn tham khảo rõ ràng.',
      'Hỗ trợ nhiều tác vụ nghiên cứu và xử lý ngôn ngữ.',
    ],
  },
  {
    id: 'chatgpt-recharge',
    name: 'ChatGPT Recharge',
    category: 'ai',
    logo: '/assets/ai-accounts/chatgpt-recharge.webp',
    price: 714582,
    duration: '/ lần',
    badge: 'Nạp tiền vào tài khoản của bạn',
    type: 'official',
    features: [
      'Nạp Plus cho tài khoản ChatGPT cá nhân.',
      'Giữ lịch sử trò chuyện và dữ liệu riêng trên tài khoản của bạn.',
      'Quyền truy cập các tính năng Plus theo gói demo.',
      'Luồng thanh toán trong trang chỉ là mô phỏng frontend.',
    ],
  },
];

export const whyItems = [
  { icon: '⚡', title: 'Truy cập tức thì', description: 'Mô phỏng trạng thái giao tài khoản ngay sau khi hoàn tất thao tác mua. UI phản hồi tức thì mà không cần backend.' },
  { icon: '▦', title: 'Tất cả trong một nơi', description: 'Dịch vụ AI, phần mềm, âm nhạc và tài khoản số được gom vào cùng một trải nghiệm duyệt và tìm kiếm.' },
  { icon: '↓', title: 'Dịch vụ cao cấp giá thấp hơn', description: 'Card sản phẩm hiển thị giá, thời hạn và lựa chọn gói rõ ràng để người dùng so sánh nhanh.' },
  { icon: '◉', title: 'Truy cập an toàn và đáng tin cậy', description: 'Trang demo không gửi dữ liệu thanh toán hay thông tin cá nhân ra ngoài; mọi thao tác đều dừng ở frontend.' },
  { icon: '24', title: 'Hỗ trợ 24/7', description: 'Các trạng thái hỗ trợ, bảo hành và lịch sử giao dịch được mô phỏng để đánh giá đầy đủ UX sau mua.' },
  { icon: '✓', title: 'Bảo vệ người mua', description: 'Luồng demo thể hiện rõ chính sách bảo hành, hoàn tiền và xác nhận đơn trước khi người dùng tiếp tục.' },
];

export const reviews = [
  { name: 'iRead A Lot', country: 'SI', text: 'You can buy it with your local payment method, efficient customer service, perfect experience.' },
  { name: 'Janos', country: 'HU', text: 'I subscribed for a month without any issues and then extended it for another three months.' },
  { name: 'Emanuel Ciantar', country: 'MT', text: 'The service is reliable and the checkout flow is clear. Everything I need is visible in one place.' },
  { name: 'maxstei', country: 'DE', text: 'The interface makes it easy to compare plans and understand what is included before buying.' },
  { name: 'Gerard Gossier', country: 'FR', text: 'Service client réactif et efficace, expérience globale satisfaisante.' },
  { name: 'Anna Nowak', country: 'PL', text: 'Zawsze otrzymuję szybką i szczegółową pomoc. Interfejs jest przejrzysty i łatwy w użyciu.' },
  { name: 'Fernández', country: 'ES', text: 'Buena experiencia, con descuentos claros y un proceso de compra sencillo.' },
  { name: 'Tommaso Bonucci', country: 'IT', text: 'Una piattaforma semplice e conveniente con informazioni facili da capire.' },
];

export const faqs = [
  {
    question: 'Trang Tài khoản AI này hoạt động như thế nào?',
    answer: 'Đây là bản clone frontend phục vụ đánh giá UI/UX. Tìm kiếm, lọc danh mục, mở rộng mô tả, chọn gói, modal mua hàng, bộ đếm giỏ và FAQ đều chạy ở phía trình duyệt bằng mock data; không gọi API thanh toán hoặc backend sản phẩm.',
  },
  {
    question: 'Dữ liệu sản phẩm trong trang có phải dữ liệu thật không?',
    answer: 'Không. Tên dịch vụ, kiểu card và mức giá được dựng từ bundle tham chiếu để kiểm thử giao diện. Trạng thái tồn kho, thời hạn, ưu đãi và quá trình mua đều là dữ liệu mô phỏng.',
  },
  {
    question: 'Tôi có thể tìm kiếm và lọc sản phẩm không?',
    answer: 'Có. Ô tìm kiếm lọc theo tên, badge và nội dung tính năng. Thanh danh mục cho phép chuyển nhanh giữa AI, phần mềm, âm nhạc và trò chơi; bộ lọc hoạt động hoàn toàn ở frontend.',
  },
  {
    question: 'Nút Mua ngay có tạo đơn thật không?',
    answer: 'Không. Nút Mua ngay mở modal chọn thời hạn, tính tổng tiền mock và mô phỏng thao tác thêm vào giỏ. Không có request thanh toán, không lưu thẻ và không tạo đơn trên hệ thống backend.',
  },
  {
    question: 'Marketplace và Official khác nhau thế nào trong bản demo?',
    answer: 'Card Official tập trung vào một sản phẩm với giá và quyền lợi chính. Card Marketplace mô phỏng nhiều người bán/gói trong cùng một card, có danh sách offer, tag và tổng số ưu đãi để kiểm tra UX so sánh.',
  },
  {
    question: 'Trang có responsive cho mobile không?',
    answer: 'Có. Header chuyển sang menu mobile, lưới sản phẩm thay đổi từ 4 cột xuống 1 cột, tabs có thể cuộn ngang và các section FAQ/review/benefit tự co theo chiều rộng màn hình.',
  },
  {
    question: 'Trang này có phụ thuộc GamsGo hoặc CDN bên ngoài không?',
    answer: 'Không đối với phần clone. Các logo được chép vào public/assets/ai-accounts và toàn bộ UI chính dùng dữ liệu local. Điều này giúp đánh giá frontend ngay cả khi không kết nối API GamsGo.',
  },
  {
    question: 'Có thể nối backend thật sau này không?',
    answer: 'Có. Mock data đã được tách riêng khỏi component. Có thể thay nguồn products/offers bằng API mà không cần đổi cấu trúc layout và các state tương tác chính của trang.',
  },
];
