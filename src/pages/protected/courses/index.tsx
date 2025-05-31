import React from 'react'
import TopCoursesBar from './components/TopCoursesBar'
import CourseList from './components/CourseList'
import ContentContainer from '@/components/commons/containers/ContentContainer'

const courses = [
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
  {
    id: 1,
    code: "CEF 240",
    title: "Computer Architecture",
    instructor: "Dr.Sante Morel"
  },
]

const Courses = () => {
  return (
    <div>
     <TopCoursesBar /> 
     <ContentContainer>
     <CourseList courses={courses} />
     </ContentContainer>
    </div>
  )
}

export default Courses
