import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSearchTeacher, useAddTeacherToCourse } from "@/hooks/api";
import { useAuth } from "@/context/auth";
import ThemedText from "@/components/commons/typography/ThemedText";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";

interface Teacher {
  user_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  isTeacher: boolean; // Now required from backend
}

const SearchTeachersPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: teachers = [],
    isLoading,
    error,
  } = useSearchTeacher(searchQuery, courseId ? parseInt(courseId) : 0);
  const { mutate: addTeacher, isPending: isAdding } = useAddTeacherToCourse();

  const handleAddTeacher = (teacherId: number) => {
    if (courseId) {
      addTeacher(
        {
          courseId: parseInt(courseId),
          teacherId,
          accessToken: accessToken || "",
        },
        {
          onSuccess: () => {
            navigate(`/courses/${courseId}/people`);
          },
          onError: (error) => {
            alert(`Error adding teacher: ${error.message || "Unknown error"}`);
          },
        }
      );
    }
  };

  return (
    <ContentContainer>
      <div>
        <ThemedText variant="h1" className="mb-4 text-xl font-medium">
          Search Teachers
        </ThemedText>
        <Input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 border-0 outline-none bg-background-neutral text-sm text-neutral-text-secondary"
        />
        {isLoading && <InlineSpinner />}
        {error && (
          <ThemedText className="text-error">Error: {error.message}</ThemedText>
        )}
        {teachers.length === 0 && searchQuery && (
          <ThemedText className="text-center">No teachers found.</ThemedText>
        )}
        {!searchQuery && (
          <ThemedText className="text-center my-4">
            Start searching to see results.
          </ThemedText>
        )}
        {teachers.length > 0 && (
          <div className="flex flex-col gap-5 mt-8">
            {teachers.map((teacher: Teacher) => (
              <div
                key={teacher.user_id}
                className="flex justify-between items-center gap-2"
                onClick={() =>
                  !teacher.isTeacher && handleAddTeacher(teacher.user_id)
                } // Only trigger if not enrolled
              >
                <div className="flex flex-row gap-2">
                  <img
                    src=""
                    alt={teacher.name}
                    className="w-10 h-10 rounded-full bg-background-neutral text-[10px]"
                  />
                  <div>
                    <ThemedText
                      variant="h4"
                      className="text-neutral-text-primary"
                    >
                      {teacher.name}
                    </ThemedText>
                    <ThemedText variant="caption">{teacher.email}</ThemedText>
                  </div>
                </div>
                <Button
                  disabled={isAdding || teacher.isTeacher}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    if (!teacher.isTeacher) handleAddTeacher(teacher.user_id);
                  }}
                  variant="link"
                >
                  {teacher.isTeacher ? "Already Part" : "Add to Course"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContentContainer>
  );
};

export default SearchTeachersPage;
