import { Score } from '@/types'
import { diagramTypes } from '@/data/diagramTypes'

// 各軸の「強さ」から、その人だけのパーソナル文を組み立てる。
// スコアは各軸 -18〜+18。強度しきい値は傾向グラフと揃える（かなり≥12 / やや≥6 / それ未満=ちょっと）。

type Letter = 'S' | 'G' | 'R' | 'E' | 'F' | 'C' | 'Q' | 'L'
type Intensity = 'strong' | 'mid' | 'light'

// userType の各文字位置に対応する軸メタ（positiveスコア→ right 側の極）
const AXIS_META = [
  { key: 'SG' as keyof Score, pos: { code: 'S' as Letter, label: 'ソロ' }, neg: { code: 'G' as Letter, label: 'みんな' }, contrast: 'ソロ ⇔ みんな' },
  { key: 'RE' as keyof Score, pos: { code: 'R' as Letter, label: '計画' }, neg: { code: 'E' as Letter, label: '気分' }, contrast: '計画 ⇔ 気分' },
  { key: 'FC' as keyof Score, pos: { code: 'F' as Letter, label: '質重視' }, neg: { code: 'C' as Letter, label: 'カロリー' }, contrast: '質重視 ⇔ カロリー' },
  { key: 'QL' as keyof Score, pos: { code: 'Q' as Letter, label: '短期集中' }, neg: { code: 'L' as Letter, label: 'じっくり' }, contrast: '短期集中 ⇔ じっくり' },
] as const

// 文字×強度ごとの一言（型に依存しないので、これだけで全パターンをカバーできる）
const PHRASES: Record<Letter, Record<Intensity, string>> = {
  S: { strong: '人目を一切気にしない“一匹狼”度MAX', mid: '基本は一人で黙々と進めたい単独行動派', light: 'どちらかと言えば一人でやりたい' },
  G: { strong: '仲間の存在で燃える“チーム戦”の申し子', mid: '誰かと一緒だと頑張れるタイプ', light: 'どちらかと言えば人と一緒が好き' },
  R: { strong: '決めた計画を淡々と守り抜く鉄の規律', mid: 'ある程度きっちり進めたい計画派', light: 'どちらかと言えば計画を立てたい' },
  E: { strong: 'その日の気分とノリで動く生粋の感覚派', mid: '気分や勢いを大事にするタイプ', light: 'どちらかと言えば気分で動きたい' },
  F: { strong: '数字より“質と中身”に全振りのこだわり派', mid: 'カロリーより素材や質を見るタイプ', light: 'どちらかと言えば質を重視する' },
  C: { strong: '1gの誤差も許さない“数字支配”タイプ', mid: 'カロリーや数字で管理したいタイプ', light: 'どちらかと言えば数字で考えたい' },
  Q: { strong: '期限を切って一気に決める“短期決戦”型', mid: '短期集中で結果を出したいタイプ', light: 'どちらかと言えば短期で区切りたい' },
  L: { strong: '一生モノの習慣にする“長期戦”型', mid: 'ゆるく長く続けたいタイプ', light: 'どちらかと言えばじっくり派' },
}

function intensityOf(lean: number): Intensity {
  if (lean >= 12) return 'strong'
  if (lean >= 6) return 'mid'
  return 'light'
}
const intensityLabel: Record<Intensity, string> = { strong: 'かなり', mid: 'やや', light: 'ちょっと' }

export interface PersonalReading {
  headline: string          // 強度パーソナル文（メイン）
  extremeness: string       // くっきり型 / バランス型 などの総評
  secondFace: string | null // 隠れ二面性（僅差の軸があるときだけ）
}

export function getPersonalReading(scores: Score, typeCode: string): PersonalReading {
  const typeName = diagramTypes[typeCode]?.name ?? 'あなた'

  // userType の文字から「どちら側か」を決め、lean=|score| で強度を出す（傾向グラフと同じ判定）
  const axes = AXIS_META.map((meta, idx) => {
    const score = scores[meta.key]
    const letter = typeCode[idx] as Letter
    const side = meta.pos.code === letter ? meta.pos : meta.neg
    const lean = Math.abs(score)
    const inten = intensityOf(lean)
    return { idx, meta, letter, sideLabel: side.label, lean, inten, phrase: PHRASES[letter][inten] }
  })

  // 強い順に並べる
  const byLean = [...axes].sort((a, b) => b.lean - a.lean)
  const top = byLean[0]
  const second = byLean[1]

  // --- 強度パーソナル文 ---
  let headline: string
  if (top.inten === 'light') {
    // どの軸も僅差 → 「際立つ」ではなく中庸フレームで
    headline = `同じ「${typeName}」でも、あなたはどの軸も僅差の“ど真ん中バランス型”。強いて言えば${top.sideLabel}寄りですが、正直どっちにも転べる柔軟なあなたです。`
  } else if (top.inten === 'strong' && second.inten === 'strong') {
    // 2軸ともに「かなり」なら2つ目も添える
    headline = `同じ「${typeName}」でも、あなたは【${top.sideLabel}型】と【${second.sideLabel}型】の両方がくっきり。${top.phrase}で、さらに${second.phrase}。`
  } else {
    headline = `同じ「${typeName}」でも、あなたは特に【${intensityLabel[top.inten]}${top.sideLabel}型】が際立ちます。${top.phrase}。`
  }

  // --- 総評（くっきり / バランス / ミックス）---
  const nStrong = axes.filter((a) => a.inten === 'strong').length
  const nLight = axes.filter((a) => a.inten === 'light').length
  let extremeness: string
  if (nStrong >= 3) {
    extremeness = `4軸のほとんどがくっきり。誰が見てもブレない、生粋の「${typeName}」です。`
  } else if (nLight >= 3) {
    extremeness = `じつは全体的にバランス型。「${typeName}」の中では一番マイルドで、他タイプの顔もチラつく“変幻自在”なあなたです。`
  } else {
    extremeness = `はっきりした軸と、僅差の軸が混在。芯はブレないけど、場面で顔を変えられる柔軟さも持っています。`
  }

  // --- 隠れ二面性（僅差＝lean≤4 の軸があるときだけ）---
  const closest = byLean[byLean.length - 1] // lean 最小
  let secondFace: string | null = null
  if (closest.lean <= 4) {
    const flipLetter = closest.meta.pos.code === closest.letter ? closest.meta.neg.code : closest.meta.pos.code
    const flipCode = typeCode.slice(0, closest.idx) + flipLetter + typeCode.slice(closest.idx + 1)
    const flipName = diagramTypes[flipCode]?.name
    if (flipName) {
      secondFace = `【${closest.meta.contrast}】はほぼ互角（僅差）。状況次第で「${flipName}」の一面もひょっこり顔を出す“二刀流”です。`
    }
  }

  return { headline, extremeness, secondFace }
}
