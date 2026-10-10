import Image from 'next/image';
import { useState } from 'react';
import { FiCheckCircle, FiFileText, FiSearch } from 'react-icons/fi';
import { CatalogCarousel } from '@/shared/ui/liquid/CatalogCarousel';
import { team } from './mockData';

const steps = [
  {
    title: 'Tìm kiếm',
    description: 'Nhập từ khóa hoặc chọn danh mục hợp đồng theo nhu cầu.',
    icon: FiSearch,
  },
  {
    title: 'Chọn mẫu',
    description: 'Đối chiếu nội dung, đối tượng sử dụng và định dạng tài liệu.',
    icon: FiFileText,
  },
  {
    title: 'Nhận tài liệu',
    description:
      'Kiểm tra thông tin gói và tài liệu có sẵn trước khi tiếp tục.',
    icon: FiCheckCircle,
  },
];

/** A usable guide frame while the reference video's source is unavailable. */
export function ContractGuide({ videoSrc }: { videoSrc?: string }) {
  const [step, setStep] = useState(0);
  const Icon = steps[step].icon;
  if (videoSrc)
    return (
      <video
        controls
        playsInline
        preload="metadata"
        className="mx-auto aspect-[470/255] w-full max-w-[470px] rounded-2xl"
        src={videoSrc}
        aria-label="Hướng dẫn chọn và nhận hợp đồng"
      />
    );
  return (
    <div className="mx-auto max-w-[470px]">
      <div
        data-liquid-surface=""
        className="flex aspect-[470/255] flex-col items-center justify-center rounded-2xl border border-white/60 p-5 text-center"
        aria-live="polite"
      >
        <Icon size={32} className="mb-3 text-green-600" aria-hidden="true" />
        <span className="text-xs font-semibold text-green-700">
          BƯỚC {step + 1} / 3
        </span>
        <h4 className="mt-2 text-xl font-semibold">{steps[step].title}</h4>
        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
          {steps[step].description}
        </p>
      </div>
      <div
        className="mt-3 grid grid-cols-3 gap-2"
        role="group"
        aria-label="Các bước hướng dẫn"
      >
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={step === index}
            data-catalog-variant={step === index ? 'primary' : 'secondary'}
            className="min-h-11 rounded-full px-2 py-2 text-xs font-semibold sm:text-sm"
            onClick={() => setStep(index)}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: 'Anh Hải',
    role: 'Freelancer · buôn bán tự do',
    text: 'Trước đây, tôi phải trả tiền cho luật sư để kiểm tra lại hợp đồng do AI soạn, rất tốn thời gian và chi phí nhân đôi. Bây giờ, tôi chỉ cần mua mẫu chuẩn từ web.',
  },
  {
    name: 'Anh Thành Đỗ',
    role: 'Chủ doanh nghiệp Agency Marketing',
    text: 'Mặc dù chỉ bỏ tiền mua mẫu, nhưng tôi cảm thấy như có luật sư riêng. Khi tôi cần tùy chỉnh điều khoản về KPI/hiệu suất, đội ngũ chăm sóc khách hàng đã hỗ trợ rất nhanh và chính xác.',
  },
  {
    name: 'Anh Huy',
    role: 'Chủ xưởng gia công',
    text: 'Tôi từng bối rối về các điều khoản phạt vi phạm hợp đồng. Mẫu tôi mua có quy định chi tiết về pháp lý và cách tính phạt. Chi phí mua là khoản đầu tư nhỏ cho sự minh bạch và an tâm trong giao dịch.',
  },
];

export function ContractTestimonials() {
  return (
    <div className="mx-auto max-w-4xl">
      <CatalogCarousel label="Đánh giá khách hàng hợp đồng" compact>
        {testimonials.map(item => (
          <figure
            data-liquid-card=""
            key={item.name}
            className="m-0 rounded-3xl p-6 sm:p-8"
          >
            <span className="text-amber-500" aria-label="5 trên 5 sao">
              ★★★★★
            </span>
            <blockquote className="mt-4 text-base leading-7 text-gray-700">
              “{item.text}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700"
                aria-hidden="true"
              >
                {item.name.replace('Anh ', '').slice(0, 1)}
              </span>
              <span>
                <strong className="block text-sm">{item.name}</strong>
                <span className="text-xs text-gray-500">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </CatalogCarousel>
    </div>
  );
}

export function ContractTeam() {
  const groups = [
    { title: 'Nhà sáng lập', members: team.slice(0, 1), small: false },
    { title: 'Đội ngũ nòng cốt', members: team.slice(1, 4), small: false },
    { title: 'Ban biên tập', members: team.slice(4), small: true },
  ];
  return (
    <div className="mt-10 space-y-8">
      {groups.map(group => (
        <section key={group.title} aria-label={group.title}>
          <h3 className="mb-5 text-center text-base font-semibold text-gray-700">
            {group.title}
          </h3>
          <div
            className={`mx-auto grid max-w-5xl justify-items-center gap-x-4 gap-y-6 ${group.members.length === 1 ? 'grid-cols-1' : group.small ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}
          >
            {group.members.map(member => (
              <div
                key={member.name}
                className="w-full max-w-[240px] text-center"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  className={`mx-auto rounded-full object-cover ${group.small ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-16 w-16 sm:h-20 sm:w-20'}`}
                />
                <div className="mt-3 text-sm font-semibold">{member.name}</div>
                <p className="mt-1 text-xs leading-5 text-green-700">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
