'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
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

// ── セクション見出しのトーン（アイコンは使わず、短い下線と小ラベルだけで差をつける）──
const TONES: Record<string, { title: string; rule: string; eyebrow: string }> = {
  neutral: { title: 'text-ink-900', rule: 'bg-brand-300', eyebrow: 'text-ink-300' },
  brand: { title: 'text-ink-900', rule: 'bg-brand-500', eyebrow: 'text-brand-500' },
  accent: { title: 'text-ink-900', rule: 'bg-accent-500', eyebrow: 'text-accent-500' },
  warn: { title: 'text-ink-900', rule: 'bg-rose-400', eyebrow: 'text-rose-500' },
  good: { title: 'text-ink-900', rule: 'bg-emerald-500', eyebrow: 'text-emerald-600' },
}

function SectionHead({ eyebrow, title, tone = 'neutral' }: { eyebrow?: string; title: string; tone?: keyof typeof TONES }) {
  const t = TONES[tone]
  return (
    <header className="text-center">
      {eyebrow && (
        <p className={`mb-1.5 text-[11px] font-bold tracking-[0.28em] ${t.eyebrow}`}>{eyebrow}</p>
      )}
      <h2 className={`text-2xl font-bold md:text-[27px] ${t.title} ${zenMaruGothic.className}`}>{title}</h2>
      <span className={`mx-auto mt-3 block h-[3px] w-9 rounded-full ${t.rule}`} />
    </header>
  )
}

function Prose({ text, className = '' }: { text: string; className?: string }) {
  const sentences = text.split('。').map((s) => s.trim()).filter(Boolean)
  return (
    <div className={`space-y-3 text-left text-[15px] leading-relaxed text-ink-700 md:text-base ${className}`}>
      {sentences.map((s, i) => (
        <p key={i}>{s}。</p>
      ))}
    </div>
  )
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// 傾向グラフ用の軸メタ（positiveスコア→ right 側の極）
const AXES = [
  { idx: 0, left: { code: 'G', label: 'みんなで型' }, right: { code: 'S', label: 'ソロ型' } },
  { idx: 1, left: { code: 'E', label: '気分型' }, right: { code: 'R', label: '計画型' } },
  { idx: 2, left: { code: 'C', label: 'カロリー型' }, right: { code: 'F', label: '質重視型' } },
  { idx: 3, left: { code: 'L', label: 'じっくり型' }, right: { code: 'Q', label: '短期集中型' } },
] as const
const axisKeys: (keyof Score)[] = ['SG', 'RE', 'FC', 'QL']

const CAUSE_TITLES: Record<string, string> = {
  SRFQ: '目標達成後の爆発（リバウンド）', SRFL: 'ストレスの抱え込みすぎ', SRCQ: '「ヘルシーなもの」の食べすぎ',
  SRCL: '停滞期への過剰反応', SEFQ: '買ったことで満足症候群', SEFL: '「体にいいもの」なら太らないという誤解',
  SECQ: '「明日からやる」の無限ループ', SECL: '「最適な方法」を探しすぎて動けない', GRFQ: '「付き合い」での飲み食い',
  GRFL: '「ご褒美」の頻度が高い', GRCQ: '無理な減量による反動', GRCL: '「監督」ポジションへの安住',
  GEFQ: '「やってみた動画」で満足', GEFL: '「ご褒美スタバ」の常習化', GECQ: '「頭でっかち」による行動不全',
  GECL: '自分への甘さが糖度120%',
}
const SOLUTION_TITLES: Record<string, string> = {
  SRFQ: 'チートデイの「義務化」', SRFL: '匿名アカウントでの発散', SRCQ: 'アプリへの完全服従',
  SRCL: 'ハビットトラッカーで記録', SEFQ: '飽きる前提の「味変」戦略', SEFL: '「見た目」の変化を楽しむ',
  SECQ: '「夜だけ」管理法', SECL: '「思考停止」の実践', GRFQ: '「宣言」による退路遮断',
  GRFL: 'プレイングマネージャーになる', GRCQ: '「賭け」の要素を取り入れる', GRCL: '「プレイヤー」に戻る宣言',
  GEFQ: '「次々と乗り換える」サーキット', GEFL: '「憧れの服」を先に買う', GECQ: '「誰かに教える」ために実践する',
  GECL: 'ハードルを地面に埋める',
}

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
      router.push('/')
      return
    }

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
      handleDownloadImage()
      return
    }

    const characterSlug = characterSlugs[userType]
    const shareUrl = `${window.location.origin}/character/${characterSlug}`
    const shareText = `【ダイエットタイプ診断】\n私は「${typeData.name}」タイプでした！\n${typeData.catchcopy}\n\nあなたの"痩せ方のクセ"は？無料でわかる👇\n${shareUrl}\n\n#ダイエットキャラ診断16`

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
  }

  const handleDownloadImage = async () => {
    try {
      const typeData = diagramTypes[userType]
      if (!typeData) {
        alert('診断結果が見つかりませんでした。もう一度診断してください。')
        return
      }

      const imageUrl = `/characters/${userType}_new3.png`
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('画像の取得に失敗しました')
      }

      const blob = await response.blob()
      const file = new File([blob], `${typeData.name}.png`, { type: 'image/png' })

      if (navigator.share) {
        const shareUrl = `${window.location.origin}/result`
        const shareData = {
          title: `私のダイエットタイプは「${typeData.name}」`,
          text: `${typeData.catchcopy}\n\nダイエットキャラ診断16で診断してみて！\n${shareUrl}`,
          files: [file],
        }

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${typeData.name}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('画像を保存しました。SNSアプリで共有できます。')
    } catch (error) {
      console.error('画像共有エラー:', error)
      alert('画像の保存に失敗しました。もう一度お試しください。')
    }
  }

  const handleCopyLink = () => {
    const typeData = diagramTypes[userType]
    if (!typeData) return
    const characterSlug = characterSlugs[userType]
    const shareUrl = `${window.location.origin}/character/${characterSlug}`
    navigator.clipboard.writeText(shareUrl)
    alert('リンクをコピーしました。')
  }

  const handleRestart = () => {
    localStorage.removeItem('diet-quiz-answers')
    localStorage.removeItem('diet-quiz-result-type')
    router.push('/quiz/1?restart=1')
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-app-gradient flex items-center justify-center ${notoSansJP.className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
          <h1 className="text-2xl font-bold text-ink-900 mb-4">結果を表示できませんでした</h1>
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

  return (
    <div className={`min-h-screen bg-app-gradient ${notoSansJP.className}`}>
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">

        {/* メインカード */}
        <motion.div
          id="result-card"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="card-surface overflow-hidden rounded-3xl px-5 py-10 md:px-12 md:py-14"
        >

          {/* ── ヒーロー：タイプ名を主役に ── */}
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] font-bold tracking-[0.32em] text-ink-300">あなたのダイエットタイプ</p>

            <div className="relative mt-4 w-full max-w-[19rem]">
              <div className="absolute inset-x-8 bottom-2 top-8 rounded-[45%] bg-brand-100/60 blur-2xl" aria-hidden="true" />
              {!imageError ? (
                <Image
                  src={`/characters/${userType}_new3.png`}
                  alt={`${typeData.name}のキャラクター`}
                  width={1024}
                  height={1024}
                  className="relative h-auto w-full"
                  quality={95}
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="relative py-10 text-4xl font-bold text-ink-900">{typeData.name}</div>
              )}
            </div>

            <span className="mt-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-brand-600">
              {userType}
            </span>
            <h1 className={`mt-3 text-[34px] font-bold leading-tight text-ink-900 md:text-5xl ${zenMaruGothic.className}`}>
              {typeData.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-brand-600 md:text-xl">{typeData.catchcopy}</p>
          </div>

          {/* ── 本文セクション群 ── */}
          <div className="mt-14 space-y-14">

            {/* あなただけの診断（感情のピークを先頭に） */}
            {personal && (
              <Section className="space-y-4">
                <SectionHead eyebrow="4つの軸から" title="あなただけの診断" tone="accent" />
                <div className="mx-auto max-w-2xl rounded-2xl border border-accent-200 bg-gradient-to-br from-white to-accent-50/70 p-5 shadow-soft md:p-6">
                  <p className="text-base font-semibold leading-relaxed text-ink-900">{personal.headline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{personal.extremeness}</p>
                  {personal.secondFace && (
                    <div className="mt-4 rounded-xl border-l-[3px] border-accent-400 bg-accent-50 px-4 py-3">
                      <p className="text-sm leading-relaxed text-ink-700">
                        <span className="font-bold text-accent-600">隠れた二面性　</span>
                        {personal.secondFace}
                      </p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* あるある（共感） */}
            <Section className="space-y-5">
              <SectionHead eyebrow="共感度チェック" title={`${typeData.name}あるある`} tone="neutral" />
              <p className="text-center text-xs text-ink-400">いくつ当てはまる…？</p>
              <ul className="mx-auto max-w-2xl space-y-2.5">
                {typeData.relatable.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-left text-sm leading-relaxed text-ink-700 md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* 傾向グラフ */}
            {axisScores && (
              <Section className="space-y-6">
                <SectionHead eyebrow="4軸バランス" title="あなたの傾向" tone="brand" />
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
                          <div className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-brand-200" />
                          <div
                            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow"
                            style={{ left: `${markerPct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Section>
            )}

            {/* 基本生態 */}
            <Section className="space-y-6">
              <SectionHead eyebrow="どんな人？" title="基本生態" tone="neutral" />
              <div className="mx-auto max-w-2xl">
                <Prose text={typeData.detailedEcology} />
              </div>
            </Section>

            {/* あなたの強み */}
            <Section className="space-y-6">
              <SectionHead eyebrow="実はすごい" title="あなたの強み" tone="brand" />
              <div className="mx-auto max-w-2xl rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 md:p-6">
                <p className="text-left text-[15px] leading-relaxed text-ink-700 md:text-base">{typeData.strengths}</p>
              </div>
            </Section>

            {/* 太る原因 */}
            <Section className="space-y-6">
              <SectionHead eyebrow="つまずきポイント" title="太る原因" tone="warn" />
              <div className="mx-auto max-w-2xl space-y-4">
                <p className="text-center text-base font-bold text-rose-600 md:text-lg">
                  {CAUSE_TITLES[userType] ?? typeData.causeTitle}
                </p>
                <Prose text={typeData.fatCause} />
              </div>
            </Section>

            {/* あなただけの痩せ方 */}
            <Section className="space-y-6">
              <SectionHead eyebrow="攻略法" title="あなただけの痩せ方" tone="good" />
              <div className="mx-auto max-w-2xl space-y-4">
                <p className="text-center text-base font-bold text-emerald-600 md:text-lg">
                  {SOLUTION_TITLES[userType] ?? typeData.solutionTitle}
                </p>
                <Prose text={typeData.solution} />
              </div>
            </Section>

            {/* 相性チェック */}
            <Section className="space-y-8">
              <SectionHead eyebrow="人間関係" title="相性チェック" tone="neutral" />
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 md:grid-cols-2">
                {/* 最高の相性 */}
                <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                    <Image
                      src={`/characters/${typeData.compatibility.good.type}_gallery.png`}
                      alt=""
                      width={200}
                      height={200}
                      className="h-32 w-auto"
                    />
                  </div>
                  <div className="relative">
                    <p className="text-center text-[11px] font-bold tracking-[0.2em] text-brand-500">ベストな相棒</p>
                    <h3 className={`mt-1 text-center text-lg font-bold text-ink-900 ${zenMaruGothic.className}`}>
                      {diagramTypes[typeData.compatibility.good.type]?.name || typeData.compatibility.good.type}
                    </h3>
                    <div className="mt-3 text-left text-sm leading-relaxed text-ink-700">
                      {typeData.compatibility.good.reason}
                    </div>
                  </div>
                </div>

                {/* 要注意 */}
                <div className="relative overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                    <Image
                      src={`/characters/${typeData.compatibility.bad.type}_gallery.png`}
                      alt=""
                      width={200}
                      height={200}
                      className="h-32 w-auto"
                    />
                  </div>
                  <div className="relative">
                    <p className="text-center text-[11px] font-bold tracking-[0.2em] text-rose-500">要注意な相手</p>
                    <h3 className={`mt-1 text-center text-lg font-bold text-ink-900 ${zenMaruGothic.className}`}>
                      {diagramTypes[typeData.compatibility.bad.type]?.name || typeData.compatibility.bad.type}
                    </h3>
                    <div className="mt-3 text-left text-sm leading-relaxed text-ink-700">
                      {typeData.compatibility.bad.reason}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        </motion.div>

        {/* ── シェア（価値を出し切った直後に）── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 max-w-md text-center"
        >
          <p className={`text-lg font-bold text-ink-900 ${zenMaruGothic.className}`}>この結果、当たってた？</p>
          <p className="mt-1 text-sm text-ink-500">友だちに送って「どのタイプか」当ててもらおう</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => handleShare('line')}
              className="rounded-full bg-[#06C755] px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              LINEで送る
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Xでシェア
            </button>
            <button
              onClick={handleCopyLink}
              className="rounded-full border border-brand-200 bg-white px-6 py-2.5 text-sm font-bold text-ink-700 transition-transform hover:-translate-y-0.5"
            >
              リンクをコピー
            </button>
            <button
              onClick={handleDownloadImage}
              className="rounded-full border border-brand-200 bg-white px-6 py-2.5 text-sm font-bold text-ink-700 transition-transform hover:-translate-y-0.5"
            >
              画像を保存
            </button>
          </div>
        </motion.div>

        {/* おすすめアイテム（PRとして正直に表示） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <SectionHead eyebrow="PR" title="おすすめアイテム" tone="neutral" />
          <div className="mt-5 space-y-3">
            <a
              href="https://amzn.to/49Wtvvx"
              className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
              target="_blank"
              rel="nofollow noopener"
            >
              <span className="font-semibold text-ink-900">Amazonでダイエット関連商品を見る</span>
              <span className="text-brand-500 transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="https://hb.afl.rakuten.co.jp/hgc/5073158d.7e26866e.5073158e.c2bfcaea/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F%25E3%2583%2580%25E3%2582%25A4%25E3%2582%25A8%25E3%2583%2583%25E3%2583%2588%2F%3Fs%3D5&link_type=hybrid_url&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6Imh5YnJpZF91cmwiLCJjb2wiOjF9"
              className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
              target="_blank"
              rel="nofollow noopener"
            >
              <span className="font-semibold text-ink-900">楽天でダイエット商品を探す</span>
              <span className="text-brand-500 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* A8アフィリエイトバナー */}
        <div className="mt-8 flex justify-center">
          <A8AffiliateBanner />
        </div>

        {/* もう一度診断 */}
        <div className="mt-10 text-center">
          <button
            onClick={handleRestart}
            className={`btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-bold text-white ${notoSansJP.className}`}
          >
            もう一度診断する
          </button>
        </div>

      </div>
    </div>
  )
}
