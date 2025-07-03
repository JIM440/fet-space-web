import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateAssignment } from "@/hooks/api/courses";
import ThemedText from "@/components/commons/typography/ThemedText";
import { uploadToCloudinary, mimeToFileTypeMap } from "@/utils/cloudinary"; // Adjust import path
import { Button } from "@/components/ui/button";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import BackHeader from "@/components/commons/navigation/BackHeader";

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/*",
  "application/vnd.ms-powerpoint",
  "video/*",
];

const CreateAssignment = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateAssignment();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Set initial due date to current date and time (02:32 PM WAT, June 25, 2025)
  useEffect(() => {
    const now = new Date("2025-06-25T14:32:00.000+01:00"); // WAT is UTC+1
    const formattedDate = now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
    setDueDate(formattedDate);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const invalidFiles = selectedFiles.filter(
        (file) =>
          !allowedFileTypes.some(
            (type) =>
              file.type.startsWith(type.split("*")[0]) || file.type === type
          )
      );

      if (invalidFiles.length > 0) {
        setUploadError(
          "Please upload files in PDF, DOCX, Image, PPT, or Video format."
        );
        setFiles([]);
      } else {
        setUploadError(null);
        setFiles(selectedFiles);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    try {
      // Upload files to Cloudinary
      const uploadedAttachments = await Promise.all(
        files.map((file) => uploadToCloudinary(file, "assignments"))
      ).then((results) =>
        results.map(({ url, file_type }) => ({ url, file_type }))
      );

      createMutation.mutate(
        {
          courseId: parseInt(courseId), // Explicit base-10 parsing
          title,
          description,
          due_date: dueDate || null, // Allow null if no date is selected
          attachments: uploadedAttachments,
        },
        {
          onSuccess: () => navigate(`/courses/${courseId}/assignments`),
          onError: (error) => setUploadError(error.message),
        }
      );
    } catch (error) {
      setUploadError("Failed to upload attachments. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <ContentContainer>
            <BackHeader title="" />
      <ThemedText variant="h4" className="mb-4 text-neutral-text-secondary">
        Create Assignment
      </ThemedText>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <ThemedText className="mb-2">Title:</ThemedText>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-background-neutral text-neutral-text-secondary rounded-md"
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <ThemedText className="mb-1">Description:</ThemedText>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full p-2 bg-background-neutral text-neutral-text-secondary rounded-md resize-none"
          />
        </div>
        <div>
          <ThemedText className="mb-1">Due Date & Time:</ThemedText>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 bg-background-neutral text-neutral-text-secondary rounded-md"
            required
            min={new Date("2025-06-25T14:32:00.000+01:00")
              .toISOString()
              .slice(0, 16)} // Prevent selecting past dates
          />
        </div>
        <div>
          <ThemedText className="mb-1">Attachments:</ThemedText>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 bg-background-neutral text-neutral-text-secondary rounded-md"
            accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.mp4,.avi,.mov"
          />
          {files.length > 0 && (
            <div className="mt-2">
              {files.map((file, index) => (
                <div key={index} className="text-neutral-text-secondary">
                  {file.name} ({mimeToFileTypeMap[file.type] || "unknown"})
                </div>
              ))}
            </div>
          )}
          {uploadError && (
            <ThemedText className="text-error mt-2">{uploadError}</ThemedText>
          )}
        </div>
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={
              createMutation.isPending || !title || !courseId || !!uploadError
            }
          >
            {createMutation.isPending ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </form>
      {createMutation.isError && !uploadError && (
        <ThemedText className="text-error mt-2">
          {createMutation.error.message}
        </ThemedText>
      )}
    </ContentContainer>
  );
};

export default CreateAssignment;