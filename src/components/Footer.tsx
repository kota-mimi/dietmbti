'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-[#211b18] bg-[#17324d] py-10 text-white">
      {/* LINEスタンプ宣伝バナー - 将来的に使用する場合は以下のコメントアウトを解除 */}
      {/*
      <div className="bg-green-500 text-white py-4 px-4 mb-6 mx-4 rounded-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-bold">
              LINEスタンプ発売中！
            </div>
            <div className="text-xs">
              診断キャラクターのスタンプをゲットしよう
            </div>
          </div>
          <Link 
            href="https://lin.ee/S61FXhE"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-500 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            今すぐチェック
          </Link>
        </div>
      </div>
      */}

      {/* メインフッターコンテンツ */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* サイト情報 */}
          <div className="space-y-2">
            <p className="text-lg font-black">あなたらしく、ちゃんと続く。</p>
            <p className="text-xs font-medium text-[#bae6fd]">ダイエットキャラ診断16</p>
          </div>

          {/* ナビゲーション */}
          <div>
            <h4 className="mb-4 font-black text-[#ffd166]">コンテンツ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="font-bold text-white transition-colors hover:text-[#7dd3fc]">
                  診断を始める
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="font-bold text-white transition-colors hover:text-[#7dd3fc]">
                  キャラクター一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-bold text-white transition-colors hover:text-[#7dd3fc]">
                  ダイエット診断16とは
                </Link>
              </li>
            </ul>
          </div>

          {/* その他 */}
          <div>
            <h4 className="mb-4 font-black text-[#ffd166]">その他</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-500 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <a 
                  href="https://x.com/diet_chara16" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/diet_chara16?igsh=MXNwOWc2eHM0c3Y5bg%3D%3D&utm_source=qr"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  )
}
