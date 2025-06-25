import React, { useState } from "react";
import { useCreateCourseAnnouncement } from "@/hooks/api/useCourseAnnouncements";
import { useParams, useNavigate } from "react-router-dom";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import ThemedText from "@/components/commons/typography/ThemedText";
import { Button } from "@/components/ui/button";

const CreateAnnouncement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [form, setForm] = useState({
    type: "regular",
    title: "",
    content: "",
    allow_multiple_answers: false,
    options: ["", ""],
    attachments: [] as File[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const {
    mutate: createAnnouncement,
    isPending,
    error,
  } = useCreateCourseAnnouncement(parseInt(courseId || "0"));
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allowedExtensions =
        /(\.pdf|\.docx|\.jpg|\.jpeg|\.png|\.gif|\.ppt|\.pptx|\.mp4|\.mov)$/i;
      const validFiles = Array.from(e.target.files).filter((file) =>
        allowedExtensions.test(file.name)
      );

      if (validFiles.length !== e.target.files.length) {
        const invalidFiles = Array.from(e.target.files).filter(
          (file) => !allowedExtensions.test(file.name)
        );
        setUploadError(
          `Invalid file types detected. Only PDF, DOCX, JPG/JPEG/PNG/GIF (images), PPT/PPTX, and MP4/MOV (videos) are allowed. Removed: ${invalidFiles
            .map((f) => f.name)
            .join(", ")}.`
        );
      } else {
        setUploadError(null);
      }

      setForm((prev) => ({
        ...prev,
        attachments: validFiles,
      }));
    }
  };

  const uploadToCloudinary = async (files: File[]) => {
    setIsUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "fet_space_sms");
      formData.append(
        "folder",
        `announcements/${new Date().toISOString().split("T")[0]}`
      );
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      formData.append("public_id", sanitizedName.replace(/\.[^/.]+$/, ""));

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dkz9lhvhb/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      uploadedUrls.push({ url: data.secure_url, originalName: file.name });
    }
    setIsUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadError) {
      return; // Prevent submission if there are upload errors
    }

    let payload = {
      courseId,
      title: form.title,
      content: form.content,
      is_poll: form.type === "poll",
    };

    if (form.type === "poll") {
      payload.poll = {
        allow_multiple_answers: form.allow_multiple_answers,
        type: "course",
        options: form.options.filter((option) => option.trim() !== ""),
      };
    } else if (form.attachments.length > 0) {
      const attachmentData = await uploadToCloudinary(form.attachments);
      payload = {
        ...payload,
        attachments: attachmentData.map((item) => item.url),
      };
    }

    console.log("payload:", payload);
    createAnnouncement(payload, {
      onSuccess: () => {
        setForm({
          type: "regular",
          title: "",
          content: "",
          allow_multiple_answers: false,
          options: ["", ""],
          attachments: [],
        });
        setUploadError(null); // Clear any previous upload errors
        navigate(`/courses/${courseId}/announcements`);
      },
    });
  };

  return (
    <ContentContainer>
      <ThemedText variant="h1" className="mb-6">
        Create Course Announcement
      </ThemedText>
      {error && <p className="text-error mb-4">{error.message}</p>}
      {uploadError && <p className="text-error mb-4">{uploadError}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
            Type:
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleInputChange}
            className="px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary"
          >
            <option value="regular">Regular</option>
            <option value="poll">Poll</option>
          </select>
        </div>

        {form.type === "regular" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Title (optional):
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary"
                placeholder="Enter title"
                  required={form.type === "poll"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Content:
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary resize-none"
                placeholder="Enter content"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary"
                disabled={isUploading || isPending}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Question:
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary"
                placeholder="Enter poll question"
                  required={form.type === "poll"}
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Description (Optional)
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary"
                placeholder="Enter additional details"
                rows={3}
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                Options
              </label>
              {form.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-background-neutral rounded-md text-neutral-text-secondary mb-2"
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 px-4 py-2 bg-background-neutral rounded-md text-neutral-text-primary"
                disabled={isUploading || isPending}
              >
                Add Option +
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allow_multiple_answers"
                checked={form.allow_multiple_answers}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-base border-neutral-border"
                disabled={isUploading || isPending}
              />
              <label className="ml-2 text-sm text-neutral-text-secondary">
                Allow Multiple Answers
              </label>
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={
            isUploading ||
            isPending ||
            (form.type === "poll" &&
              (!form.title.trim() || !form.options.some((o) => o.trim()))) ||
            (form.type === "regular" &&
              !form.content.trim() &&
              form.attachments.length === 0)
          }
          className="w-full mt-6"
        >
          {isUploading || isPending ? "Creating..." : "Create Announcement"}
        </Button>
      </form>
    </ContentContainer>
  );
};

export default CreateAnnouncement;
