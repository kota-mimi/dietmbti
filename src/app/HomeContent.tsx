'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import CharacterMarquee from '@/components/CharacterMarquee'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export default function HomeContent() {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] md:bg-blue-50 ${notoSansJP.className}`}>
      <main className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        
        {/* メインコンテンツ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* タイトル */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-6">
            ダイエットキャラ診断16
          </h1>
          
          {/* サブタイトル */}
          <h2 className="text-xl md:text-2xl text-blue-800 mb-12">
            あなたの性格と、痩せ方が見つかる。
          </h2>
          
          {/* 診断ボタン */}
          <Link href="/quiz/1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-xl transition-all duration-300 mb-16"
            >
              診断を始める
            </motion.button>
          </Link>
        </motion.div>

        {/* Character Marquee Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full space-y-6"
        >
          {/* First row - scrolling right (SR & SE types) */}
          <CharacterMarquee direction="right" speed={15} row="first" />
          
          {/* Second row - scrolling left (GR & GE types) */}
          <CharacterMarquee direction="left" speed={18} row="second" />
        </motion.div>
      </main>
    </div>
  )
}