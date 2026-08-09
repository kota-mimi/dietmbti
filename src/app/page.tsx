import { Suspense } from 'react'
import { diagramTypes } from '@/data/diagramTypes'
import type { Metadata } from 'next'
import HomeContent from './HomeContent'


export async function generateMetadata({ searchParams }: { searchParams: Promise<{ result?: string }> }): Promise<Metadata> {
  console.log('🚀 generateMetadata function called - START')
  
  let resolvedSearchParams
  try {
    resolvedSearchParams = await searchParams
    console.log('📋 Raw searchParams:', resolvedSearchParams)
  } catch (error) {
    console.error('❌ Error resolving searchParams:', error)
    resolvedSearchParams = {}
  }
  
  const resultType = resolvedSearchParams.result
  console.log('🔍 Extracted resultType:', resultType)

  if (resultType && diagramTypes[resultType]) {
    const typeData = diagramTypes[resultType]
    console.log('✅ Found matching diagram type:', typeData.name)
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://diet-type16.com'
    const imageUrl = `${baseUrl}/characters/${resultType}_new3.png`
    
    console.log('🖼️ Generated image URL:', imageUrl)
    
    const metadata = {
      title: `私のダイエットタイプは「${typeData.name}」 | ダイエットタイプ診断`,
      description: typeData.catchcopy,
      openGraph: {
        title: `私のダイエットタイプは「${typeData.name}」`,
        description: typeData.catchcopy,
        images: [
          {
            url: imageUrl,
            width: 640,
            height: 760,
            alt: `${typeData.name}のキャラクター`,
          },
        ],
        type: 'website' as const,
        siteName: 'ダイエットタイプ診断',
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: `私のダイエットタイプは「${typeData.name}」`,
        description: typeData.catchcopy,
        images: [imageUrl],
      },
    }
    
    console.log('📝 Generated metadata:', JSON.stringify(metadata, null, 2))
    return metadata
  }

  // デフォルトのメタデータ（結果パラメータがない場合）
  console.log('⚠️ Using default metadata (no result or type not found)')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://diet-type16.com'
  
  return {
    title: "ダイエットタイプ診断｜あなたの痩せ方、見つかる",
    description: "16タイプのダイエット性格診断で、あなたに最適なダイエット方法を発見。24問・約3分で完了。",
    openGraph: {
      title: "ダイエットタイプ診断｜あなたの痩せ方、見つかる",
      description: "16タイプのダイエット性格診断で、あなたに最適なダイエット方法を発見。24問・約3分で完了。",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'ダイエットタイプ診断',
        },
      ],
      type: 'website',
      siteName: 'ダイエットタイプ診断',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ダイエットタイプ診断｜あなたの痩せ方、見つかる',
      description: '16タイプのダイエット性格診断で、あなたに最適なダイエット方法を発見。24問・約3分で完了。',
      images: [`${baseUrl}/og-image.png`],
    },
  }
}


export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
    </div>}>
      <HomeContent />
    </Suspense>
  )
}