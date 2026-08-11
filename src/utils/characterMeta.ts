import { Metadata } from 'next'
import { diagramTypes } from '@/data/diagramTypes'
import { slugToType } from '@/data/characterSlugs'

export function generateCharacterMetadata(slug: string): Metadata {
  const typeCode = slugToType[slug]
  if (!typeCode) {
    return {
      title: 'キャラクターが見つかりません',
    }
  }

  const character = diagramTypes[typeCode as keyof typeof diagramTypes]
  if (!character) {
    return {
      title: 'キャラクターが見つかりません',
    }
  }

  const title = `${character.name}（${typeCode}）| ダイエットキャラ診断16`
  const description = `${character.name}の詳細分析：${character.catchcopy} ${character.basicEcology} あなたに最適なダイエット方法を無料診断で発見しよう！`
  
  const url = `https://diet-type16.com/character/${slug}`
  // タイプ別OGPシェアカード（1200×630・キャラ＋タイプ名＋キャッチ＋ロゴ）
  const imageUrl = `https://diet-type16.com/ogp/${typeCode}.png`

  return {
    title,
    description,
    keywords: [
      character.name,
      'ダイエット',
      'MBTI',
      'キャラクター診断',
      '痩せ方',
      '性格診断',
      typeCode,
      character.catchcopy.replace(/[。、]/g, ''),
      'ダイエット診断',
      'ダイエット法',
      '減量',
      'キャラ診断'
    ].join(', '),
    authors: [{ name: 'ダイエットキャラ診断16' }],
    creator: 'ダイエットキャラ診断16',
    publisher: 'ダイエットキャラ診断16',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'ダイエットキャラ診断16',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${character.name}のキャラクター`,
        },
      ],
      locale: 'ja_JP',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@diet_chara16',
      site: '@diet_chara16',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}