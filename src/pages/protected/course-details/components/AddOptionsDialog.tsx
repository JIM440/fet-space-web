import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';

interface AddOptionsDialogProps {
  visible: boolean;
  onClose: () => void;
  courseId?: string;
}

const options = ["announcement", "poll", "content", "assignment", "teacher", "student"];

const AddOptionsDialog: React.FC<AddOptionsDialogProps> = ({ visible, onClose, courseId }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/50 flex justify-center items-end md:items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl w-full md:w-96 p-5">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(`/create/${option}?courseId=${courseId}`);
              onClose();
            }}
            className={`block w-full text-left py-5 px-4 border-b ${
              index === options.length - 1 ? 'border-b-0' : 'border-gray-200 dark:border-gray-700'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <ThemedText variant="body" className="text-gray-900 dark:text-gray-100">
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </ThemedText>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddOptionsDialog;