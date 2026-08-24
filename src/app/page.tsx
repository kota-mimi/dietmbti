import { Suspense } from 'react'
import type { Metadata } from 'next'
import HomeContent from './HomeContent'

export const metadata: Metadata = {
  title: 'ダイエットタイプ診断｜あなたの痩せ方、見つかる',
  description: '16タイプのダイエット性格診断で、あなたに合った続けやすい方法を発見。24問・約3分で完了。',
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
