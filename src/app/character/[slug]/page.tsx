import { diagramTypes } from '@/data/diagramTypes'
import { characterSlugs, slugToType } from '@/data/characterSlugs'
import { generateCharacterMetadata } from '@/utils/characterMeta'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CharacterPageClient from '@/components/CharacterPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return generateCharacterMetadata(slug)
}

export async function generateStaticParams() {
  return Object.values(characterSlugs).map((slug) => ({
    slug,
  }))
}

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params
  
  // スラッグからキャラクタータイプを取得
  const typeCode = slugToType[slug]
  
  if (!typeCode) {
    notFound()
  }
  
  const character = diagramTypes[typeCode as keyof typeof diagramTypes]
  
  if (!character) {
    notFound()
  }

  return <CharacterPageClient typeCode={typeCode} character={character} />
}
