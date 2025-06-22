import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { Button } from '@/components/ui/button';
import { useCreateCourseAnnouncement } from '@/hooks/api';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';

const CreateCourseAnnouncement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: createCourseAnnouncement, isPending: isLoading, error } = useCreateCourseAnnouncement();

  const [type, setType] = useState<'announcement' | 'poll'>('announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [options, setOptions] = useState<string[]>(['']);

  const handleCreate = () => {
    const data = {
      courseId: Number(courseId),
      title,
      content,
      is_poll: type === 'poll',
      poll: type === 'poll' ? {
        allow_multiple_answers: allowMultipleAnswers,
        type: 'course',
        options,
      } : undefined,
    };
    createCourseAnnouncement(
      { accessToken: accessToken!, data },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setAllowMultipleAnswers(false);
          setOptions(['']);
          queryClient.invalidateQueries({queryKey: ['courseAnnouncements', Number(courseId)]});
        },
      }
    );
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <ContentContainer>
      <ThemedText variant="h2">Create Course Announcement</ThemedText>
      {error && <ThemedText variant="body" className="text-red-500 mb-4">{error.message}</ThemedText>}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'announcement' | 'poll')}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="announcement">Announcement</option>
          <option value="poll">Poll</option>
        </select>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
        rows={4}
      />
      {type === 'poll' && (
        <div className="mb-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={allowMultipleAnswers}
              onChange={(e) => setAllowMultipleAnswers(e.target.checked)}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <ThemedText variant="body">Allow Multiple Answers</ThemedText>
          </label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          ))}
          <Button onClick={addOption} variant="outline" className="mt-2">Add Option</Button>
        </div>
      )}
      <Button
        onClick={handleCreate}
        disabled={isLoading || !title || !content || (type === 'poll' && options.some(o => !o))}
        className="mt-4"
      >
        {isLoading ? 'Creating...' : 'Create'}
      </Button>
    </ContentContainer>
  );
};

export default CreateCourseAnnouncement;