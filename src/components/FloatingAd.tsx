'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface FloatingAdProps {
  imageUrl?: string
  linkUrl?: string
  altText?: string
  onClose?: () => void
  closable?: boolean
}

export default function FloatingAd({
  imageUrl = "/line-ad.png",
  linkUrl = "#",
  altText = "広告バナー",
  onClose,
  closable = true
}: FloatingAdProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleClick = () => {
    if (linkUrl && linkUrl !== "#") {
      trackEvent('line_click', { placement: 'floating_ad', page_path: pathname })
      window.open(linkUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // 回答中は診断への集中を優先する。結果ページには専用のLINE導線があるため重複表示しない。
  if (!isVisible || pathname.startsWith('/quiz/') || pathname === '/result') {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 
        transition-all duration-300 ease-in-out
        opacity-100
        w-[100px] h-[100px]
      `}
    >
      {/* 広告バナー本体 */}
      <div
        onClick={handleClick}
        className={`
          relative bg-transparent rounded-full shadow-lg overflow-hidden
          ${linkUrl && linkUrl !== "#" ? 'cursor-pointer' : 'cursor-default'}
          transform hover:scale-125 transition-transform duration-300 ease-out
          w-full h-full
        `}
        style={{ backgroundColor: 'transparent' }}
      >
        {/* 広告画像 */}
        <Image
          src={imageUrl}
          alt={altText}
          width={100}
          height={100}
          className="relative z-10 h-full w-full rounded-full object-cover"
        />
      </div>

      {/* 閉じるボタン：円の外・右上角にコンパクトに（画像に被らない） */}
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          className="
            absolute -top-1 -right-1 z-20
            flex h-5 w-5 items-center justify-center
            rounded-full bg-white text-gray-500 shadow-md
            ring-1 ring-black/10 hover:text-gray-700 hover:scale-110
            transition-all duration-200
          "
          aria-label="広告を閉じる"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}

    </div>
  )
}
