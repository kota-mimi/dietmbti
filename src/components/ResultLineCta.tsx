'use client'

import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
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
      className="relative mx-auto max-w-2xl overflow-hidden rounded-xl border border-[#06C755]/20 bg-emerald-50/70 p-3 shadow-soft sm:rounded-2xl sm:bg-gradient-to-br sm:from-white sm:via-emerald-50/70 sm:to-sky-50 sm:p-6"
      aria-labelledby="line-cta-result-primary"
    >
      {/* スマホ：診断本文を邪魔しない最小限の横長バナー */}
      <div className="flex items-center gap-2.5 sm:hidden">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#06C755] text-white" aria-hidden="true">
          <MessageCircle className="h-4.5 w-4.5 fill-current" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[10px] font-bold text-emerald-700">{typeName}向け</p>
          <h2 id="line-cta-result-primary" className="text-xs font-bold leading-tight text-ink-900">
            LINEで食事管理を続ける
          </h2>
        </div>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#06C755] px-3 py-2 text-[11px] font-bold text-white"
        >
          無料で試す
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* タブレット・PC：価値を短く説明 */}
      <div className="pointer-events-none absolute -right-16 -top-16 hidden h-40 w-40 rounded-full bg-[#06C755]/10 blur-2xl sm:block" />
      <div className="relative hidden flex-col items-center text-center sm:flex">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          診断の次は、今日の一食から
        </span>

        <div className="mt-3 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#06C755] text-white" aria-hidden="true">
            <MessageCircle className="h-5 w-5 fill-current" />
          </span>
          <div className="text-left">
            <p className="text-[11px] font-bold text-emerald-700">{typeName}のあなたへ</p>
            <h2 className="mt-0.5 text-base font-bold leading-snug text-ink-900 md:text-lg">
              LINEで食事管理を続けてみる？
            </h2>
          </div>
        </div>

        <p className="mt-3 max-w-lg text-xs leading-relaxed text-ink-600 md:text-sm">
          {TYPE_MESSAGES[typeCode] ?? 'あなたのタイプに合った食事管理を、無理なく続けよう。'}
        </p>

        <p className="mt-2 text-[11px] text-ink-500">写真を送るだけ · AIが自動記録 · いつでも相談OK</p>

        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mt-4 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#06C755] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(6,199,85,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#05b94f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06C755]"
        >
          LINEで無料ではじめる
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
