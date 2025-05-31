import React from "react";
import CurriculumCard from "./CurriculumCard";

const CurriculumList = ({ curriculums }: { curriculums: any }) => {
  return (
    <div className="flex flex-col gap-3">
      {curriculums.map((curriculum) => (
        <CurriculumCard curriculum={curriculum} />
      ))}
    </div>
  );
};

export default CurriculumList;
