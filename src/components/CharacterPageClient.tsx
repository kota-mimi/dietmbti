'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowRight } from 'lucide-react'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import { diagramTypes } from '@/data/diagramTypes'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  slug: string
  typeCode: string
  character: any
}

export default function CharacterPageClient({ slug, typeCode, character }: Props) {
  // カードの背景色とテキスト色を決定
  let cardBgColor = 'bg-blue-200/50'
  let textColor = 'text-blue-600'
  let accentColor = 'blue'
  
  if (typeCode.startsWith('SR')) {
    cardBgColor = 'bg-green-200/50'
    textColor = 'text-green-600'
    accentColor = 'green'
  } else if (typeCode.startsWith('SE')) {
    cardBgColor = 'bg-purple-200/50'
    textColor = 'text-purple-600'
    accentColor = 'purple'
  } else if (typeCode.startsWith('GR')) {
    cardBgColor = 'bg-red-400/60'
    textColor = 'text-red-600'
    accentColor = 'red'
  } else if (typeCode.startsWith('GE')) {
    cardBgColor = 'bg-blue-200/50'
    textColor = 'text-blue-600'
    accentColor = 'blue'
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] ${notoSansJP.className}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* パンくずナビ */}
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/gallery" className="hover:text-white transition-colors">キャラクター一覧</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white font-medium">{character.name}</span>
          </div>
        </motion.nav>

        {/* メインコンテンツ - シンプルなカードデザイン */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className={`${cardBgColor} rounded-2xl p-6 shadow-lg`}>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              {/* タイプコード */}
              <div className="mb-4">
                <span className={`text-lg font-bold ${textColor} bg-gray-100 px-3 py-1 rounded-full`}>
                  {typeCode}
                </span>
              </div>

              {/* キャラクター画像 */}
              <div className="flex justify-center mb-6">
                <Image
                  src={`/characters/${typeCode === 'SRFQ' ? 'SRFQ_gallery.png' : typeCode === 'SECQ' ? 'SECQ_gallery.png' : typeCode === 'SEFL' ? 'SEFL_gallery.png' : typeCode === 'SRCL' ? 'SRCL_gallery.png' : typeCode === 'GEFQ' ? 'GEFQ_gallery.png' : typeCode === 'SRFL' ? 'SRFL_gallery.png' : typeCode === 'GRCQ' ? 'GRCQ_gallery.png' : typeCode === 'GEFL' ? 'GEFL_gallery.png' : typeCode === 'GECL' ? 'GECL_gallery.png' : typeCode === 'GECQ' ? 'GECQ_gallery.png' : typeCode === 'SRCQ' ? 'SRCQ_gallery.png' : typeCode === 'SEFQ' ? 'SEFQ_gallery.png' : typeCode === 'GRCL' ? 'GRCL_gallery.png' : typeCode === 'GRFQ' ? 'GRFQ_gallery.png' : typeCode === 'SECL' ? 'SECL_gallery.png' : typeCode === 'GRFL' ? 'GRFL_gallery.png' : typeCode + '_new3.png'}`}
                  alt={`${character.name}のキャラクター`}
                  width={200}
                  height={225}
                  className="w-48 h-auto"
                  quality={95}
                />
              </div>

              {/* キャラクター名とキャッチコピー */}
              <div className="mb-6">
                <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-2 ${zenMaruGothic.className}`}>
                  {character.name}
                </h1>
                <p className={`text-lg ${textColor} font-medium`}>
                  {character.catchcopy}
                </p>
              </div>

              {/* 基本生態 */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">基本生態</h3>
                <p className="text-gray-700 leading-relaxed">
                  {character.basicEcology}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center space-y-6"
        >
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 max-w-sm mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
              あなたのダイエット<br className="sm:hidden" />キャラは何かな？
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              診断してみよう！
            </p>
            
            <Link href="/quiz/1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
              >
                診断を始める
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}