import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchStudent, useAddStudentToCourse } from "@/hooks/api";
import ThemedText from "@/components/commons/typography/ThemedText";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";

interface Student {
  user_id: number;
  name: string;
  email: string;
  matricule_number: string | null;
  isEnrolled: boolean; // Now required from backend
}

const SearchStudentsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: students = [],
    isLoading,
    error,
  } = useSearchStudent(searchQuery, courseId ? parseInt(courseId) : 0);
  const { mutate: addStudent, isPending: isAdding } = useAddStudentToCourse();

  const handleAddStudent = (studentId: number) => {
    if (courseId) {
      addStudent(
        { courseId: parseInt(courseId), studentId },
        {
          onSuccess: () => {
            navigate(`/courses/${courseId}/people`);
          },
          onError: (error) => {
            alert(`Error adding student: ${error.message || "Unknown error"}`);
          },
        }
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setSearchQuery(value);
  };

  return (
    <ContentContainer>
      <div>
        <ThemedText variant="h1" className="mb-4 text-xl font-medium">
          Search Students
        </ThemedText>
        <Input
          type="text"
          placeholder="Search by name or matricule"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 border-0 outline-none bg-background-neutral text-sm"
        />
        {isLoading && <InlineSpinner />}
        {error && (
          <ThemedText className="text-error">Error: {error.message}</ThemedText>
        )}
        {students.length === 0 && searchQuery && (
          <ThemedText>No students found.</ThemedText>
        )}
        {!searchQuery && (
          <ThemedText className="text-center my-4">
            Start searching to see results.
          </ThemedText>
        )}
        {students.length > 0 && (
          <div className="flex flex-col gap-5 mt-8">
            {students.map((student: Student) => (
              <div
                key={student.user_id}
                className="flex justify-between items-center"
                onClick={() =>
                  !student.isEnrolled && handleAddStudent(student.user_id)
                } // Only trigger if not enrolled
              >
                <div className="flex flex-row gap-2">
                  <img
                    src=""
                    alt={student.name}
                    className="w-10 h-10 rounded-full bg-background-neutral text-[10px]"
                  />
                  <div>
                    <ThemedText
                      variant="h4"
                      className="text-neutral-text-primary"
                    >
                      {student.name}
                    </ThemedText>
                    <ThemedText variant="caption">
                      {student.matricule_number?.toUpperCase()}
                    </ThemedText>
                  </div>
                </div>
                <Button
                  disabled={isAdding || student.isEnrolled}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    if (!student.isEnrolled) handleAddStudent(student.user_id);
                  }}
                  variant="link"
                >
                  {student.isEnrolled ? "Already Part" : "Add to Course"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContentContainer>
  );
};

export default SearchStudentsPage;
