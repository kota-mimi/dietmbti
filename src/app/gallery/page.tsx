'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Home } from 'lucide-react'
import { Noto_Sans_JP } from 'next/font/google'
import { diagramTypes } from '@/data/diagramTypes'
import { Suspense } from 'react'
import { characterSlugs } from '@/data/characterSlugs'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

function GalleryContent() {
  const typeKeys = Object.keys(diagramTypes) as Array<keyof typeof diagramTypes>
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] ${notoSansJP.className}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            全16タイプ診断結果
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/90"
          >
            あなたはどのタイプに当てはまりますか？
          </motion.p>
        </div>

        {/* タイプ一覧グリッド */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {typeKeys.map((typeCode, index) => {
            const type = diagramTypes[typeCode]
            
            // カードの背景色とテキスト色を決定
            let cardBgColor = 'bg-blue-200/50' // デフォルト
            let textColor = 'text-blue-600' // デフォルト
            const typeCodeStr = String(typeCode)
            if (typeCodeStr.startsWith('SR')) {
              cardBgColor = 'bg-green-200/50' // SR系統（緑）
              textColor = 'text-green-600'
            } else if (typeCodeStr.startsWith('SE')) {
              cardBgColor = 'bg-purple-200/50' // SE系統（紫）
              textColor = 'text-purple-600'
            } else if (typeCodeStr.startsWith('GR')) {
              cardBgColor = 'bg-red-400/60' // GR系統（赤）
              textColor = 'text-red-600'
            } else if (typeCodeStr.startsWith('GE')) {
              cardBgColor = 'bg-blue-200/50' // GE系統（青）
              textColor = 'text-blue-600'
            }
            
            return (
              <motion.div
                key={typeCode}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`${cardBgColor} rounded-2xl p-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="bg-white rounded-xl p-4 shadow-sm"
              >
                {/* タイプコード - 小さく上部に表示 */}
                <div className="text-center pt-4 pb-2">
                  <h2 className={`text-lg font-bold ${textColor}`}>
                    {typeCode}
                  </h2>
                </div>

                {/* キャラクター画像 - 大きく中央に */}
                <div className="flex justify-center pb-4">
                  <Image
                    src={`/characters/${typeCode === 'SRFQ' ? 'SRFQ_gallery.png' : typeCode === 'SECQ' ? 'SECQ_gallery.png' : typeCode === 'SEFL' ? 'SEFL_gallery.png' : typeCode === 'SRCL' ? 'SRCL_gallery.png' : typeCode === 'GEFQ' ? 'GEFQ_gallery.png' : typeCode === 'SRFL' ? 'SRFL_gallery.png' : typeCode === 'GRCQ' ? 'GRCQ_gallery.png' : typeCode === 'GEFL' ? 'GEFL_gallery.png' : typeCode === 'GECL' ? 'GECL_gallery.png' : typeCode === 'GECQ' ? 'GECQ_gallery.png' : typeCode === 'SRCQ' ? 'SRCQ_gallery.png' : typeCode === 'SEFQ' ? 'SEFQ_gallery.png' : typeCode === 'GRCL' ? 'GRCL_gallery.png' : typeCode === 'GRFQ' ? 'GRFQ_gallery.png' : typeCode === 'SECL' ? 'SECL_gallery.png' : typeCode === 'GRFL' ? 'GRFL_gallery.png' : typeCode + '_new3.png'}`}
                    alt={`${type.name}のキャラクター`}
                    width={160}
                    height={180}
                    className="w-36 h-auto"
                    quality={95}
                  />
                </div>

                <div className="px-4 pb-6 space-y-3">
                  {/* タイプ名 */}
                  <h3 className="text-sm font-bold text-[#333333] text-center leading-tight">
                    {type.name}
                  </h3>

                  {/* 基本生態（3行でキリよく） */}
                  <p className="text-sm text-[#666666] text-left leading-relaxed">
                    {(() => {
                      const text = type.basicEcology
                      // 3行表示用の文字数制限（約45-60文字で3行）
                      if (text.length <= 60) return text
                      
                      // 「です」「ます」「。」で終わる位置を探す（45-60文字の範囲）
                      const cutPoints = []
                      for (let i = 45; i < Math.min(text.length, 60); i++) {
                        if (text.substring(i, i + 2) === 'です' || 
                            text.substring(i, i + 2) === 'ます' || 
                            text.charAt(i) === '。') {
                          cutPoints.push(text.charAt(i) === '。' ? i + 1 : i + 2)
                        }
                      }
                      
                      if (cutPoints.length > 0) {
                        return text.substring(0, cutPoints[0])
                      }
                      
                      // 見つからない場合は55文字で切って「。」を追加
                      return text.substring(0, 55) + '。'
                    })()}
                  </p>

                  {/* 詳細ボタン：チラ見せページへ（完全な結果は診断した人だけの特典） */}
                  <div className="pt-3">
                    <Link
                      href={`/character/${characterSlugs[typeCodeStr]}`}
                      className="block w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium py-3 px-4 rounded-full transition-colors text-center"
                    >
                      詳しく見る
                    </Link>
                  </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ホームに戻るボタン */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link href="/quiz/1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-[#2196F3] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              診断を始める
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}