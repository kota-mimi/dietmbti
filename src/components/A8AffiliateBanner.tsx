'use client'

import React, { useState, useEffect } from 'react'

interface A8AffiliateAd {
  name: string
  mobileCode: string  // モバイル用バナーコード
  desktopCode: string // デスクトップ用バナーコード
  url: string
}

// A8広告データ
const affiliateAds: A8AffiliateAd[] = [
  {
    name: 'New Campaign',
    mobileCode: `<a href="https://px.a8.net/svt/ejp?a8mat=45K5P3+4V1GMQ+45DI+609HT" rel="nofollow">
<img border="0" width="234" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=251203287294&wid=001&eno=01&mid=s00000019359001009000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=45K5P3+4V1GMQ+45DI+609HT" alt="">`,
    desktopCode: `<a href="https://px.a8.net/svt/ejp?a8mat=45K5P3+4V1GMQ+45DI+609HT" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=251203287294&wid=001&eno=01&mid=s00000019359001009000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=45K5P3+4V1GMQ+45DI+609HT" alt="">`,
    url: 'https://px.a8.net/svt/ejp?a8mat=45K5P3+4V1GMQ+45DI+609HT'
  },
  {
    name: 'Campaign2',
    mobileCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV4WG+2XZ6GI+3GKQ+NVHCX" rel="nofollow">
<img border="0" width="234" height="60" alt="" src="https://www22.a8.net/svt/bgt?aid=260113552178&wid=001&eno=01&mid=s00000016145004010000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4AV4WG+2XZ6GI+3GKQ+NVHCX" alt="">`,
    desktopCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV4WG+2XZ6GI+3GKQ+NV9N5" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=260113552178&wid=001&eno=01&mid=s00000016145004009000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AV4WG+2XZ6GI+3GKQ+NV9N5" alt="">`,
    url: 'https://px.a8.net/svt/ejp?a8mat=4AV4WG+2XZ6GI+3GKQ+NVHCX'
  },
  {
    name: 'スマートリング',
    mobileCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV4WG+555TWY+5THY+5ZU29" rel="nofollow">
<img border="0" width="320" height="50" alt="" src="https://www29.a8.net/svt/bgt?aid=260113552311&wid=001&eno=01&mid=s00000027151001007000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4AV4WG+555TWY+5THY+5ZU29" alt="">`,
    desktopCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV4WG+555TWY+5THY+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www26.a8.net/svt/bgt?aid=260113552311&wid=001&eno=01&mid=s00000027151001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4AV4WG+555TWY+5THY+5ZEMP" alt="">`,
    url: 'https://px.a8.net/svt/ejp?a8mat=4AV4WG+555TWY+5THY+5ZU29'
  },
  {
    name: 'SOELU',
    mobileCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV6G9+8SQMLU+4EPM+60OXD" rel="nofollow">
<img border="0" width="120" height="60" alt="" src="https://www28.a8.net/svt/bgt?aid=260115561532&wid=001&eno=01&mid=s00000020569001011000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AV6G9+8SQMLU+4EPM+60OXD" alt="">`,
    desktopCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV6G9+8SQMLU+4EPM+63OY9" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=260115561532&wid=001&eno=01&mid=s00000020569001025000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=4AV6G9+8SQMLU+4EPM+63OY9" alt="">`,
    url: 'https://px.a8.net/svt/ejp?a8mat=4AV6G9+8SQMLU+4EPM+63OY9'
  },
  {
    name: 'ClassPass',
    mobileCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV6G9+8VPSMQ+5S3O+5Z6WX" rel="nofollow">
<img border="0" width="120" height="60" alt="" src="https://www29.a8.net/svt/bgt?aid=260115561537&wid=001&eno=01&mid=s00000026970001004000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4AV6G9+8VPSMQ+5S3O+5Z6WX" alt="">`,
    desktopCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4AV6G9+8VPSMQ+5S3O+5YZ75" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www20.a8.net/svt/bgt?aid=260115561537&wid=001&eno=01&mid=s00000026970001003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4AV6G9+8VPSMQ+5S3O+5YZ75" alt="">`,
    url: 'https://px.a8.net/svt/ejp?a8mat=4AV6G9+8VPSMQ+5S3O+5YZ75'
  }
]

export default function A8AffiliateBanner() {
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 初期表示をランダムに設定
    const initialRandomIndex = Math.floor(Math.random() * affiliateAds.length)
    
    // 画面サイズ判定
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    queueMicrotask(() => {
      setIsMounted(true)
      setCurrentAdIndex(initialRandomIndex)
      checkScreenSize()
    })
    window.addEventListener('resize', checkScreenSize)

    // ローテーション機能（15秒ごとに順次切り替え）
    const rotateAd = () => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % affiliateAds.length)
    }
    
    const interval = setInterval(rotateAd, 15000) // 15秒ごと
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
      clearInterval(interval)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  const currentAd = affiliateAds[currentAdIndex]

  return (
    <div className="w-full flex justify-center">
      <div 
        className="a8-affiliate-banner"
        dangerouslySetInnerHTML={{
          __html: isMobile ? currentAd.mobileCode : currentAd.desktopCode
        }}
      />
    </div>
  )
}
