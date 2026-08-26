'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import { DiagramType } from '@/types'

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
  typeCode: string
  character: DiagramType
}

export default function CharacterPageClient({ typeCode, character }: Props) {
  // カードの背景色とテキスト色を決定
  let cardBgColor = 'bg-blue-200/50'
  let textColor = 'text-blue-600'
  
  if (typeCode.startsWith('SR')) {
    cardBgColor = 'bg-green-200/50'
    textColor = 'text-green-600'
  } else if (typeCode.startsWith('SE')) {
    cardBgColor = 'bg-purple-200/50'
    textColor = 'text-purple-600'
  } else if (typeCode.startsWith('GR')) {
    cardBgColor = 'bg-red-400/60'
    textColor = 'text-red-600'
  } else if (typeCode.startsWith('GE')) {
    cardBgColor = 'bg-blue-200/50'
    textColor = 'text-blue-600'
  }

  return (
    <main className={`min-h-screen bg-app-gradient text-[#211b18] ${notoSansJP.className}`}>
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        
        {/* パンくずナビ */}
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#695c55]">
            <Link href="/" className="transition-colors hover:text-[#0284c7]">ホーム</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/gallery" className="transition-colors hover:text-[#0284c7]">キャラクター一覧</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="font-black text-[#211b18]">{character.name}</span>
          </div>
        </motion.nav>

        {/* メインコンテンツ - シンプルなカードデザイン */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl"
        >
          <div className={`${cardBgColor} rounded-[32px] border-2 border-[#211b18] p-3 shadow-[7px_7px_0_#211b18] md:p-5`}>
            <div className="rounded-[25px] bg-white p-5 text-center md:p-8">
              {/* タイプコード */}
              <div className="mb-4">
                <span className={`inline-flex rounded-full border-2 border-[#211b18] bg-[#ffd166] px-4 py-1.5 text-sm font-black ${textColor}`}>
                  {typeCode}
                </span>
              </div>

              {/* キャラクター画像 */}
              <div className="mb-6 flex justify-center rounded-[24px] bg-[#fff8ee] py-4">
                <Image
                  src={`/characters/${typeCode === 'SRFQ' ? 'SRFQ_gallery.png' : typeCode === 'SECQ' ? 'SECQ_gallery.png' : typeCode === 'SEFL' ? 'SEFL_gallery.png' : typeCode === 'SRCL' ? 'SRCL_gallery.png' : typeCode === 'GEFQ' ? 'GEFQ_gallery.png' : typeCode === 'SRFL' ? 'SRFL_gallery.png' : typeCode === 'GRCQ' ? 'GRCQ_gallery.png' : typeCode === 'GEFL' ? 'GEFL_gallery.png' : typeCode === 'GECL' ? 'GECL_gallery.png' : typeCode === 'GECQ' ? 'GECQ_gallery.png' : typeCode === 'SRCQ' ? 'SRCQ_gallery.png' : typeCode === 'SEFQ' ? 'SEFQ_gallery.png' : typeCode === 'GRCL' ? 'GRCL_gallery.png' : typeCode === 'GRFQ' ? 'GRFQ_gallery.png' : typeCode === 'SECL' ? 'SECL_gallery.png' : typeCode === 'GRFL' ? 'GRFL_gallery.png' : typeCode + '_new3.png'}`}
                  alt={`${character.name}のキャラクター`}
                  width={200}
                  height={225}
                  className="h-auto w-52 md:w-60"
                  quality={95}
                />
              </div>

              {/* キャラクター名とキャッチコピー */}
              <div className="mb-6">
                <h1 className={`mb-2 text-3xl font-black text-[#211b18] md:text-4xl ${zenMaruGothic.className}`}>
                  {character.name}
                </h1>
                <p className={`text-base font-black md:text-lg ${textColor}`}>
                  {character.catchcopy}
                </p>
              </div>

              {/* 基本生態 */}
              <div className="rounded-[20px] border-2 border-[#211b18] bg-[#fff8ee] p-5 text-left">
                <h3 className="mb-3 text-center text-lg font-black text-[#211b18]">基本生態</h3>
                <p className="font-medium leading-relaxed text-[#514741]">
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
          <div className="card-surface mx-auto max-w-sm rounded-[24px] p-6">
            <h2 className="mb-3 text-lg font-black text-[#211b18] sm:text-xl">
              あなたのダイエット<br className="sm:hidden" />キャラは何かな？
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              診断してみよう！
            </p>
            
            <Link href="/quiz/1?restart=1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary rounded-full px-8 py-3 font-black text-white transition-all duration-200"
              >
                診断を始める
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  )
}
