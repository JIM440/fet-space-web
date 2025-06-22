import React from "react";
import CourseCard from "./CourseCard";
import ThemedText from "@/components/commons/typography/ThemedText";

const CourseList = ({ courses }: { courses: any }) => {
  return (
    <div className="flex flex-col gap-3">
      {!courses ? <ThemedText>No courses found!</ThemedText> : courses.map((course, index) => (
        <CourseCard course={course} key={index} />
      ))}
    </div>
  );
};

export default CourseList;
