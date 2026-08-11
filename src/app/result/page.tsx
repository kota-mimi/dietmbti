'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Twitter, Instagram, Download, Copy, Sparkles, AlertTriangle, Leaf, ShoppingBag, Heart, RefreshCw, BarChart3, CheckCircle2, Star } from 'lucide-react'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Noto_Sans_JP, Zen_Maru_Gothic } from 'next/font/google'
import { getTypeFromAnswers, calculateScore } from '@/lib/scoring'
import { getPersonalReading } from '@/utils/personalize'
import { diagramTypes } from '@/data/diagramTypes'
import { Answer, Score } from '@/types'
import A8AffiliateBanner from '@/components/A8AffiliateBanner'
import { characterSlugs } from '@/data/characterSlugs'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function ResultPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [axisScores, setAxisScores] = useState<Score | null>(null)

  useEffect(() => {
    // 回答（24問）が保存されていれば取り出す
    let answers: Answer[] | null = null
    const savedAnswers = localStorage.getItem('diet-quiz-answers')
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers)
        if (Array.isArray(parsed) && parsed.length === 24) {
          answers = parsed
        }
      } catch {
        answers = null
      }
    }

    // タイプの決定：保存済みタイプ優先、なければ回答から計算
    const savedType = localStorage.getItem('diet-quiz-result-type')
    let typeCode = ''
    if (savedType && diagramTypes[savedType]) {
      typeCode = savedType
    } else if (answers) {
      typeCode = getTypeFromAnswers(answers)
    } else {
      // 有効なデータがない場合はトップへ
      router.push('/')
      return
    }

    // 各軸のスコア（傾向グラフ用）は回答があるときだけ算出
    if (answers) {
      setAxisScores(calculateScore(answers))
    }
    setUserType(typeCode)
    setIsLoading(false)
  }, [router])

  const handleShare = (platform: string) => {
    const typeData = diagramTypes[userType]
    if (!typeData) return

    if (platform === 'instagram') {
      // Instagramの場合は画像共有機能を使用
      handleDownloadImage()
      return
    }

    // キャラクター個別ページのURLを生成
    const characterSlug = characterSlugs[userType]
    const shareUrl = `${window.location.origin}/character/${characterSlug}`
    const shareText = `私のダイエットタイプは「${typeData.name}」でした${typeData.emoji}\n${typeData.catchcopy}\n\nあなたも診断してみて👇\n${shareUrl}\n\n#ダイエットキャラ診断16`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
  }

  const handleLineMenuRequest = () => {
    window.open('https://lin.ee/S61FXhE', '_blank')
  }

  const handleDownloadImage = async () => {
    try {
      const typeData = diagramTypes[userType]
      if (!typeData) {
        alert('エラー: 診断結果が見つかりません。')
        return
      }

      // キャラクター画像のURLを取得
      const imageUrl = `/characters/${userType}_new3.png`
      
      // 画像をfetchしてblobに変換
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('画像の取得に失敗しました')
      }
      
      const blob = await response.blob()
      const file = new File([blob], `${typeData.name}.png`, { type: 'image/png' })

      // Web Share API対応チェック
      if (navigator.share) {
        // 一時的に診断結果ページに誘導（ドメイン移行中のため）
        const shareUrl = `${window.location.origin}/result`
        const shareData = {
          title: `私のダイエットタイプは「${typeData.name}」`,
          text: `${typeData.catchcopy}\n\nダイエットキャラ診断16で診断してみて！\n${shareUrl}`,
          files: [file]
        }

        // ファイル共有が可能かチェック
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      }

      // Web Share API非対応またはファイル共有非対応の場合は画像ダウンロード
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${typeData.name}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('画像をダウンロードしました！SNSアプリで共有してください。')

    } catch (error) {
      console.error('画像共有エラー:', error)
      alert('画像の共有に失敗しました。')
    }
  }

  const handleCopyLink = () => {
    const typeData = diagramTypes[userType]
    if (!typeData) return
    // キャラクター個別ページのURLを生成
    const characterSlug = characterSlugs[userType]
    const shareUrl = `${window.location.origin}/character/${characterSlug}`
    navigator.clipboard.writeText(shareUrl)
    alert('リンクをコピーしました！')
  }

  const handleRestart = () => {
    localStorage.removeItem('diet-quiz-answers')
    router.push('/quiz/1')
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-app-gradient flex items-center justify-center ${notoSansJP.className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const typeData = diagramTypes[userType]
  const personal = axisScores ? getPersonalReading(axisScores, userType) : null
  if (!typeData) {
    return (
      <div className={`min-h-screen bg-app-gradient flex items-center justify-center ${notoSansJP.className}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900 mb-4">エラーが発生しました</h1>
          <button
            onClick={handleRestart}
            className="btn-primary text-white px-6 py-3 rounded-full font-bold transition-colors"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    )
  }

  // 傾向グラフ用の軸メタ情報（positiveスコア→ right 側の極）
  const AXES = [
    { idx: 0, left: { code: 'G', label: 'みんなで型' }, right: { code: 'S', label: 'ソロ型' } },
    { idx: 1, left: { code: 'E', label: '気分型' }, right: { code: 'R', label: '計画型' } },
    { idx: 2, left: { code: 'C', label: 'カロリー型' }, right: { code: 'F', label: '質重視型' } },
    { idx: 3, left: { code: 'L', label: 'じっくり型' }, right: { code: 'Q', label: '短期集中型' } },
  ] as const
  const axisKeys: (keyof Score)[] = ['SG', 'RE', 'FC', 'QL']

  return (
    <div className={`min-h-screen bg-app-gradient ${notoSansJP.className}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* メインコンテンツカード */}
        <motion.div
          id="result-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="card-surface rounded-3xl p-6 md:p-12"
        >
          
          {/* キャラクター画像とタイトル */}
          <div className="mb-16">
            {/* キャラクター画像を中央配置 */}
            <div className="flex justify-center items-center">
              {/* キャラクター画像 */}
              <div className="text-center">
                {!imageError ? (
                  <Image
                    src={`/characters/${userType}_new3.png`}
                    alt={`${typeData.name}のキャラクター`}
                    width={1024}
                    height={1024}
                    className="w-full max-w-md h-auto"
                    quality={95}
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div className="text-6xl drop-shadow-xl sm:text-7xl md:text-8xl">{typeData.emoji}</div>
                )}
              </div>

            </div>

            {/* タイプ名・キャッチコピー */}
            <div className="mt-4 text-center">
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold tracking-[0.2em] text-brand-600">
                {userType}
              </span>
              <h1 className={`mt-3 text-3xl font-bold text-ink-900 md:text-4xl ${zenMaruGothic.className}`}>
                {typeData.name}
              </h1>
              <p className="mt-2 text-base font-medium text-brand-600 md:text-lg">
                {typeData.catchcopy}
              </p>
            </div>

            {/* 広告バナーエリア（無効化） */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mt-8"
            >
              <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <Image
                    src="/ads/line-app-ad.png"
                    alt="LINEアプリ広告"
                    width={500}
                    height={300}
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      window.open('https://lin.ee/S61FXhE', '_blank')
                    }}
                    quality={95}
                  />
                </div>
              </div>
            </motion.div> */}
          </div>

          {/* セクションごとの直接配置 */}
          <div className="space-y-10">

          {/* あなたの傾向グラフ */}
          {axisScores && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <h2 className={`text-2xl font-bold text-ink-900 ${zenMaruGothic.className}`}>
                  あなたの傾向
                </h2>
              </div>

              <div className="mx-auto max-w-2xl space-y-5">
                {AXES.map((axis, i) => {
                  const score = axisScores[axisKeys[i]]
                  const markerPct = Math.min(96, Math.max(4, ((score + 18) / 36) * 100))
                  const userLetter = userType[axis.idx]
                  const leftActive = userLetter === axis.left.code
                  const rightActive = userLetter === axis.right.code
                  const lean = Math.abs(score)
                  const strength = lean >= 12 ? 'かなり' : lean >= 6 ? 'やや' : 'ちょっと'
                  return (
                    <div key={axis.idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold md:text-sm">
                        <span className={leftActive ? 'text-brand-600' : 'text-ink-300'}>
                          {leftActive && lean >= 1 ? `${strength} ` : ''}{axis.left.label}
                        </span>
                        <span className={rightActive ? 'text-brand-600' : 'text-ink-300'}>
                          {rightActive && lean >= 1 ? `${strength} ` : ''}{axis.right.label}
                        </span>
                      </div>
                      <div className="relative h-2.5 rounded-full bg-brand-100">
                        {/* 中央ライン */}
                        <div className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-brand-200" />
                        {/* マーカー */}
                        <div
                          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow"
                          style={{ left: `${markerPct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="text-center text-xs text-ink-500">
                あなたのタイプは <span className="font-bold text-brand-600">{userType}</span> ―「{typeData.name}」。4つの軸のバランスで16タイプに分かれます。
              </p>
            </motion.div>
          )}

          {/* あなただけのパーソナル診断セクション */}
          {personal && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 text-accent-500">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className={`text-2xl font-bold text-ink-900 ${zenMaruGothic.className}`}>
                  あなただけの診断
                </h2>
              </div>

              <div className="mx-auto max-w-2xl rounded-2xl border border-accent-200 bg-gradient-to-br from-white to-accent-50/60 p-5 shadow-soft md:p-6">
                <p className="text-[15px] leading-relaxed text-ink-800 md:text-base">
                  {personal.headline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {personal.extremeness}
                </p>
                {personal.secondFace && (
                  <div className="mt-4 flex gap-2 rounded-xl bg-accent-100/50 px-4 py-3">
                    <span className="shrink-0 text-lg leading-none">🎭</span>
                    <p className="text-sm leading-relaxed text-ink-700">
                      <span className="font-bold text-accent-600">隠れた二面性：</span>
                      {personal.secondFace}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 基本生態セクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-ink-900 ${zenMaruGothic.className}`}>
                基本生態
              </h2>
            </div>
            <div className="text-sm md:text-base leading-relaxed text-gray-700 space-y-4 max-w-4xl mx-auto text-left">
              {typeData.detailedEcology.split('。').map((sentence, index, array) => (
                <p key={index} className="mb-4">
                  {sentence.trim()}
                  {index < array.length - 1 && sentence.trim() && '。'}
                </p>
              ))}
            </div>
          </motion.div>

          {/* あるあるセクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-ink-900 ${zenMaruGothic.className}`}>
                {typeData.name}あるある
              </h2>
            </div>
            <p className="text-center text-xs text-ink-500">いくつ当てはまる…？</p>
            <div className="mx-auto max-w-2xl">
              <ul className="space-y-3">
                {typeData.relatable.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <span className="text-left text-sm leading-relaxed text-ink-700 md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* あなたの強みセクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Star className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-brand-600 ${zenMaruGothic.className}`}>
                あなたの強み
              </h2>
            </div>
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 md:p-6">
                <p className="text-left text-sm leading-relaxed text-ink-700 md:text-base">
                  {typeData.strengths}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 太る原因セクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-red-600 ${zenMaruGothic.className}`}>
                太る原因
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-bold text-red-700 text-center">
                  {
                    userType === 'SRFQ' ? '目標達成後の爆発（リバウンド）' :
                    userType === 'SRFL' ? 'ストレスの抱え込みすぎ' :
                    userType === 'SRCQ' ? '『ヘルシーなもの』の食べすぎ' :
                    userType === 'SRCL' ? '停滞期への過剰反応' :
                    userType === 'SEFQ' ? '買ったことで満足症候群' :
                    userType === 'SEFL' ? '『体にいいもの』なら太らないという誤解' :
                    userType === 'SECQ' ? '『明日からやる』の無限ループ' :
                    userType === 'SECL' ? '『最適な方法』を探しすぎて動けない' :
                    userType === 'GRFQ' ? '『付き合い』での飲み食い' :
                    userType === 'GRFL' ? '『ご褒美』の頻度が高い' :
                    userType === 'GRCQ' ? '無理な減量による反動' :
                    userType === 'GRCL' ? '『監督』ポジションへの安住' :
                    userType === 'GEFQ' ? '『やってみた動画』で満足' :
                    userType === 'GEFL' ? '『ご褒美スタバ』の常習化' :
                    userType === 'GECQ' ? '『頭でっかち』による行動不全' :
                    '自分への甘さが糖度120%'
                  }
                </h3>
                <div className="text-sm md:text-base leading-relaxed text-gray-700 space-y-4 text-left">
                  {typeData.fatCause.split('。').map((sentence, index, array) => (
                    <p key={index} className="mb-4">
                      {sentence.trim()}
                      {index < array.length - 1 && sentence.trim() && '。'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* あなただけの痩せ方セクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Leaf className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-green-600 ${zenMaruGothic.className}`}>
                あなただけの痩せ方
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-bold text-green-700 text-center">
                  {
                    userType === 'SRFQ' ? 'チートデイの『義務化』' :
                    userType === 'SRFL' ? '匿名アカウントでの発散' :
                    userType === 'SRCQ' ? '『ヘルシーくん』への完全服従' :
                    userType === 'SRCL' ? '『ヘルシーくん』での記録習慣' :
                    userType === 'SEFQ' ? '飽きる前提の『味変』戦略' :
                    userType === 'SEFL' ? '『見た目』の変化を楽しむ' :
                    userType === 'SECQ' ? '『夜だけ』管理法' :
                    userType === 'SECL' ? '『思考停止』の実践' :
                    userType === 'GRFQ' ? '『宣言』による退路遮断' :
                    userType === 'GRFL' ? '『料理教室』や『サークル』へ参加' :
                    userType === 'GRCQ' ? '『賭け』の要素を取り入れる' :
                    userType === 'GRCL' ? '『プレイヤー』に戻る宣言' :
                    userType === 'GEFQ' ? '『次々と乗り換える』サーキット' :
                    userType === 'GEFL' ? '『憧れの服』を先に買う' :
                    userType === 'GECQ' ? '『誰かに教える』ために実践する' :
                    '『ハードルを地面に埋める』'
                  }
                </h3>
                <div className="text-sm md:text-base leading-relaxed text-gray-700 space-y-4 text-left">
                  {typeData.solution.split('。').map((sentence, index, array) => (
                    <p key={index} className="mb-4">
                      {sentence.trim()}
                      {index < array.length - 1 && sentence.trim() && '。'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* おすすめアイテムセクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <h2 className={`text-xl font-bold text-purple-600 ${zenMaruGothic.className}`}>
                おすすめアイテム
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {/* Amazon */}
                <a 
                  href="https://amzn.to/49Wtvvx" 
                  className="group flex items-center justify-between rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-ink-900">Amazonでダイエット関連商品をチェック</span>
                  </div>
                  <span className="text-blue-500 transition-transform group-hover:translate-x-1">→</span>
                </a>

                {/* 楽天 */}
                <a 
                  href="https://hb.afl.rakuten.co.jp/hgc/5073158d.7e26866e.5073158e.c2bfcaea/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2583%2580%25E3%2582%25A4%25E3%2582%25A8%25E3%2583%2583%25E3%2583%2588%2F%3Fs%3D5&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9" 
                  className="group flex items-center justify-between rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-pink-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-ink-900">楽天でダイエット商品を探す</span>
                  </div>
                  <span className="text-red-500 transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* 相性チェックセクション */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                <Heart className="h-5 w-5" />
              </span>
              <h2 className={`text-2xl font-bold text-pink-500 ${zenMaruGothic.className}`}>
                相性チェック
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* 最高の相性 */}
                <div className="bg-pink-50/90 backdrop-blur-sm rounded-lg p-6 border border-pink-200 relative overflow-hidden">
                  {/* 背景キャラクター画像 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                    <div className="animate-bounce-slow">
                      <Image
                        src={`/characters/${typeData.compatibility.good.type}_gallery.png`}
                        alt={`${diagramTypes[typeData.compatibility.good.type]?.name || typeData.compatibility.good.type}のキャラクター`}
                        width={200}
                        height={240}
                        className="w-32 h-auto"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-3 relative">
                    <h3 className="text-lg font-bold text-pink-600">最高の相性</h3>
                    <h4 className="text-lg font-bold text-gray-800">
                      {diagramTypes[typeData.compatibility.good.type]?.name || typeData.compatibility.good.type}
                    </h4>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700 mt-4 text-left">
                    {typeData.compatibility.good.reason.split('。').map((sentence, index, array) => (
                      <p key={index} className={index < array.length - 1 ? 'mb-2' : ''}>
                        {sentence.trim()}
                        {index < array.length - 1 && sentence.trim() && '。'}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 要注意 */}
                <div className="bg-purple-50/90 backdrop-blur-sm rounded-lg p-6 border border-purple-200 relative overflow-hidden">
                  {/* 背景キャラクター画像 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                    <div className="animate-float">
                      <Image
                        src={`/characters/${typeData.compatibility.bad.type}_gallery.png`}
                        alt={`${diagramTypes[typeData.compatibility.bad.type]?.name || typeData.compatibility.bad.type}のキャラクター`}
                        width={200}
                        height={240}
                        className="w-32 h-auto"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-3 relative">
                    <h3 className="text-lg font-bold text-purple-600">要注意</h3>
                    <h4 className="text-lg font-bold text-gray-800">
                      {diagramTypes[typeData.compatibility.bad.type]?.name || typeData.compatibility.bad.type}
                    </h4>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700 mt-4 text-left">
                    {typeData.compatibility.bad.reason.split('。').map((sentence, index, array) => (
                      <p key={index} className={index < array.length - 1 ? 'mb-2' : ''}>
                        {sentence.trim()}
                        {index < array.length - 1 && sentence.trim() && '。'}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          </div>

        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-8 max-w-md mx-auto space-y-6"
        >
          
          {/* Share Section */}
          <div className="space-y-4">
            <h3 className={`text-center text-gray-600 font-medium ${notoSansJP.className}`}>
              結果をシェアする
            </h3>
            
            {/* Horizontal Icon Row */}
            <div className="flex flex-row gap-4 justify-center">
              {/* Copy Link */}
              <motion.button
                onClick={handleCopyLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                title="リンクをコピー"
              >
                <Copy className="w-5 h-5" />
              </motion.button>

              {/* Instagram */}
              <motion.button
                onClick={() => handleShare('instagram')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-gradient-to-r from-[#E4405F] via-[#C13584] to-[#833AB4] hover:opacity-90 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                title="Instagram Storyにシェア"
              >
                <Instagram className="w-5 h-5" />
              </motion.button>

              {/* X (Twitter) */}
              <motion.button
                onClick={() => handleShare('twitter')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                title="X (Twitter) にシェア"
              >
                <Twitter className="w-5 h-5" />
              </motion.button>

              {/* Download */}
              <motion.button
                onClick={handleDownloadImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                title="画像をダウンロード"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="text-center pt-8 space-y-4">
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`btn-primary inline-flex items-center gap-2 text-white px-8 py-3 rounded-full font-bold text-lg ${notoSansJP.className}`}
            >
              <RefreshCw className="h-5 w-5" />
              もう一度診断する
            </motion.button>
          </div>

          {/* A8アフィリエイトバナー */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <A8AffiliateBanner />
          </motion.div>

        </motion.div>
        
      </div>
    </div>
  )
}