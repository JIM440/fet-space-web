import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import ThemedText from "@/components/commons/typography/ThemedText";
import { Button } from "@/components/ui/button";
import { useUploadRevisionQuestions } from "@/hooks/api/courses";

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/*",
  "application/vnd.ms-powerpoint",
  "video/*",
];

const UploadRevisionQuestions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    mutate: uploadRevision,
    isPending: isLoading,
    error,
  } = useUploadRevisionQuestions();
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      if (
        !allowedFileTypes.some(
          (type) => fileType.startsWith(type.split("*")[0]) || fileType === type
        )
      ) {
        setFileError(
          "Please upload a file in PDF, DOCX, Image, PPT, or Video format."
        );
        setFile(null);
        setSelectedFileName("");
      } else {
        setFileError(null);
        setFile(selectedFile);
        setSelectedFileName(selectedFile.name);
      }
    }
  };

  const handleUpload = () => {
    if (!file || !courseId || fileError) return;
    uploadRevision({ courseId: parseInt(courseId), file });
  };

  return (
    <ContentContainer>
      <div className="h-[calc(100vh-110px)] flex flex-col items-center justify-center">
        <ThemedText variant="h4" className="mb-4">
          Upload Revision Questions
        </ThemedText>
        {error && (
          <ThemedText variant="body" className="text-error mb-4">
            {error.message}
          </ThemedText>
        )}
        {fileError && (
          <ThemedText variant="body" className="text-error mb-4">
            {fileError}
          </ThemedText>
        )}
        <div className="my-5">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 hidden"
            id="fileInput"
            accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.mp4,.avi,.mov"
          />
          <label
            htmlFor="fileInput"
            className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary cursor-pointer text-center"
          >
            {selectedFileName || "Select File"}
          </label>
        </div>
        <Button
          onClick={handleUpload}
          disabled={isLoading || !file || !!fileError}
          className="mt-4 w-full"
        >
          {isLoading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </ContentContainer>
  );
};

export default UploadRevisionQuestions;
