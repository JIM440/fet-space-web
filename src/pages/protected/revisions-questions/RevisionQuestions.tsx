import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetCourseRevisionQuestions,
  useDeleteRevisionQuestions,
} from "@/hooks/api/courses";
import ThemedText from "@/components/commons/typography/ThemedText";
import FileCard from "@/components/commons/cards/FileCard";
import ErrorComponent from "@/components/commons/error/ErrorComponent";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";

interface Attachment {
  url: string;
  file_type: "pdf" | "docx" | "img" | "ppt" | "video" | string;
}

interface RevisionQuestion {
  question_id: number;
  attachments: Attachment[] | null;
  created_at: string;
}

const RevisionQuestions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    data: revisionQuestions,
    isLoading,
    isError,
    error,
    refetch
  } = useGetCourseRevisionQuestions(parseInt(courseId!));
  const [attachmentSizes, setAttachmentSizes] = useState<{
    [key: number]: string;
  }>({});
  const deleteMutation = useDeleteRevisionQuestions();

  useEffect(() => {
    if (revisionQuestions && revisionQuestions.length > 0) {
      const fetchSizes = async () => {
        const sizes: { [key: number]: string } = {};
        for (let i = 0; i < revisionQuestions.length; i++) {
          const attachment = revisionQuestions[i].attachments?.[0];
          if (attachment?.url) {
            try {
              const response = await fetch(attachment.url, { method: "HEAD" });
              if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
              const size = response.headers.get("content-length");
              sizes[revisionQuestions[i].question_id] = size
                ? `${(parseInt(size) / 1024).toFixed(2)} KB`
                : "Size unavailable";
            } catch (err) {
              sizes[revisionQuestions[i].question_id] = "Size unavailable";
              console.error(`Error fetching size for ${attachment.url}:`, err);
            }
          } else {
            sizes[revisionQuestions[i].question_id] = "No attachment";
          }
        }
        setAttachmentSizes(sizes);
      };
      fetchSizes();
    }
  }, [revisionQuestions]);

const handleDelete = (questionId: number) => {
  if (window.confirm("Are you sure you want to delete this question?")) {
    deleteMutation.mutate({ courseId: parseInt(courseId!), questionId });
  }
};

  if (isLoading) {
    return <InlineSpinner />
  }

  if (error) {
    return (
      <ErrorComponent message={`Error: ${error?.message || "Failed to load revision questions"}`} onRetry={refetch} />
    );
  }

  return (
    <div className="p-4">
      {revisionQuestions.length === 0 ? (
        <>
        <ThemedText className="text-center py-4">
          No revision questions available.
        </ThemedText>
        <ThemedText className="text-center">
          Click the button (+) below to upload revision questions.
        </ThemedText></>
      ) : (
        revisionQuestions.map((question: RevisionQuestion) => {
          const attachment = question.attachments?.[0];
          return (
            <div
              key={question.question_id}
              className="flex items-center mb-2"
              data-content-id={question.question_id}
              data-url={attachment?.url || ""}
            >
              <FileCard
                file={{
                  id: question.question_id,
                  name: attachment?.url.split("/").pop() || "Untitled",
                  type: attachment?.file_type || "unknown",
                  pages: 0,
                  size: attachmentSizes[question.question_id] || "Loading...",
                  date: new Date(question.created_at).toLocaleDateString(),
                }}
              />
              <button
                onClick={() => handleDelete(question.question_id)}
                className="ml-2 text-error"
                aria-label="Delete question"
              >
                ×
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RevisionQuestions;
