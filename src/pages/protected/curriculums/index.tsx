import CurriculumList from './components/CurriculumList'
import ContentContainer from '@/components/commons/containers/ContentContainer'

const curriculums = [
  {
    id: 1,
    title: "Civil Engineering",
  },
  {
    id: 2,
    title: "Chemical and Petroleum Engineering",
  },
  {
    id: 3,
    title: "Computer Engineering",
  },
  {
    id: 4,
    title: "Electrical and Electronics Engineering",
  },
  {
    id: 5,
    title: "Mechatronics Engineering",
  },
]
const Curriculums = () => {
  return (
    <ContentContainer>
     <CurriculumList curriculums={curriculums} />
    </ContentContainer>
  )
}

export default Curriculums
