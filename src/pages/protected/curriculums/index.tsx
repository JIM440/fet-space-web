import CurriculumList from "./components/CurriculumList";
import ContentContainer from "@/components/commons/containers/ContentContainer";

const curriculums = [
  {
    id: 1,
    title: "Civil Engineering",
    pdfUrl: "../../src/assets/documents/curriculums/civil-engineering.pdf",
  },
  {
    id: 2,
    title: "Chemical and Petroleum Engineering",
    pdfUrl:
      "../../src/assets/documents/curriculums/chemical-and-petroleum-engineering.pdf",
  },
  {
    id: 3,
    title: "Computer Engineering",
    pdfUrl: "../../src/assets/documents/curriculums/computer-engineering.pdf",
  },
  {
    id: 4,
    title: "Electrical and Electronics Engineering",
    pdfUrl:
      "../../src/assets/documents/curriculums/electrical-and-electronics-engineering.pdf",
  },
  {
    id: 5,
    title: "Mechatronics Engineering",
    pdfUrl: "../../src/assets/documents/curriculums/mechatronics-engineering.pdf",
  },
];

const Curriculums = () => {
  return (
    <ContentContainer>
      <CurriculumList curriculums={curriculums} />
    </ContentContainer>
  );
};

export default Curriculums;
