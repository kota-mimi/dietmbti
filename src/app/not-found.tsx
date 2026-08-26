'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft, Salad } from 'lucide-react'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

export default function NotFound() {
  return (
    <main className={`min-h-screen bg-app-gradient text-[#211b18] ${notoSansJP.className}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-screen text-center">
        
        {/* アニメーション付きアイコン */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border-2 border-[#211b18] bg-[#FF7043] shadow-[6px_6px_0_#211b18] md:h-32 md:w-32"
          >
            <Salad className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* エラーメッセージ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-[#FF7043] mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
            ページが見つかりません
          </h2>
          <p className="text-lg text-[#666666] max-w-md mx-auto">
            お探しのページは存在しないか、移動した可能性があります。<br />
            URLをご確認いただくか、トップページに戻ってください。
          </p>
        </motion.div>

        {/* アクションボタン */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(76, 175, 80, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border-2 border-[#211b18] bg-[#0ea5e9] px-8 py-4 text-lg font-black text-white shadow-[4px_4px_0_#211b18] transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              トップページに戻る
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(102, 102, 102, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border-2 border-[#211b18] bg-white px-8 py-4 text-lg font-black text-[#211b18] shadow-[4px_4px_0_#211b18] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            前のページに戻る
          </motion.button>
        </motion.div>

        {/* 装飾的要素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full"
        >
          {[
            { title: "ダイエット診断", desc: "16タイプの性格診断でダイエット方法を発見", link: "/" },
            { title: "質問を見る", desc: "24問の質問でタイプを判定", link: "/quiz/1?restart=1" },
            { title: "タイプ一覧", desc: "16種類のダイエットタイプを確認", link: "/gallery" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="rounded-[22px] border-2 border-[#211b18] bg-white p-6 shadow-[4px_4px_0_#211b18] transition-all duration-200"
            >
              <Link href={item.link}>
                <h3 className="font-bold text-[#333333] mb-2 hover:text-[#4CAF50] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#666666] text-sm">
                  {item.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
