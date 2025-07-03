import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCourseAssignments } from "@/hooks/api/courses";
import ThemedText from "@/components/commons/typography/ThemedText";
import AssignmentCard from "@/components/commons/cards/AssignmentCard";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";

interface Assignment {
  assignment_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
}

const Assignments = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    data: assignments,
    isLoading,
    isError,
    error,
  } = useGetCourseAssignments(parseInt(courseId!));

  if (isLoading) {
    return <InlineSpinner />;
  }

  if (isError) {
    return (
      <ThemedText className="text-center py-4 text-error">
        Error: {error?.message || "Failed to load assignments"}
      </ThemedText>
    );
  }

  return (
    <div className="p-4">
      {assignments && assignments.length > 0 ? (
        assignments.map((assignment: Assignment) => (
          <div key={assignment.assignment_id} className="mb-2">
            <AssignmentCard
              assignment={{
                id: assignment.assignment_id,
                title: assignment.title,
                description: assignment.description || "No description",
                date: assignment.due_date
                  ? new Date(assignment.due_date).toLocaleDateString()
                  : "No due date",
              }}
            />
          </div>
        ))
      ) : (
        <>
          <ThemedText className="text-center py-4 text-gray-400">
            No assignments created yet!
          </ThemedText>
          <ThemedText className="text-center">
            Click the button (+) below to create a new assignment.
          </ThemedText>
        </>
      )}
    </div>
  );
};

export default Assignments;
