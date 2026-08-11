import { MetadataRoute } from 'next'
import { characterSlugs } from '@/data/characterSlugs'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://diet-type16.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 検索価値のある固定ページ
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/quiz/1`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // 16タイプのキャラクターページ（SEOの主力コンテンツ）
  const characterRoutes: MetadataRoute.Sitemap = Object.values(characterSlugs).map((slug) => ({
    url: `${BASE}/character/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...characterRoutes]
}
