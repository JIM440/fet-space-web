import React from "react";
import { useNavigate } from "react-router-dom";
import ThemedText from "@/components/commons/typography/ThemedText";

interface AddOptionsDialogProps {
  visible: boolean;
  onClose: () => void;
  courseId?: string;
}

interface Option {
  name: string;
  url: (courseId?: string) => string;
}

const options: Option[] = [
  {
    name: "Announcement",
    url: (courseId) => `/create/${courseId}/announcement`,
  },
  {
    name: "Content",
    url: (courseId) => `/create/${courseId}/content`,
  },
  {
    name: "Assignment",
    url: (courseId) => `/create/${courseId}/assignment`,
  },
  {
    name: "Revision Questions",
    url: (courseId) => `/create/${courseId}/revision-questions`,
  },
  {
    name: "Teacher",
    url: (courseId) => `/create/${courseId}/search/teacher`,
  },
  {
    name: "Student",
    url: (courseId) => `/create/${courseId}/search/student`,
  },
];

const AddOptionsDialog: React.FC<AddOptionsDialogProps> = ({
  visible,
  onClose,
  courseId,
}) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-end md:items-center z-50 pointer"
      onClick={() => {
        onClose();
      }}
    >
      <div className="bg-background-neutral rounded-t-2xl md:rounded-2xl w-full md:w-96 p-5">
        {options.map((option, index) => (
          <button
            key={option.name}
            onClick={() => {
              navigate(option.url(courseId));
              onClose();
            }}
            className={`block w-full text-left py-5 px-4 border-b border-neutral-text-secondary ${
              index === options.length - 1 ? "border-b-0" : "border-b-1"
            }`}
          >
            <ThemedText variant="body">{option.name}</ThemedText>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddOptionsDialog;
