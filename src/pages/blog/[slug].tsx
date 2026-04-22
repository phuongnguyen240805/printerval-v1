// app/blog/[slug]/page.tsx
import { fetchArticleBySlug, getArticleContent } from '@/lib/strapiApi';
import TableOfContents from '@/shared/features/page/blog/TableOfConten/TableOfContents';
import RightSidebar from '@/shared/features/page/blog/TableOfConten/Sidebar';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

// Dữ liệu tĩnh dự phòng khi không có bài viết từ BE
const fallbackData = {
    title: "Hướng dẫn tối ưu hóa giao diện người dùng chuyên nghiệp 2024",
    author: "prentival",
    publishDate: new Date().toISOString(),
    content: `
    <h2 id="gioi-thieu">1. Giới thiệu tổng quan</h2>
    <p>Đây là bài viết mẫu để kiểm tra mục lục và giao diện khung vàng.</p>
    <h3 id="chi-tiet-1">1.1 Lợi ích của tối ưu giao diện</h3>
    <p>Tăng tỷ lệ chuyển đổi và trải nghiệm người dùng tốt hơn.</p>
    <h2 id="quy-trinh">2. Quy trình thực hiện</h2>
    <p>Các bước từ lập kế hoạch đến triển khai thực tế.</p>
    <h2 id="ket-luan">3. Kết luận</h2>
    <p>Tối ưu hóa là một quá trình liên tục.</p>
  `
};

interface BlogPostProps {
    displayData: typeof fallbackData;
}

export default function BlogPost({ displayData }: BlogPostProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">

                {/* TIÊU ĐỀ NẰM NGOÀI KHUNG - CHIẾM HẾT CHIỀU NGANG PHÍA TRÊN */}
                <header className="mb-12 max-w-6xl mx-auto text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        {displayData.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 justify-center lg:justify-start">
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-gray-100">📅</span>
                            <span className="font-medium text-gray-700">
                                {new Date(displayData.publishDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-gray-100">👤</span>
                            <span className="font-medium text-gray-700">{displayData.author}</span>
                        </div>
                    </div>
                </header>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cột trái - Mục lục */}
                    <aside className="hidden lg:block w-80 sticky top-24 h-fit">

                        <TableOfContents content={displayData.content} />
                    </aside>


                    {/* Cột giữa - Khung bài viết */}
                    <main className="flex-1 max-w-4xl">
                        <article className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-gray-50">
                            <div className="p-8 md:p-12">
                                <div
                                    className="prose prose-lg max-w-none text-gray-800 
                    prose-headings:text-gray-900 prose-headings:font-bold 
                    prose-a:text-blue-600 prose-img:rounded-2xl blog-content"
                                    dangerouslySetInnerHTML={{ __html: displayData.content }}
                                />

                                {/* Footer bài viết */}
                                <div className="mt-16 pt-8 border-t border-gray-100">
                                    <Link href="/blog" className="text-blue-600 font-bold hover:underline">
                                        ← Quay lại Blog
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </main>

                    {/* Cột phải - Sidebar */}
                    <aside className="hidden lg:block w-80 sticky top-24 h-fit">
                        <RightSidebar />
                    </aside>
                </div>

            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async ({ params }) => {
    const slug = params?.slug as string;

    if (!slug) {
        return {
            notFound: true,
        };
    }

    let displayData = fallbackData;

    try {
        const article = await fetchArticleBySlug(slug);
        if (article) {
            const data = getArticleContent(article);
            displayData = { ...data };
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        displayData = fallbackData;
    }

    return {
        props: {
            displayData,
        },
    };
};