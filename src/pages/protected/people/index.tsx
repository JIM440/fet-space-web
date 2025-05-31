import React from 'react';
import ThemedText from '@/components/commons/typography/ThemedText';
import ProfileCard from '@/components/commons/cards/ProfileCard';

const users = {
  teachers: [{ id: 1, name: "Prof. Smith", imageUri: "https://via.placeholder.com/40" }],
  students: [{ id: 2, name: "John Doe", matricule: "STU123", imageUri: "https://via.placeholder.com/40" }],
};

const People: React.FC = () => {
  return (
    <div className="space-y-6">
      <ThemedText variant="h3" className="text-gray-900 dark:text-gray-100">
        Teachers
      </ThemedText>
      {users.teachers.map((teacher) => (
        <ProfileCard key={teacher.id} user={teacher} type="teacher" />
      ))}
      <ThemedText variant="h3" className="text-gray-900 dark:text-gray-100 mt-8">
        Students
      </ThemedText>
      {users.students.map((student) => (
        <ProfileCard key={student.id} user={student} type="student" />
      ))}
    </div>
  );
};

export default People;