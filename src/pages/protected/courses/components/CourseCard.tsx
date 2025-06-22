import ThemedText from '@/components/commons/typography/ThemedText'
import React from 'react'
import {Link} from 'react-router-dom'

const CourseCard = ({course}) => {
  return (
    <Link to={`/courses/${course.course_id}/announcements`} className='p-5 bg-red-600'>
      <ThemedText variant='h3'>{`${course.code}: ${course.title}`}</ThemedText>
      <ThemedText variant='caption'>{course.teacher.user.name}</ThemedText>
    </Link>
  )
}

export default CourseCard
