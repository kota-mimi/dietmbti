'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import { Sparkles, ArrowRight, Clock, Users } from 'lucide-react'
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
    <div className={`relative min-h-screen overflow-hidden bg-app-gradient ${notoSansJP.className}`}>
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="animate-blob absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent-300/25 blur-3xl" style={{ animationDelay: '3s' }} />
        <div className="animate-blob absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" style={{ animationDelay: '6s' }} />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">

        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-soft backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-accent-400" />
            16タイプの性格別ダイエット診断
          </motion.div>

          {/* Title */}
          <h1 className={`mb-5 text-4xl font-black leading-tight tracking-tight text-ink-900 md:text-6xl lg:text-7xl ${zenMaruGothic.className}`}>
            <span className="text-gradient-brand">ダイエットキャラ</span>
            <br className="md:hidden" />
            <span className="text-ink-900">診断</span>
            <span className="text-accent-400">16</span>
          </h1>

          {/* Subtitle */}
          <h2 className="mb-10 max-w-xl text-base leading-relaxed text-ink-700 md:text-xl">
            あなたの性格と、痩せ方が見つかる。<br className="hidden sm:block" />
            たった3分の質問で、続けられるダイエットを。
          </h2>

          {/* CTA */}
          <Link href="/quiz/1?restart=1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary group mb-8 inline-flex items-center gap-2 rounded-full px-12 py-4 text-lg font-bold text-white transition-all duration-300 md:text-xl"
            >
              診断を始める
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>

          {/* Meta info */}
          <div className="mb-14 flex items-center justify-center gap-6 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-400" />
              約3分・全24問
            </span>
            <span className="h-4 w-px bg-ink-300/40" />
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-400" />
              16タイプ診断
            </span>
          </div>
        </motion.div>

        {/* Character Marquee */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full space-y-5"
        >
          <CharacterMarquee direction="right" speed={15} row="first" />
          <CharacterMarquee direction="left" speed={18} row="second" />
        </motion.div>
      </main>
    </div>
  )
}
