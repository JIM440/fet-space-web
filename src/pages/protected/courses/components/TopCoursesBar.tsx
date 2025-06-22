import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useCreateCourse } from '@/hooks/api';
import { useAuth } from '@/context/auth';

const TopCoursesBar = () => {
  const { accessToken } = useAuth();
  const { mutate: createCourse, isPending: isLoading, error } = useCreateCourse();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCourse = () => {
    createCourse(
      {
        accessToken: accessToken!,
        data: {
          code,
          title,
          subtitle: '',
          description,
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setCode('');
          setTitle('');
          setDescription('');
        },
      }
    );
  };

  return (
    <div className="flex flex-row justify-between items-center py-4 px-16 bg-amber-950">
      <select className="p-2 bg-gray-700 text-white rounded">
        <option value="All Courses">All Courses</option>
        <option value="Level 200">Level 200</option>
        <option value="Level 300">Level 300</option>
        <option value="Level 400">Level 400</option>
      </select>
      <Button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
        {isLoading ? 'Creating...' : '+ Add a course'}
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Course</h2>
            {error && (
              <p className="text-red-500 mb-4">
                {error.message || 'Failed to create course'}
              </p>
            )}
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Course Code (e.g. CEF 250)"
              className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course Title"
              className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course Description"
              className="w-full px-3 py-2 mb-4 h-24 resize-none bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateCourse}
                disabled={!code || !title || !description || isLoading}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCoursesBar;
