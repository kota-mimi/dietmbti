'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface CharacterMarqueeProps {
  direction?: 'left' | 'right'
  speed?: number
  row?: 'first' | 'second'
}

export default function CharacterMarquee({ 
  direction = 'right', 
  speed = 30,
  row = 'first'
}: CharacterMarqueeProps) {
  // Split 16 character types into two rows
  const firstRowTypes = [
    'SRFQ', 'SRFL', 'SRCQ', 'SRCL',
    'SEFQ', 'SEFL', 'SECQ', 'SECL'
  ]
  
  const secondRowTypes = [
    'GRFQ', 'GRFL', 'GRCQ', 'GRCL',
    'GEFQ', 'GEFL', 'GECQ', 'GECL'
  ]

  const characterTypes = row === 'first' ? firstRowTypes : secondRowTypes

  // Triple the array to ensure smooth infinite loop with more variety
  const duplicatedTypes = [...characterTypes, ...characterTypes, ...characterTypes]

  return (
    <div className="overflow-hidden py-2 whitespace-nowrap">
      <motion.div
        className="flex gap-4 md:gap-6"
        animate={{
          x: direction === 'right' ? ['0%', '-33.33%'] : ['-33.33%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {duplicatedTypes.map((type, index) => (
          <div
            key={`${type}-${index}`}
            className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-[22px] border-2 border-[#211b18] bg-white p-1 shadow-[4px_4px_0_#211b18] md:h-28 md:w-28 ${index % 2 ? 'rotate-2' : '-rotate-2'}`}
          >
            <Image
              src={`/characters/${type === 'SRFQ' ? 'SRFQ_gallery.png' : 
                    type === 'SECQ' ? 'SECQ_gallery.png' : 
                    type === 'SEFL' ? 'SEFL_gallery.png' : 
                    type === 'SRCL' ? 'SRCL_gallery.png' : 
                    type === 'GEFQ' ? 'GEFQ_gallery.png' : 
                    type === 'SRFL' ? 'SRFL_gallery.png' : 
                    type === 'GRCQ' ? 'GRCQ_gallery.png' : 
                    type === 'GEFL' ? 'GEFL_gallery.png' : 
                    type === 'GECL' ? 'GECL_gallery.png' : 
                    type === 'GECQ' ? 'GECQ_gallery.png' : 
                    type === 'SRCQ' ? 'SRCQ_gallery.png' : 
                    type === 'SEFQ' ? 'SEFQ_gallery.png' : 
                    type === 'GRCL' ? 'GRCL_gallery.png' : 
                    type === 'GRFQ' ? 'GRFQ_gallery.png' : 
                    type === 'SECL' ? 'SECL_gallery.png' : 
                    type === 'GRFL' ? 'GRFL_gallery.png' : 
                    type + '_new3.png'}`}
              alt={`${type} character`}
              width={96}
              height={96}
              className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
              quality={85}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
