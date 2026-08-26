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
    <header className={`sticky top-0 z-50 border-b-2 border-[#211b18] bg-[#fff8ee]/95 backdrop-blur ${notoSansJP.className}`}>
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 z-50 h-full w-80 border-l-2 border-[#211b18] bg-[#fff8ee] shadow-[-6px_0_0_#211b18] md:hidden"
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-full border-2 border-[#211b18] bg-white p-2 shadow-[2px_2px_0_#211b18]"
            aria-label="メニューを閉じる"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        
        <div className="p-6">
          <nav className="space-y-6">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block rounded-2xl border-2 border-[#211b18] bg-white px-5 py-3 text-lg font-black text-[#211b18] shadow-[3px_3px_0_#211b18] transition hover:-translate-y-0.5"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </header>
  )
}
