import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';

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
    name: 'Announcement',
    url: (courseId) => `/courses/${courseId}/create-announcement`,
  },
  {
    name: 'Content',
    url: (courseId) => `/create/${courseId}/content`,
  },
  {
    name: 'Assignment',
    url: (courseId) => `/create/${courseId}/search/assignment`,
  },
  {
    name: 'Revision Questions',
    url: (courseId) => `/create/${courseId}/revision-questions`,
  },
  {
    name: 'Teacher',
    url: (courseId) => `/create/${courseId}/search/teacher`,
  },
  {
    name: 'Student',
    url: (courseId) => `/create/${courseId}/search/student`,
  },
];

const AddOptionsDialog: React.FC<AddOptionsDialogProps> = ({ visible, onClose, courseId }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/50 flex justify-center items-end md:items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl w-full md:w-96 p-5">
        {options.map((option, index) => (
          <button
            key={option.name}
            onClick={() => {
              navigate(option.url(courseId));
              onClose();
            }}
            className={`block w-full text-left py-5 px-4 border-b ${
              index === options.length - 1 ? 'border-b-0' : 'border-gray-200 dark:border-gray-700'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <ThemedText variant="body" className="text-gray-900 dark:text-gray-100">
              {option.name}
            </ThemedText>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddOptionsDialog;