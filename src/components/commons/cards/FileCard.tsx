import React from 'react';
import ThemedText from '@/components/commons/typography/ThemedText';

interface FileProps {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'img' | 'ppt' | string;
  pages: number;
  size: string;
  date?: string;
}

const FileCard: React.FC<{ file: FileProps }> = ({ file }) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
    <div className="flex items-center gap-2 p-4 bg-gray-800 rounded-lg mb-2">
      <img src={getIcon(file.type)} alt={`${file.type} icon`} className="w-6 h-6" />
      <div className="flex-1">
        <ThemedText className="line-clamp-2 text-gray-100">{file.name}</ThemedText>
        <div className="flex gap-4 text-sm text-gray-400">
          <ThemedText variant="caption">{file.pages} pages</ThemedText>
          <ThemedText variant="caption">{file.size}</ThemedText>
          {file.date && <ThemedText variant="caption">{file.date}</ThemedText>}
        </div>
      </div>
    </div>
  );
};

export default FileCard;