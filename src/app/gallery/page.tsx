'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
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
    <main className={`min-h-screen bg-app-gradient text-[#211b18] ${notoSansJP.className}`}>
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-black md:text-5xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#211b18] bg-[#ffd166] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#211b18]"><Sparkles className="h-4 w-4" />CHARACTER COLLECTION</span><br />
            全16タイプ診断結果
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base font-medium text-[#695c55] md:text-lg"
          >
            あなたはどのタイプに当てはまりますか？
          </motion.p>
        </div>

        {/* タイプ一覧グリッド */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4"
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
                className={`${cardBgColor} overflow-hidden rounded-[26px] border-2 border-[#211b18] p-2 shadow-[5px_5px_0_#211b18] transition-transform duration-200 hover:-translate-y-1`}
              >
                <div className="h-full rounded-[20px] bg-white p-2 md:p-4"
              >
                {/* タイプコード - 小さく上部に表示 */}
                <div className="pb-2 pt-2 text-center">
                  <h2 className={`inline-flex rounded-full border-2 border-[#211b18] bg-[#fff8ee] px-3 py-1 text-xs font-black md:text-sm ${textColor}`}>
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
                    className="h-auto w-28 md:w-36"
                    quality={95}
                  />
                </div>

                <div className="space-y-3 px-1 pb-3 md:px-3 md:pb-5">
                  {/* タイプ名 */}
                  <h3 className="text-center text-sm font-black leading-tight text-[#211b18] md:text-base">
                    {type.name}
                  </h3>

                  {/* 基本生態（3行でキリよく） */}
                  <p className="hidden text-left text-sm leading-relaxed text-[#695c55] sm:block">
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
                      className="flex w-full items-center justify-center gap-1 rounded-full border-2 border-[#211b18] bg-[#0ea5e9] px-3 py-2.5 text-center text-xs font-black text-white shadow-[3px_3px_0_#211b18] transition hover:-translate-y-0.5 md:text-sm"
                    >
                      詳しく見る <ArrowRight className="h-4 w-4" />
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
          <Link href="/quiz/1?restart=1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 font-black text-white transition-all duration-200"
            >
              診断を始める
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fff8ee]">
        <div className="w-8 h-8 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}
