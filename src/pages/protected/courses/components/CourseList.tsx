import React from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ courses }: { courses: any }) => {
  return (
    <div className="flex flex-col gap-3">
      {courses.map((course) => (
        <CourseCard course={course} />
      ))}
    </div>
  );
};

export default CourseList;
