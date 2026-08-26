'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { Noto_Sans_JP } from 'next/font/google'
import { getQuestionGroupByPage, getTotalPages } from '@/lib/questionGroups'
import { Answer } from '@/types'
import { trackEvent } from '@/lib/analytics'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
})

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const pageNumber = parseInt(params.id as string)
  const questionGroup = getQuestionGroupByPage(pageNumber)
  const totalPages = getTotalPages()
  
  const [answers, setAnswers] = useState<{[key: number]: number}>({})
  const [savedAnswers, setSavedAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // ページが変わるたびに、そのページの保存済み回答を復元する。
  // （戻る/進むで再訪したとき、以前の選択がハイライト表示されるようにする）
  useEffect(() => {
    // 「診断を始める」等から ?restart=1 付きで来たときは、前回の回答を破棄して
    // まっさらな状態で始める。途中の戻る/進む（パラメータ無し）では回答を維持する。
    if (
      pageNumber === 1 &&
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('restart') === '1'
    ) {
      localStorage.removeItem('diet-quiz-answers')
      localStorage.removeItem('diet-quiz-result-type')
      // パラメータを消して、この後の更新で再度クリアされないようにする
      window.history.replaceState(null, '', '/quiz/1')
      queueMicrotask(() => {
        setSavedAnswers([])
        setAnswers({})
      })
      return
    }

    const saved = localStorage.getItem('diet-quiz-answers')
    const parsed: Answer[] = saved ? JSON.parse(saved) : []
    const group = getQuestionGroupByPage(pageNumber)
    const restored: { [key: number]: number } = {}
    if (group) {
      parsed.forEach((a) => {
        if (group.some((q) => q.id === a.questionId)) {
          restored[a.questionId] = a.score
        }
      })
    }
    queueMicrotask(() => {
      setSavedAnswers(parsed)
      setAnswers(restored)
    })
    trackEvent('quiz_page_view', { quiz_page: pageNumber })
  }, [pageNumber])
  
  useEffect(() => {
    if (savedAnswers.length > 0) {
      localStorage.setItem('diet-quiz-answers', JSON.stringify(savedAnswers))
    }
  }, [savedAnswers])

  // このページで回答済みの問題数に応じて、進捗バーを滑らかに埋める。
  // （旧実装は (pageNumber-1)/totalPages で、最終ページでも最大66%までしか伸びなかった）
  const answeredInGroup = questionGroup
    ? questionGroup.filter(q => answers[q.id] !== undefined).length
    : 0
  const groupSize = questionGroup?.length || 1
  const progress = ((pageNumber - 1 + answeredInGroup / groupSize) / totalPages) * 100

  const handleAnswerSelect = (questionId: number, score: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: score
    }
    setAnswers(newAnswers)
    
    // 現在の質問のインデックスを取得
    const currentIndex = questionGroup.findIndex(q => q.id === questionId)
    const nextIndex = currentIndex + 1
    
    // 次の質問がある場合、0.5秒後にスクロール
    if (nextIndex < questionGroup.length) {
      setTimeout(() => {
        const nextQuestionElement = document.getElementById(`question-${questionGroup[nextIndex].id}`)
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 500)
    }
  }

  const handleNext = () => {
    // 全ての質問に回答されているかチェック
    const allAnswered = questionGroup.every(q => answers[q.id] !== undefined)
    if (!allAnswered) return

    setIsLoading(true)
    trackEvent('quiz_page_complete', {
      quiz_page: pageNumber,
      answered_questions: questionGroup.length,
    })

    // 回答を保存
    const newAnswers = questionGroup.map(q => ({
      questionId: q.id,
      score: answers[q.id]
    }))

    const updatedAnswers = [
      ...savedAnswers.filter(a => !questionGroup.find(q => q.id === a.questionId)),
      ...newAnswers
    ]
    setSavedAnswers(updatedAnswers)

    setTimeout(() => {
      if (pageNumber < totalPages) {
        router.push(`/quiz/${pageNumber + 1}`)
      } else {
        // 診断完了、結果ページへ
        router.push('/result')
      }
    }, 500)
  }

  const handleBack = () => {
    if (pageNumber > 1) {
      router.push(`/quiz/${pageNumber - 1}`)
    } else {
      router.push('/')
    }
  }

  if (!questionGroup) {
    return <div>ページが見つかりません</div>
  }

  const allAnswered = questionGroup.every(q => answers[q.id] !== undefined)

  return (
    <div className={`min-h-screen bg-app-gradient ${notoSansJP.className}`}>
      {/* プログレスバー（固定） */}
      <div className="sticky top-0 z-20 w-full border-b-2 border-[#211b18] bg-white">
        <div className="h-2 w-full bg-[#e0f2fe]" role="progressbar" aria-label="診断の進捗" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <motion.div
            className="h-full rounded-r-full bg-[#0ea5e9]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8 flex items-center justify-between">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#211b18] bg-white text-ink-700 shadow-[2px_2px_0_#211b18] transition-all hover:-translate-y-0.5"
            aria-label="前の画面に戻る"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>

          <span className="rounded-full border-2 border-[#211b18] bg-[#ffd166] px-4 py-1.5 text-sm font-black text-[#211b18] shadow-[2px_2px_0_#211b18]">
            ページ {pageNumber} <span className="opacity-50">/</span> {totalPages}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* 質問リスト */}
            <div className="card-surface space-y-8 rounded-[28px] p-5 md:p-10">
              {questionGroup.map((question, index) => (
                <div key={question.id} id={`question-${question.id}`} className="space-y-4 scroll-mt-24">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#211b18] bg-[#ffd166] text-xs font-black text-[#211b18]">
                      Q{(pageNumber - 1) * groupSize + index + 1}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-ink-900 text-left leading-relaxed">
                      {question.text}
                    </h3>
                  </div>

                  {/* 4段階スケール - モバイル最適化版 */}
                  <div className="w-full mx-auto py-4">
                    {/* スマホ用レイアウト */}
                    <div className="sm:hidden">
                      <div className="space-y-3">
                        <div className="flex items-end justify-center gap-3">
                          {[3, 1, -1, -3].map((score, scoreIndex) => {
                            const isSelected = answers[question.id] === score
                            const isAgree = scoreIndex <= 1
                            const size = scoreIndex === 0 || scoreIndex === 3 ? 'w-14 h-14' : 'w-11 h-11'
                            const ring = isAgree ? 'border-brand-400' : 'border-accent-400'
                            const fill = isAgree
                              ? 'bg-gradient-to-br from-brand-300 to-brand-500'
                              : 'bg-gradient-to-br from-accent-300 to-accent-500'

                            return (
                              <motion.button
                                key={score}
                                onClick={() => handleAnswerSelect(question.id, score)}
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                                className={`${size} flex items-center justify-center rounded-full border-2 transition-all duration-300 ${ring} ${
                                  isSelected ? `${fill} shadow-glow` : 'bg-white'
                                }`}
                                aria-label={`${question.text}：${score === 3 ? 'とてもそう思う' : score === 1 ? 'ややそう思う' : score === -1 ? 'ややそう思わない' : 'まったくそう思わない'}`}
                                aria-pressed={isSelected}
                              >
                                {isSelected && <Check className="h-5 w-5 text-white" strokeWidth={3} />}
                              </motion.button>
                            )
                          })}
                        </div>

                        <div className="flex justify-between px-1 text-xs font-semibold">
                          <span className="text-brand-600">そう思う</span>
                          <span className="text-accent-500">そう思わない</span>
                        </div>
                      </div>
                    </div>

                    {/* PC/タブレット用レイアウト */}
                    <div className="hidden sm:block">
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-5">
                          {[3, 1, -1, -3].map((score, scoreIndex) => {
                            const isSelected = answers[question.id] === score
                            const isAgree = scoreIndex <= 1
                            const size = scoreIndex === 0 || scoreIndex === 3 ? 'w-16 h-16' : 'w-12 h-12'
                            const ring = isAgree ? 'border-brand-400' : 'border-accent-400'
                            const fill = isAgree
                              ? 'bg-gradient-to-br from-brand-300 to-brand-500'
                              : 'bg-gradient-to-br from-accent-300 to-accent-500'

                            return (
                              <motion.button
                                key={score}
                                onClick={() => handleAnswerSelect(question.id, score)}
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                                className={`${size} flex items-center justify-center rounded-full border-2 transition-all duration-300 ${ring} ${
                                  isSelected ? `${fill} shadow-glow` : 'bg-white hover:bg-brand-50'
                                }`}
                                aria-label={`${question.text}：${score === 3 ? 'とてもそう思う' : score === 1 ? 'ややそう思う' : score === -1 ? 'ややそう思わない' : 'まったくそう思わない'}`}
                                aria-pressed={isSelected}
                              >
                                {isSelected && <Check className="h-6 w-6 text-white" strokeWidth={3} />}
                              </motion.button>
                            )
                          })}
                        </div>

                        <div className="flex justify-between px-6 text-sm font-semibold">
                          <span className="text-brand-600">そう思う</span>
                          <span className="text-accent-500">そう思わない</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < questionGroup.length - 1 && (
                    <hr className="my-6 border-[#211b18]/20" />
                  )}
                </div>
              ))}
            </div>

            {/* 進捗インジケーター */}
            <div className="card-surface rounded-[24px] p-5 text-center">
              <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-ink-500">
                <span className="text-brand-600 font-bold">{Object.keys(answers).length}</span>
                <span className="text-ink-300">/</span>
                <span>{questionGroup.length} 問 回答済み</span>
              </div>

              {/* 次へボタン */}
              <motion.button
                onClick={handleNext}
                disabled={!allAnswered || isLoading}
                whileHover={allAnswered ? { scale: 1.02 } : {}}
                whileTap={allAnswered ? { scale: 0.98 } : {}}
                className={`w-full rounded-full py-3.5 text-base font-bold transition-all duration-300 ${
                  allAnswered
                    ? 'btn-primary text-white'
                    : 'cursor-not-allowed bg-brand-100 text-ink-300'
                }`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mx-auto h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                  />
                ) : pageNumber < totalPages ? (
                  '次へ'
                ) : (
                  '診断結果を見る'
                )}
              </motion.button>

              {!allAnswered && (
                <div className="mt-2 text-xs text-ink-300">
                  全ての質問に回答してください
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
