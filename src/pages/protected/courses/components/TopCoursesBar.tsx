import { Button } from "@/components/ui/button";
import React from "react";

const TopCoursesBar = () => {
  return (
    <div className="flex flex-row justify-between align-middle py-4 px-16 bg-amber-950">
      <select>
        <option value="All Courses">All Courses</option>
        <option value="Courses">Level 200</option>
        <option value="Courses">Level 300</option>
        <option value="Courses">Level 400</option>
      </select>
        <Button>+ Join a course</Button>
    </div>
  );
};

export default TopCoursesBar;
