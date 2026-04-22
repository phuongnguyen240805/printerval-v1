"use client";


import AgencyCardPropsSection from "@/shared/features/page/blog/agency-card-props";
import LangdingBlog2 from "@/shared/features/page/blog/main-blog/langding2/langdingblog2";
import Langdingblog1 from "@/shared/features/page/blog/main-blog/Langdingblog1";
import BlogPost from "@/lib/blog-card-data";
import { PrimaryLayout } from "@/layouts";
import Recently from "@/packages/browsing-history/components/recently";

export default function main() {
  return (
    <main>
      <PrimaryLayout seo={{ title: 'Home', canonical: '/' }}>
        <Langdingblog1 />
        <LangdingBlog2 />

        <AgencyCardPropsSection title="Bài viết nổi bật" posts={BlogPost} />
        <Recently />
      </PrimaryLayout>
    </main>
  );
}
