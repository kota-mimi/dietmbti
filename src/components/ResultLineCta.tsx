'use client'

import { ArrowRight, Camera, MessageCircle, Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const LINE_URL = 'https://lin.ee/S61FXhE'

const TYPE_MESSAGES: Record<string, string> = {
  SRFQ: '頑張りすぎと反動を防ぐ、無理のない食事管理を。',
  SRFL: '人に見せなくても続けられる、静かな食事サポートを。',
  SRCQ: 'カロリーやPFCの計算はAIに任せて、判断疲れを減らそう。',
  SRCL: '記録を味方にして、停滞期でも迷わない食事管理を。',
  SEFQ: '飽きても大丈夫。毎日の小さな変化で楽しく続けよう。',
  SEFL: '感覚を大切にしながら、食事のバランスも整えよう。',
  SECQ: '夜の食べすぎを責めずに、毎日の記録から整えよう。',
  SECL: '調べすぎる前に、今日の一食から一緒に始めよう。',
  GRFQ: '前向きな勢いを、続けられる食事習慣に変えよう。',
  GRFL: '人を支えるのと同じように、自分の食事も整えよう。',
  GRCQ: '攻めすぎない減量ペースを、毎日の記録でつくろう。',
  GRCL: 'みんなの管理だけでなく、自分の一歩も一緒に始めよう。',
  GEFQ: '新鮮さを楽しみながら、途切れにくい習慣をつくろう。',
  GEFL: '見た目のモチベーションを、実際の食事改善につなげよう。',
  GECQ: '豊富な知識を、今日から実行できる一手に変えよう。',
  GECL: 'ハードルは低くてOK。写真を送るだけから始めよう。',
}

interface ResultLineCtaProps {
  typeCode: string
  typeName: string
}

export default function ResultLineCta({
  typeCode,
  typeName,
}: ResultLineCtaProps) {
  const handleClick = () => {
    trackEvent('line_click', {
      placement: 'result_primary',
      character_type: typeCode,
      character_name: typeName,
    })
  }

  return (
    <section
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#06C755]/25 bg-gradient-to-br from-white via-emerald-50 to-sky-50 p-6 shadow-card md:p-8"
      aria-labelledby="line-cta-result-primary"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#06C755]/10 blur-2xl" />
      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06C755]/10 px-3 py-1 text-xs font-bold text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          診断の次は、今日の一食から
        </span>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#06C755] text-white shadow-soft md:h-16 md:w-16" aria-hidden="true">
            <MessageCircle className="h-7 w-7 fill-current md:h-8 md:w-8" />
          </span>
          <div className="text-left">
            <p className="text-xs font-bold tracking-wider text-emerald-700">{typeName}のあなたへ</p>
            <h2 id="line-cta-result-primary" className="mt-1 text-xl font-bold leading-snug text-ink-900 md:text-2xl">
              あなた専用の食事サポートを
              <br className="hidden sm:block" />LINEで始めませんか？
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-ink-700 md:text-base">
          {TYPE_MESSAGES[typeCode] ?? 'あなたのタイプに合った食事管理を、無理なく続けよう。'}
        </p>

        <div className="mt-5 grid w-full max-w-lg grid-cols-1 gap-2 text-left text-sm text-ink-700 sm:grid-cols-3">
          <span className="flex items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-2.5"><Camera className="h-4 w-4 text-emerald-600" />写真を送るだけ</span>
          <span className="flex items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-2.5"><Sparkles className="h-4 w-4 text-emerald-600" />AIが自動記録</span>
          <span className="flex items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-2.5"><MessageCircle className="h-4 w-4 text-emerald-600" />いつでも相談OK</span>
        </div>

        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mt-5 inline-flex w-full max-w-lg items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-4 text-base font-bold text-white shadow-[0_10px_25px_-8px_rgba(6,199,85,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#05b94f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06C755]"
        >
          LINEで食事サポートを始める
          <ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-2 text-xs text-ink-500">友だち追加後、すぐにLINEで利用できます</p>
      </div>
    </section>
  )
}
