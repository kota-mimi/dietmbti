'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: '/', label: 'ホーム', key: 'home' },
    { href: '/gallery', label: 'キャラクター一覧', key: 'gallery' },
    { href: '/about', label: 'ダイエット診断16とは', key: 'about' },
    { href: '/contact', label: 'お問い合わせ', key: 'contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 border-b-2 border-[#211b18] bg-[#fff8ee] ${notoSansJP.className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <div className={`text-xl font-black text-[#211b18] sm:text-2xl ${zenMaruGothic.className} tracking-tight`}>
                <span className="text-[#0284c7]">ダイエットキャラ</span>診断<span className="text-[#f97316]">16</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-black text-[#514741] transition-colors hover:text-[#0284c7]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Menu */}
          <button
            className="rounded-full border-2 border-[#211b18] bg-white p-2 shadow-[2px_2px_0_#211b18] md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Full-screen Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[9999] flex min-h-dvh flex-col items-center justify-center bg-[#17324d] px-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="サイトメニュー"
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-5 top-5 rounded-full border-2 border-white bg-[#fff8ee] p-3 shadow-[3px_3px_0_#0d1e2e]"
            aria-label="メニューを閉じる"
          >
            <X className="h-6 w-6 text-[#211b18]" />
          </button>

          <nav className="w-full max-w-sm space-y-5">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block rounded-full border-2 border-[#211b18] bg-[#fff8ee] px-7 py-4 text-xl font-black text-[#211b18] shadow-[5px_5px_0_#0d1e2e] transition hover:-translate-y-0.5"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={`absolute bottom-10 text-xl font-black text-white ${zenMaruGothic.className}`}>
            <span className="text-[#7dd3fc]">ダイエットキャラ</span>診断<span className="text-[#ffd166]">16</span>
          </div>
        </motion.div>
      )}
    </header>
  )
}
