import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'お問い合わせ | ダイエットキャラ診断',
  description: 'ダイエットキャラ診断へのお問い合わせ先について',
}

export default function ContactPage() {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] ${notoSansJP.className}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            お問い合わせ
          </h1>

          <div className="space-y-8">
            <section className="text-center">
              <p className="text-gray-600 mb-6 text-lg">
                ご質問やご意見、ご感想をお気軽にお寄せください。<br/>
                あなたからのメッセージを楽しみにしております。
              </p>
              
              <div className="bg-teal-50 p-8 rounded-lg border border-teal-200 mt-8">
                <h2 className="text-xl font-bold text-teal-800 mb-4">お問い合わせメール</h2>
                <a 
                  href="mailto:diet16.contact@gmail.com"
                  className="text-teal-600 text-lg font-bold hover:text-teal-700 transition-colors"
                >
                  diet16.contact@gmail.com
                </a>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition-colors font-bold"
                >
                  ホームに戻る
                </Link>
              </div>
            </section>

            {/* LINE広告セクション */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">おすすめサービス</h2>
              <div className="bg-green-50 p-6 rounded-lg text-center border-2 border-green-200">
                <h3 className="font-bold text-sm sm:text-base mb-4 text-green-800">食事管理、もう考えなくていい。LINEに送るだけで、AIが全部やる。</h3>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <p>✓ 食事の写真を送るだけ</p>
                  <p>✓ カロリー・PFCを自動記録</p>
                  <p>✓ 相談・質問もLINEで即OK</p>
                </div>
                <a 
                  href="https://lin.ee/S61FXhE"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors font-bold shadow-lg text-sm"
                >
                  今すぐ始める
                </a>
              </div>
            </section>


          </div>
        </div>
      </div>
    </div>
  )
}
