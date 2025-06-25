import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import React, { useState } from 'react';

type DepartmentKeys = 'mechanical' | 'electrical' | 'computer' | 'civil' | 'petroleum';

const AboutFET: React.FC = () => {
  const [expandedDepartments, setExpandedDepartments] = useState<Record<DepartmentKeys, boolean>>({
    mechanical: false,
    electrical: false,
    computer: false,
    civil: false,
    petroleum: false,
  });

  const toggleDepartment = (department: DepartmentKeys) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  // Placeholder departments data
  const departments = [
    { key: 'mechanical', name: 'Mechanical Engineering', description: 'Focuses on design and manufacturing systems.' },
    { key: 'electrical', name: 'Electrical Engineering', description: 'Deals with electrical systems and power.' },
    { key: 'computer', name: 'Computer Engineering', description: 'Covers hardware and software integration.' },
    { key: 'civil', name: 'Involves construction and infrastructure.' },
    { key: 'petroleum', description: 'Focuses on oil and gas extraction.' },
  ];

  // Placeholder administration data
  const administration = [
    { name: 'Dr. John Doe', role: 'Dean', imageUri: 'https://via.placeholder.com/150' },
    { name: 'Prof. Jane Smith', role: 'Associate Dean', imageUri: 'https://via.placeholder.com/150' },
  ];

  return (
    <ContentContainer>
      <div className="container mx-auto p-4">
        <img
          src="https://via.placeholder.com/400x200"
          alt="FET Banner"
          className="w-full h-48 object-cover rounded-md bg-background-neutral"
        />
        <div className="mt-6 space-y-6">
          <ThemedText variant='h1'>
            Faculty of Engineering and Technology
          </ThemedText>

          <ThemedText variant='h2' className='border-b border-neutral-border pb-4'>
            History
          </ThemedText>
          <ThemedText>
            Founded in 1970, the Pioneer Institute of Engineering has grown from a small technical college into a globally recognized leader in engineering education. In 1985, we launched the nation’s first undergraduate program in Renewable Energy Engineering. Our alumni include Dr. Maria Chen, who developed the world’s first scalable solar microgrid, and in 2023, we earned ABET accreditation for all programs. Today, we rank #12 in national engineering schools by [Fictional Ranking Source].
          </ThemedText>

          <ThemedText variant='h2' className='border-b border-neutral-border pb-4'>
            Mission
          </ThemedText>
          <ThemedText>
            At the Pioneer Institute of Engineering, our mission is to empower future engineers with the knowledge, skills, and creativity to tackle global challenges. Through rigorous education, hands-on innovation, and a commitment to diversity, we prepare students to lead in a rapidly evolving technological world.
          </ThemedText>

          <ThemedText variant='h2' className='border-b border-neutral-border pb-4'>
            Vision
          </ThemedText>
          <ThemedText>
            At the Pioneer Institute of Engineering, our vision is to be a global leader in engineering education, fostering innovation and sustainable solutions for a better future.
          </ThemedText>

          <ThemedText variant='h2' className='border-b border-neutral-border pb-4'>
            Departments
          </ThemedText>
          {departments.map((dept) => (
            <div key={dept.key} className="mb-4">
              <button
                className="flex items-center justify-between w-full p-2"
                onClick={() => toggleDepartment(dept.key as DepartmentKeys)}
              >
                <ThemedText variant='h3'>{dept.name}</ThemedText>
                <span className={`material-icons ${expandedDepartments[dept.key as DepartmentKeys] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {expandedDepartments[dept.key as DepartmentKeys] && (
                <ThemedText className="mt-2">{dept.description}</ThemedText>
              )}
            </div>
          ))}

          <ThemedText variant='h2' className='border-b border-neutral-border pb-4'>
            Administration
          </ThemedText>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {administration.map((admin, index) => (
              <div key={index} className="text-center">
                <img
                  src={admin.imageUri}
                  alt={admin.name}
                  className="w-full h-36 object-cover rounded-md bg-background-neutral mb-2"
                />
                <ThemedText>{admin.name}</ThemedText>
                <ThemedText>{admin.role}</ThemedText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default AboutFET;