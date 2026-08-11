import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://diet-type16.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 個人ごとに内容が変わり検索価値のない結果ページはクロール対象から外す
      disallow: ['/result'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
