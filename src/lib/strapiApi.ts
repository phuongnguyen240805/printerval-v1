const API_BASE = process.env.NEXT_PUBLIC_STRAPI_API as string;

export interface StrapiArticle {
  id: number;
  documentId: string;
  content_json?: Array<{
    url?: string;
    date?: string;
    slug?: string;
    title?: string;
    author?: string;
    content?: any;
    description?: string;
    RichText?: any;
  }> | null;
  description?: string | null;
  RichText?: any | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  images?: any | null;
  slug?: string | null;
}

const getHeaders = (): HeadersInit => ({ 'Content-Type': 'application/json' });

export async function fetchArticles(): Promise<{
  articles: StrapiArticle[];
  total: number;
}> {
  if (!API_BASE)
    throw new Error('NEXT_PUBLIC_STRAPI_API environment variable is not set');
  const base = API_BASE.replace(/\/$/, '');
  const qs = new URLSearchParams({
    'pagination[limit]': '1000',
    sort: 'createdAt:desc',
    populate: '*',
  }).toString();
  const primary = `${base}/api/monas?${qs}`;
  const alt = `${base}/monas?${qs}`;

  try {
    let res = await fetch(primary, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok)
      res = await fetch(alt, {
        headers: getHeaders(),
        next: { revalidate: 60 },
      });
    if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
    const data = await res.json();
    const articles: StrapiArticle[] = Array.isArray(data.data) ? data.data : [];
    const total = data.meta?.pagination?.total || articles.length || 0;
    return { articles, total };
  } catch (err) {
    console.error('🚨 fetchArticles error:', err);
    throw err;
  }
}

export async function fetchArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  if (!API_BASE)
    throw new Error('NEXT_PUBLIC_STRAPI_API environment variable is not set');
  const base = API_BASE.replace(/\/$/, '');
  const candidates = [`${base}/api/monas`, `${base}/monas`];
  const filters = [
    { key: 'filters[documentId][$eq]', value: slug },
    { key: 'filters[slug][$eq]', value: slug },
    { key: 'filters[content_json][slug][$eq]', value: slug },
    { key: 'filters[content_json][0][slug][$eq]', value: slug },
  ];

  try {
    // server-side filtered attempts
    for (const candidate of candidates) {
      for (const f of filters) {
        const qp = new URLSearchParams({
          [f.key]: f.value,
          populate: '*',
        } as Record<string, string>);
        const url = `${candidate}?${qp.toString()}`;
        try {
          const res = await fetch(url, {
            headers: getHeaders(),
            next: { revalidate: 60 },
          });
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data.data) && data.data.length > 0) {
            // Ensure the response actually contains an item matching our slug.
            const matches = data.data.filter((item: any) => {
              if (!item) return false;
              if (String(item.documentId) === String(slug)) return true;
              if (String(item.slug) === String(slug)) return true;
              if (
                Array.isArray(item.content_json) &&
                item.content_json.some(
                  (b: any) => b && String(b.slug) === String(slug)
                )
              )
                return true;
              return false;
            });

            if (matches.length > 0) {
              const matched = matches[0];
              if (Array.isArray(matched.content_json)) {
                const blocks = [...matched.content_json];
                const idx = blocks.findIndex(
                  (b: any) => String(b.slug) === String(slug)
                );
                if (idx > 0) {
                  const [m] = blocks.splice(idx, 1);
                  matched.content_json = [m, ...blocks];
                }
              }
              return matched;
            }
            // If none matched, continue trying other filters/candidates instead of returning the first item.
          }
        } catch {
          continue;
        }
      }
    }

    // client-side fallback: fetch lists and search
    const fbCandidates = [
      `${base}/monas?populate=*&pagination[limit]=1000`,
      `${base}/api/monas?populate=*&pagination[limit]=1000`,
    ];
    for (const fb of fbCandidates) {
      try {
        const res = await fetch(fb, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (!res.ok) continue;
        const all = await res.json();
        const list = Array.isArray(all.data) ? all.data : [];
        const found = list.find(
          (item: any) =>
            String(item.documentId) === String(slug) ||
            String(item.slug) === String(slug) ||
            (Array.isArray(item.content_json) &&
              item.content_json.some(
                (b: any) => String(b.slug) === String(slug)
              ))
        );
        if (found) {
          if (Array.isArray(found.content_json)) {
            const idx = found.content_json.findIndex(
              (b: any) => String(b.slug) === String(slug)
            );
            if (idx > 0) {
              const blocks = [...found.content_json];
              const [m] = blocks.splice(idx, 1);
              found.content_json = [m, ...blocks];
            }
          }
          return found;
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('🚨 fetchArticleBySlug error:', error);
    return null;
  }
}

export function getArticleContent(article: StrapiArticle) {
  let title = '';
  let content = '';
  let author = 'MONA Media';
  let publishDate = article.createdAt || '';
  let externalUrl: string | null = null;

  if (Array.isArray(article.content_json) && article.content_json.length > 0) {
    const jsonData = article.content_json[0];
    title =
      jsonData.title ||
      (jsonData.slug
        ? jsonData.slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        : '') ||
      `Hoạt động #${article.id}`;

    if (Array.isArray(jsonData.content)) {
      const serializeBlock = (b: any) => {
        if (!b) return '';
        const text = String(b.text || b.content || '').trim();
        switch (b.type) {
          case 'h1':
            return `<h1>${text}</h1>`;
          case 'h2':
            return `<h2>${text}</h2>`;
          case 'h3':
            return `<h3>${text}</h3>`;
          case 'ul':
            return Array.isArray(b.items)
              ? `<ul>${b.items.map((it: any) => `<li>${String(it).trim()}</li>`).join('')}</ul>`
              : `<ul></ul>`;
          case 'ol':
            return Array.isArray(b.items)
              ? `<ol>${b.items.map((it: any) => `<li>${String(it).trim()}</li>`).join('')}</ol>`
              : `<ol></ol>`;
          case 'p':
          default:
            return `<p>${text}</p>`;
        }
      };
      content = jsonData.content.map((b: any) => serializeBlock(b)).join('\n');
    } else {
      content =
        (typeof jsonData.content === 'string' && jsonData.content) ||
        jsonData.description ||
        article.description ||
        'Chưa có nội dung chi tiết.';
    }

    author =
      jsonData.author === 'Unknown'
        ? 'MONA Media'
        : jsonData.author || 'MONA Media';
    publishDate = jsonData.date || publishDate;
    externalUrl = jsonData.url || null;
  } else if (article.description && article.description.trim()) {
    title = `Hoạt động #${article.id}`;
    content = article.description;
  } else {
    title = `Hoạt động #${article.id}`;
    content = 'Bài viết đang được cập nhật nội dung. Vui lòng quay lại sau!';
  }

  return { title, content, author, publishDate, externalUrl };
}

export async function fetchArticlesSafe(): Promise<{
  articles: StrapiArticle[];
  total: number;
}> {
  try {
    return await fetchArticles();
  } catch (error) {
    console.error('⚠️ API Error, returning empty data:', error);
    return { articles: [], total: 0 };
  }
}
