'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import { Sparkles, ArrowRight, Clock, Users, LockKeyhole } from 'lucide-react'
import CharacterMarquee from '@/components/CharacterMarquee'
import { trackEvent } from '@/lib/analytics'

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
    <div className={`relative min-h-screen overflow-hidden bg-app-gradient text-[#211b18] ${notoSansJP.className}`}>
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="animate-blob absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent-300/25 blur-3xl" style={{ animationDelay: '3s' }} />
        <div className="animate-blob absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" style={{ animationDelay: '6s' }} />
      </div>

      <main className="relative px-4 pb-20 pt-12 text-center md:pt-20">

        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto flex max-w-4xl flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border-2 border-[#211b18] bg-[#ffd166] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#211b18]"
          >
            <Sparkles className="h-4 w-4 text-accent-400" />
            16タイプの性格別ダイエット診断
          </motion.div>

          {/* Title */}
          <h1 className={`mb-6 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-ink-900 md:text-7xl ${zenMaruGothic.className}`}>
            <span className="text-gradient-brand">ダイエットキャラ</span>
            <br className="md:hidden" />
            <span className="text-ink-900">診断</span>
            <span className="text-accent-400">16</span>
          </h1>

          {/* Subtitle */}
          <h2 className="mb-8 max-w-xl text-base font-medium leading-relaxed text-ink-700 md:text-lg">
            あなたの性格と、痩せ方が見つかる。<br className="hidden sm:block" />
            たった3分の質問で、続けられるダイエットを。
          </h2>

          {/* CTA */}
          <Link
            href="/quiz/1?restart=1"
            onClick={() => trackEvent('quiz_start', { placement: 'home_hero' })}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary group mb-7 inline-flex items-center gap-3 rounded-full px-10 py-4 text-lg font-black text-white transition-all duration-200 md:px-12 md:text-xl"
            >
              診断を始める
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>

          {/* Meta info */}
          <div className="mb-14 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-ink-500 sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-400" />
              約3分・全24問
            </span>
            <span className="h-4 w-px bg-ink-300/40" />
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-400" />
              16タイプ診断
            </span>
            <span className="h-4 w-px bg-[#211b18]/25" />
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole className="h-4 w-4 text-brand-400" />
              登録不要
            </span>
          </div>
        </motion.div>

        {/* Character Marquee */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto w-full max-w-6xl space-y-4"
        >
          <CharacterMarquee direction="right" speed={15} row="first" />
          <CharacterMarquee direction="left" speed={18} row="second" />
        </motion.div>
      </main>

      <section className="border-y-2 border-[#211b18] bg-[#17324d] px-4 py-5 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-black">
          <span>性格を4軸で分析</span><span className="text-[#ffd166]">×</span><span>全24問</span><span className="text-[#7dd3fc]">×</span><span>16キャラクター</span>
        </div>
      </section>

      <section className="px-4 py-16 text-center md:py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#0284c7]">MEET YOUR DIET CHARACTER</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black md:text-5xl">続けられる方法は、性格で変わる。</h2>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-[#695c55]">あなたの回答から、得意な進め方やつまずきやすいポイントをキャラクターと一緒に紹介します。</p>
        <Link href="/gallery" className="mt-7 inline-flex items-center gap-2 font-black underline decoration-2 underline-offset-8">キャラクター一覧を見る <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  )
}
