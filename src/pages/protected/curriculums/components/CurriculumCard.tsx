import ThemedText from '@/components/commons/typography/ThemedText'
import React from 'react'
import {Link} from 'react-router-dom'

const CurriculumCard = ({curriculum}) => {
  return (
    <Link to={`/curriculums/${curriculum.id}`} className='p-5 border-1 border-neutral-border'>
      <ThemedText variant='h3'>{curriculum.title}</ThemedText>
    </Link>
  )
}

export default CurriculumCard
