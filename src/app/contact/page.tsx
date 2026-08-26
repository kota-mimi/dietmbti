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
    <main className={`min-h-screen bg-app-gradient text-[#211b18] ${notoSansJP.className}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-surface rounded-[30px] p-6 md:p-10">
          <h1 className="mb-8 text-center text-3xl font-black md:text-4xl">
            お問い合わせ
          </h1>

          <div className="space-y-8">
            <section className="text-center">
              <p className="text-gray-600 mb-6 text-lg">
                ご質問やご意見、ご感想をお気軽にお寄せください。<br/>
                あなたからのメッセージを楽しみにしております。
              </p>
              
              <div className="mt-8 rounded-[22px] border-2 border-[#211b18] bg-[#e6f3ff] p-6 md:p-8">
                <h2 className="mb-4 text-xl font-black text-[#211b18]">お問い合わせメール</h2>
                <a 
                  href="mailto:diet16.contact@gmail.com"
                  className="break-all text-lg font-black text-[#0284c7] underline decoration-2 underline-offset-4"
                >
                  diet16.contact@gmail.com
                </a>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/"
                  className="btn-primary inline-block rounded-full px-8 py-3 font-black text-white transition-all"
                >
                  ホームに戻る
                </Link>
              </div>
            </section>

            {/* LINE広告セクション */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">おすすめサービス</h2>
              <div className="rounded-[22px] border-2 border-[#211b18] bg-[#eaf8ef] p-6 text-center shadow-[4px_4px_0_#211b18]">
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
                  className="inline-block rounded-full border-2 border-[#211b18] bg-green-500 px-5 py-2 font-black text-white shadow-[3px_3px_0_#211b18] transition hover:-translate-y-0.5"
                >
                  今すぐ始める
                </a>
              </div>
            </section>


          </div>
        </div>
      </div>
    </main>
  )
}
