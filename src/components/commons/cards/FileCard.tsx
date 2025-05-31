import React from 'react';
import ThemedText from '@/components/commons/typography/ThemedText';

interface FileProps {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'img' | 'ppt';
  pages: number;
  size: string;
  date?: string;
}

const FileCard: React.FC<{ file: FileProps }> = ({ file }) => {

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'https://via.placeholder.com/24?text=PDF';
      case 'docx':
        return 'https://via.placeholder.com/24?text=DOC';
      case 'img':
        return 'https://via.placeholder.com/24?text=IMG';
      case 'ppt':
        return 'https://via.placeholder.com/24?text=PPT';
      default:
        return 'https://via.placeholder.com/24?text=FILE';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <img src={getIcon(file.type)} alt={`${file.type} icon`} className="w-6 h-6" />
      <div className="flex-1">
        <ThemedText className="line-clamp-2 text-gray-900 dark:text-gray-100">{file.name}</ThemedText>
        <div className="flex gap-4">
          <ThemedText variant="caption" className="text-gray-500 dark:text-gray-400">
            {file.pages} pages
          </ThemedText>
          <ThemedText variant="caption" className="text-gray-500 dark:text-gray-400">
            {file.size}
          </ThemedText>
          {file.date && (
            <ThemedText variant="caption" className="text-gray-500 dark:text-gray-400">
              {file.date}
            </ThemedText>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;