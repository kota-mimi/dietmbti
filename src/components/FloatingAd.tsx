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
  imageUrl = "/line-ad-v2.png",
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
        fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5
        transition-all duration-300 ease-in-out
        opacity-100
        h-[100px] w-[100px]
      `}
    >
      {/* 広告バナー本体 */}
      <div
        onClick={handleClick}
        className={`
          relative overflow-hidden rounded-full border-2 border-[#211b18] bg-white shadow-[4px_4px_0_#211b18]
          ${linkUrl && linkUrl !== "#" ? 'cursor-pointer' : 'cursor-default'}
          transform transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-105
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

      {/* 閉じるボタンを広告本体に重ね、ひとつのUIとして見せる。 */}
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          className="
            absolute -right-1 -top-1 z-20
            flex h-6 w-6 items-center justify-center
            rounded-full border-2 border-[#211b18] bg-[#fff8ee] text-[#211b18]
            shadow-[2px_2px_0_#211b18] hover:scale-105
            transition-all duration-200
          "
          aria-label="広告を閉じる"
        >
          <X size={13} strokeWidth={3} />
        </button>
      )}

    </div>
  )
}
