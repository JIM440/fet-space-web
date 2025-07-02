import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useCreateCourse } from "@/hooks/api";
import { useAuth } from "@/context/auth";
import ThemedText from "@/components/commons/typography/ThemedText";

const TopCoursesBar = () => {
  const { accessToken } = useAuth();
  const {
    mutate: createCourse,
    isPending: isLoading,
    error,
  } = useCreateCourse();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateCourse = () => {
    createCourse(
      {
        accessToken: accessToken!,
        data: {
          code,
          title,
          subtitle: "",
          description,
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setCode("");
          setTitle("");
          setDescription("");
        },
      }
    );
  };

  return (
    <div className="flex flex-row justify-between items-center mb-10">
      <select className="p-2 text-neutral-text-secondary bg-background-neutral rounded-md text-[1rem]">
        <option value="All Courses">All Courses</option>
        <option value="Level 200">Level 200</option>
        <option value="Level 300">Level 300</option>
        <option value="Level 400">Level 400</option>
      </select>
      <Button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
        {isLoading ? "Creating..." : "+ Add a course"}
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background-main border border-neutral-border p-6 w-[80%] max-w-[600px] min-w-[200px]]">
            <ThemedText
              variant="h2"
              className="text-xl font-semibold text-neutral-text-secondary mb-6"
            >
              Create New Course
            </ThemedText>
            <div className="mb-4">
              <label
                htmlFor="courseCode"
                className="block text-neutral-text-secondary font-semibold mb-2"
              >
                Course Code:
              </label>
              <input
                id="courseCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CEF 250"
                className="w-full px-3 py-2 bg-background-neutral border border-neutral-border rounded-md text-neutral-text-secondary"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="courseTitle"
                className="block text-neutral-text-secondary font-semibold mb-2"
              >
                Course Title:
              </label>
              <input
                id="courseTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                className="w-full px-3 py-2 bg-background-neutral border border-neutral-border rounded-md text-neutral-text-secondary"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="courseDescription"
                className="block text-neutral-text-secondary font-semibold mb-2"
              >
                Course Description:
              </label>
              <textarea
                id="courseDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter course description"
                className="w-full h-24 resize-none px-3 py-2 bg-background-neutral border border-neutral-border rounded-md text-neutral-text-secondary"
              />
            </div>
            {error && (
              <ThemedText variant="caption" className="text-red-500 mb-4">
                {error.message || "Failed to create course"}
              </ThemedText>
            )}
            <div className="flex justify-end space-x-4">
              <Button variant="link" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateCourse}
                disabled={!code || !title || !description || isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCoursesBar;
