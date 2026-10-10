import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { ContractCard } from './ContractCard';
import { ContractGuide, ContractTeam, ContractTestimonials } from './ContractSupportingSections';
import { ContractSidebar } from './ContractSidebar';
import { contracts, news } from './mockData';

type HomeTab = 'Mới' | 'Phổ biến' | 'Bán chạy' | 'Được quan tâm';

const popularSearches = ['Hợp đồng lao động', 'Hợp đồng mua bán', 'Hợp đồng thuê nhà'];

const comparisons = [
  ['Mức độ rủi ro pháp lý', 'TỐI THIỂU', 'RẤT CAO', 'CAO', 'Được biên soạn bởi luật sư, lường trước các rủi ro, bảo vệ tối đa quyền lợi các bên một cách cân bằng và chặt chẽ.', 'Rủi ro đến từ sự thiếu hiểu biết pháp luật của người soạn, dễ bỏ sót điều khoản bảo vệ và tạo lỗ hổng cho tranh chấp.', 'Mẫu chung chung, không phù hợp trường hợp cụ thể. Thường chứa điều khoản lỗi thời, gây bất lợi tiềm ẩn.'],
  ['Tính cập nhật theo luật mới', 'LUÔN ĐƯỢC CẬP NHẬT', 'KHÔNG ĐẢM BẢO', 'KHÔNG', 'Đội ngũ pháp chế chuyên nghiệp đảm bảo các mẫu hợp đồng luôn tuân thủ quy định mới nhất.', 'Người soạn khó có đủ nguồn lực theo dõi và áp dụng mọi thay đổi pháp luật một cách chính xác.', 'Hầu hết là các mẫu cũ, không được cập nhật khi luật thay đổi.'],
  ['Tính pháp lý & rõ ràng', 'ĐẢM BẢO 100%', 'KHÔNG CHẮC CHẮN', 'KÉM', 'Ngôn từ chính xác, đơn nghĩa. Cấu trúc đầy đủ, logic, rõ ràng theo chuẩn mực pháp lý.', 'Ngôn ngữ chủ quan, thiếu các điều khoản quan trọng như phạt, bồi thường hoặc bảo mật.', 'Câu từ mập mờ, thiếu thuật ngữ pháp lý chuẩn và dễ bị diễn giải bất lợi.'],
  ['Tính đặc thù & phù hợp', 'RẤT CAO', 'TRUNG BÌNH', 'THẤP', 'Đa dạng mẫu theo từng lĩnh vực đặc thù và có hướng dẫn tùy chỉnh an toàn.', 'Có thể đưa yếu tố riêng vào nhưng thường không đủ và không đúng về mặt pháp lý.', 'Là mẫu chung cho mọi trường hợp, khó đáp ứng giao dịch phức tạp.'],
  ['Công nhận tại cơ quan nhà nước', 'CAO', 'KHÔNG CHẮC CHẮN', 'THẤP', 'Tuân thủ chuẩn mực, giúp quá trình xử lý thủ tục tại cơ quan nhà nước thuận lợi hơn.', 'Nguy cơ bị từ chối nếu không tuân thủ quy chuẩn về hình thức và nội dung.', 'Dễ bị trả lại do sai hình thức hoặc thiếu nội dung bắt buộc.'],
  ['Thời gian & công sức', 'TIẾT KIỆM TỐI ĐA', 'RẤT TỐN KÉM', 'TƯƠNG ĐỐI NHANH', 'Chỉ vài phút để điền thông tin vào biểu mẫu chuẩn đã được nghiên cứu và tối ưu.', 'Mất nhiều ngày hoặc nhiều tuần để tự nghiên cứu, viết từ đầu mà không có bảo đảm.', 'Tải nhanh nhưng vẫn mất thời gian sàng lọc, chỉnh sửa và kiểm tra.'],
  ['Chi phí', 'HỢP LÝ', 'CHI PHÍ CƠ HỘI CAO', '0₫ BAN ĐẦU', 'Một khoản đầu tư nhỏ để bảo vệ tài sản và giao dịch có giá trị lớn.', 'Tốn thời gian và chi phí cơ hội, chưa kể chi phí khắc phục khi xảy ra rủi ro.', 'Miễn phí ban đầu nhưng chi phí sửa sai về sau có thể rất lớn.'],
];

const benefitCards = [
  ['98%', 'Người dùng hài lòng', 'Hơn 5,000 khách hàng tin tưởng và sử dụng dịch vụ', 'from-green-50 via-green-100 to-emerald-200', 'border-green-200', 'text-green-700', FiUsers],
  ['24 giờ', 'Thời gian tiết kiệm', 'So với việc soạn thảo từ đầu, tiết kiệm 90% thời gian', 'from-blue-50 via-blue-100 to-sky-200', 'border-blue-200', 'text-blue-700', FiClock],
  ['10.000+', 'Mẫu Hợp Đồng', 'Được cập nhật liên tục hàng tuần với chất lượng cao', 'from-purple-50 via-purple-100 to-violet-200', 'border-purple-200', 'text-purple-700', FiFileText],
  ['5 phút', 'Hỗ trợ biên soạn tức thì', 'Đội ngũ luật sư luôn sẵn sàng cùng bạn hoàn thiện hợp đồng', 'from-yellow-50 via-yellow-100 to-amber-200', 'border-yellow-200', 'text-amber-700', FiZap],
] as const;

export function ContractHome() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [tab, setTab] = useState<HomeTab>('Mới');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const visibleContracts = useMemo(() => {
    const items = selectedCategory === 'Tất cả' ? [...contracts] : contracts.filter((item) => item.category === selectedCategory);
    if (tab === 'Phổ biến') items.sort((a, b) => b.viewsCount - a.viewsCount);
    if (tab === 'Bán chạy') items.sort((a, b) => b.downloadCount - a.downloadCount);
    if (tab === 'Được quan tâm') items.sort((a, b) => b.rating - a.rating || b.viewsCount - a.viewsCount);
    return items.slice(0, 7);
  }, [selectedCategory, tab]);

  const goSearch = (query: Record<string, string> = {}) => router.push({ pathname: '/collection/mau-hop-dong', query });
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = keyword.trim();
    goSearch(q ? { q } : {});
  };

  return (
    <main className={theme.page}>
      <section data-catalog-hero="" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dcfce7_0,_transparent_32%),radial-gradient(circle_at_top_right,_#dbeafe_0,_transparent_30%),linear-gradient(#fff,#f8fafc)]">
        <div className="mx-auto max-w-screen-2xl px-2 py-10 md:px-6">
          <div className="pt-6 text-center">
            <div className="mx-auto max-w-5xl text-center">
              <div data-liquid-surface="" className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/90 px-4 py-2 text-xs font-semibold text-green-700 shadow-sm md:text-sm">
                <FiShield /> Nền tảng cung cấp hợp đồng số 1 Việt Nam
              </div>
              <h1 data-catalog-title="" className="mx-auto mb-4 max-w-4xl px-2 text-4xl font-bold leading-[1.08] text-gray-900 drop-shadow-sm md:text-6xl lg:text-7xl">
                Hệ thống hợp đồng <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Luật sư soạn</span> - Chuyên nghiệp - Bảo vệ tối đa
              </h1>
              <h2 className="mx-auto mt-4 max-w-2xl text-base font-medium text-gray-700 md:mt-8 md:text-lg">Được biên soạn và phát hành bởi các luật sư, hãng luật uy tín</h2>
            </div>
          </div>

          <div className="mx-auto mb-6 max-w-4xl px-4 py-6 md:mb-8">
            <form onSubmit={submitSearch} className="relative rounded-full border border-gray-200 bg-white p-1 pr-2 shadow-lg md:p-1.5 md:pr-2.5">
              <div className="flex items-center">
                <FiSearch className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400 md:h-6 md:w-6" />
                <input aria-label="Tìm kiếm hợp đồng" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm kiếm hợp đồng..." className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base text-gray-700 outline-none md:px-4 md:py-2.5 md:text-lg" />
                <button data-catalog-primary="" type="submit" className="relative rounded-full border border-green-200/60 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-105 md:px-8 md:py-3 md:text-sm">Tìm ngay</button>
              </div>
            </form>
            <p className="relative z-10 mt-2 w-full px-2 text-center text-sm text-gray-600">
              <span className="font-normal">Tìm kiếm phổ biến: </span>
              {popularSearches.map((item, index) => (
                <button key={item} type="button" onClick={() => goSearch({ q: item })} className="font-medium text-gray-700 hover:text-green-600 hover:underline">{item}{index < popularSearches.length - 1 ? ', ' : ''}</button>
              ))}
            </p>
          </div>

          <div className="mb-12 px-2 md:mb-16">
            <div data-liquid-surface="" className="mx-auto max-w-4xl rounded-3xl bg-white p-4 pt-3 shadow-xl md:px-8 md:pb-7">
              <h3 className="mb-3 text-center text-lg font-bold text-gray-900 md:mb-5 md:text-2xl">Chỉ với <span className="text-green-600">3 bước</span> để tải về hợp đồng bạn cần</h3>
              <ContractGuide />
            </div>
          </div>

          <div className="px-2 md:px-4">
            <div className="relative mx-auto mb-12 max-w-7xl md:mb-20">
              <div data-catalog-glow="" className="absolute inset-0 -m-4 rounded-2xl bg-gradient-to-br from-green-100 via-blue-50 to-green-100 opacity-70 blur-2xl md:-m-10 md:rounded-3xl md:blur-3xl" />
              <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-xl backdrop-blur-sm md:rounded-2xl md:shadow-2xl">
                <div className="flex items-center overflow-x-auto border-b border-gray-200 bg-white px-3 py-2 md:px-6 md:py-3">
                  <div className="mr-2 flex min-w-0 flex-1 space-x-1 overflow-x-auto md:mr-4">
                    {(['Mới', 'Phổ biến', 'Bán chạy', 'Được quan tâm'] as HomeTab[]).map((item) => (
                      <button key={item} type="button" onClick={() => setTab(item)} className={`whitespace-nowrap rounded-t-lg px-2 py-1 text-xs font-medium md:px-4 md:py-2 md:text-sm ${tab === item ? 'border-b-2 border-green-500 bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>{item}</button>
                    ))}
                  </div>
                  <div className="ml-auto hidden flex-shrink-0 items-center space-x-4 text-xs text-gray-500 md:flex md:text-sm">
                    <span className="flex items-center gap-1"><FiFileText className="text-green-600" />10,000+ hợp đồng</span>
                    <span className="flex items-center gap-1"><FiCheckCircle className="text-green-600" />Bảo đảm chất lượng</span>
                  </div>
                </div>

                <div className="bg-[#f5f5f5] p-3 md:p-6">
                  <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
                    <div className="order-2 lg:order-1 lg:col-span-3">
                      <ContractSidebar selected={selectedCategory} onSelect={(value) => { setSelectedCategory(value); setTab('Mới'); }} />
                    </div>
                    <div className="order-1 space-y-2 lg:order-2 lg:col-span-9">
                      {visibleContracts.map((item) => <ContractCard key={item.id} item={item} />)}
                      {!visibleContracts.length ? <div data-liquid-surface="" className="rounded-xl bg-white py-16 text-center text-sm text-gray-500">Không có mẫu hợp đồng trong danh mục này.</div> : null}
                      <button type="button" onClick={() => goSearch(selectedCategory === 'Tất cả' ? {} : { category: selectedCategory })} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50">Xem tất cả hợp đồng <FiArrowRight /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center md:mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Lợi ích vượt trội</span>
            <h2 className="mt-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text p-2 text-center text-4xl font-bold text-transparent md:text-5xl">Giúp bạn xây dựng hợp đồng nhanh chóng</h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-lg leading-relaxed text-gray-600 md:text-xl">Với hơn 10,000 hợp đồng có sẵn, chúng tôi đảm bảo bạn có thể tìm thấy được hợp đồng phù hợp với nhu cầu của mình.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map(([metric, title, desc, gradient, border, tone, Icon]) => (
              <div data-catalog-benefit="" data-liquid-card="" key={title} className={`group relative overflow-hidden rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-5 shadow-xl transition hover:-translate-y-1 md:p-7`}>
                <div className="flex items-start justify-between"><div className={`text-3xl font-semibold ${tone} md:text-4xl`}>{metric}</div><div data-liquid-surface="" className="rounded-2xl bg-white/70 p-3 shadow-sm"><Icon className={`h-6 w-6 ${tone}`} /></div></div>
                <div className="mt-6 text-lg font-bold text-gray-900">{title}</div><p className={`mt-2 text-sm leading-6 ${tone}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center"><span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Khác biệt với hợp đồng miễn phí</span><h2 className="mt-2 text-3xl font-bold text-black/80 md:text-4xl lg:text-5xl">Tại sao cần chọn hợp đồng chất lượng cao ?</h2><p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 md:text-xl">So sánh giữa việc tải miễn phí, tự soạn và việc mua hợp đồng của chúng tôi</p></div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">
                <div className="p-4 md:p-6"><h3 className="text-base font-bold text-gray-900 md:text-xl">Tiêu chí đánh giá</h3></div>
                <div className="border-l border-gray-200 bg-green-100 p-4 text-center md:p-6"><h3 className="text-sm font-bold text-green-700 md:text-lg">Hợp đồng của chúng tôi</h3><p className="mt-1 text-xs text-green-800 md:text-sm">Chất lượng đảm bảo 100%</p></div>
                <div className="border-l border-gray-200 bg-orange-50 p-4 text-center md:p-6"><h3 className="text-sm font-bold text-orange-600 md:text-lg">Tự soạn</h3><p className="mt-1 text-xs text-orange-500 md:text-sm">Rủi ro cao, tốn thời gian</p></div>
                <div className="border-l border-gray-200 bg-red-50 p-4 text-center md:p-6"><h3 className="text-sm font-bold text-red-600 md:text-lg">Hợp đồng miễn phí</h3><p className="mt-1 text-xs text-red-500 md:text-sm">Nhiều rủi ro và hạn chế</p></div>
              </div>
              {comparisons.map(([label, ours, self, free, oursDesc, selfDesc, freeDesc]) => (
                <div key={label} className="grid grid-cols-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center p-4 md:p-5"><h4 className="text-sm font-bold text-blue-700 md:text-base">{label}</h4></div>
                  <div className="border-l border-gray-100 bg-green-50/50 p-4 text-center"><strong className="text-xs text-green-700 md:text-sm">{ours}</strong><p className="mt-2 text-xs leading-5 text-gray-600 md:text-sm">{oursDesc}</p></div>
                  <div className="border-l border-gray-100 p-4 text-center"><strong className="text-xs text-orange-600 md:text-sm">{self}</strong><p className="mt-2 text-xs leading-5 text-gray-600 md:text-sm">{selfDesc}</p></div>
                  <div className="border-l border-gray-100 bg-red-50/30 p-4 text-center"><strong className="text-xs text-red-600 md:text-sm">{free}</strong><p className="mt-2 text-xs leading-5 text-gray-600 md:text-sm">{freeDesc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center md:mt-24"><h3 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">Tại sao khách hàng tin tưởng chúng tôi?</h3><p className="mt-4 text-lg text-gray-600 md:text-xl">Mức độ tin cậy cao nhờ quy trình kiểm duyệt nghiêm ngặt</p></div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {([
              ['Kiểm duyệt bởi luật sư', 'Đội ngũ luật sư giàu kinh nghiệm kiểm tra từng tài liệu', FiShield],
              ['Chứng nhận chất lượng', 'Cam kết hoàn tiền 100% nếu không hài lòng', FiCheckCircle],
              ['Cập nhật liên tục', 'Theo dõi và cập nhật theo quy định pháp luật mới nhất', FiTrendingUp],
            ] as const).map(([title, desc, Icon]) => <div key={title} className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-lg"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600"><Icon size={26} /></div><h4 className="mt-5 text-xl font-semibold text-gray-900 md:text-2xl">{title}</h4><p className="mt-2 text-base text-gray-600 md:text-lg">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-slate-50 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl"><div className="mb-8 text-center"><div className="mb-2 flex justify-center gap-1 text-yellow-400">{Array.from({ length: 5 }).map((_, index) => <FiStar key={index} className="fill-current" />)}</div><h2 className="text-3xl font-bold tracking-tight md:text-4xl">Đánh giá từ khách hàng</h2><p className="mt-3 text-lg text-gray-600">Xem những đánh giá của khách hàng về dịch vụ của chúng tôi</p></div><ContractTestimonials /></div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6"><h2 className="text-pretty text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Đội ngũ phát triển</h2><p className="mx-auto mt-6 max-w-4xl text-center text-lg leading-8 text-gray-600 md:text-xl">Chúng tôi có các luật sư và biên tập viên chuyên nghiệp với nhiều kinh nghiệm, đã tham gia xây dựng hàng trăm mẫu hợp đồng cho các khách hàng trong và ngoài nước</p><ContractTeam /></div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6"><div className="text-center"><span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Tin tức mới nhất</span><h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">Tin tức & Cập nhật</h2><p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Cập nhật những thông tin mới nhất về pháp luật, mẫu hợp đồng và các vấn đề pháp lý quan trọng</p></div><div className="mt-10 grid gap-5 lg:grid-cols-2"><article data-liquid-surface="" className="rounded-3xl border border-slate-100 bg-white p-4 shadow-lg"><div className="mb-4 flex items-center justify-between text-sm text-gray-500"><span>Admin - {news[0].date}</span><span className="rounded-full bg-green-50 px-3 py-1 text-green-700">{news[0].category}</span></div><h3 className="text-xl font-semibold leading-snug text-gray-900"><Link href="/collection/mau-hop-dong/tin-tuc/0">{news[0].title}</Link></h3><p className="mt-4 text-sm leading-6 text-gray-600">Tổng hợp nội dung, thủ tục, lưu ý pháp lý và mẫu văn bản để tham khảo khi thanh lý hoặc chấm dứt hợp đồng.</p><Link data-catalog-variant="text" href="/collection/mau-hop-dong/tin-tuc/0" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green-700">Xem chi tiết <FiArrowRight /></Link></article><div className="space-y-3">{news.slice(1).map((item, index) => <article key={item.title} className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md"><div className="flex-1 min-w-0"><h3 className="text-sm font-semibold leading-6 text-gray-900 group-hover:text-green-700"><Link href={`/collection/mau-hop-dong/tin-tuc/${index + 1}`}>{item.title}</Link></h3><div className="mt-2 flex items-center gap-3 text-xs text-gray-500"><span>{item.category}</span><span>{item.date}</span></div></div></article>)}</div></div></div>
      </section>

    </main>
  );
}
