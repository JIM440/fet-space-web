import ThemedText from '@/components/commons/typography/ThemedText'
import React from 'react'

const CurriculumCard = ({ curriculum }) => {
  return (
    <a
      href={curriculum.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="p-5 border-1 border-neutral-border block hover:bg-neutral-100 transition"
    >
      <ThemedText variant='h3'>{curriculum.title}</ThemedText>
    </a>
  )
}

export default CurriculumCard
