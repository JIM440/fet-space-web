import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import React from 'react';

interface Assignment {
  id: number;
  title: string;
  courseCode: string;
  dueDate: string;
  description: string;
  imageUri: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Final Project Proposal',
    courseCode: 'CEF 350',
    dueDate: 'May 25, 2025, 11:59 PM',
    description: 'Submit a detailed proposal for your final project, including methodology and timeline.',
    imageUri: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    title: 'Midterm Assignment',
    courseCode: 'MEC 410',
    dueDate: 'May 27, 2025, 11:59 PM',
    description: 'Complete the design analysis for the robotics module and submit your report.',
    imageUri: 'https://via.placeholder.com/80',
  },
  {
    id: 3,
    title: 'Lab Report 3',
    courseCode: 'ELE 320',
    dueDate: 'May 30, 2025, 11:59 PM',
    description: 'Analyze the circuit data from Lab 3 and submit your findings.',
    imageUri: 'https://via.placeholder.com/80',
  },
];

const UpcomingDeadlines: React.FC = () => {
  const currentDate = new Date('May 30, 2025 15:26:00 WAT').getTime();

  return (
    <ContentContainer>
        <div className="space-y-4">
          {mockAssignments.length > 0 ? (
            mockAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate).getTime();
              const isPastDue = dueDate < currentDate;
              return (
                <div
                  key={assignment.id}
                  className={`p-4 border-1 border-gray-300 ${isPastDue ? 'bg-red-100 dark:bg-red-900' : 'bg-white dark:bg-gray-800'} border-b border-gray-200 dark:border-gray-700`}
                >
                  <ThemedText variant='h3'>
                    {assignment.title} - {assignment.courseCode}
                  </ThemedText>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {assignment.description}
                  </p>
                  <p
                    className={`mt-2 text-sm ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    Due: {assignment.dueDate} {isPastDue && '(Past Due)'}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No upcoming deadlines.
            </p>
          )}
        </div>
    </ContentContainer>
  );
};

export default UpcomingDeadlines;