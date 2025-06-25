import ThemedText from '@/components/commons/typography/ThemedText'
import {Link} from 'react-router-dom'

const CourseCard = ({course}) => {
  return (
    <Link to={`/courses/${course.course_id}/announcements`} className='p-5 border-1 border-neutral-border'>
      <ThemedText variant='h3'>{`${course.code}: ${course.title}`}</ThemedText>
      <ThemedText variant='caption'>{course.teacher.user.name}</ThemedText>
    </Link>
  )
}

export default CourseCard
