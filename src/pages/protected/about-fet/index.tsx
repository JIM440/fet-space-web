import ContentContainer from '@/components/commons/containers/ContentContainer';
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
    { key: 'civil', name: 'Civil Engineering', description: 'Involves construction and infrastructure.' },
    { key: 'petroleum', name: 'Petroleum Engineering', description: 'Focuses on oil and gas extraction.' },
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
          className="w-full h-48 object-cover bg-gray-200 dark:bg-gray-700"
        />
        <div className="mt-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Faculty of Engineering and Technology
          </h1>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
            History
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Founded in 1970, the Pioneer Institute of Engineering has grown from a small technical college into a globally recognized leader in engineering education. In 1985, we launched the nation’s first undergraduate program in Renewable Energy Engineering. Our alumni include Dr. Maria Chen, who developed the world’s first scalable solar microgrid, and in 2023, we earned ABET accreditation for all programs. Today, we rank #12 in national engineering schools by [Fictional Ranking Source].
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
            Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            At the Pioneer Institute of Engineering, our mission is to empower future engineers with the knowledge, skills, and creativity to tackle global challenges. Through rigorous education, hands-on innovation, and a commitment to diversity, we prepare students to lead in a rapidly evolving technological world.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
            Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            At the Pioneer Institute of Engineering, our mission is to empower future engineers with the knowledge, skills, and creativity to tackle global challenges. Through rigorous education, hands-on innovation, and a commitment to diversity, we prepare students to lead in a rapidly evolving technological world.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
            Departments
          </h2>
          {departments.map((dept) => (
            <div key={dept.key} className="mb-4">
              <button
                className="flex items-center justify-between w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                onClick={() => toggleDepartment(dept.key as DepartmentKeys)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dept.name}</h3>
                <span className={`material-icons ${expandedDepartments[dept.key as DepartmentKeys] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {expandedDepartments[dept.key as DepartmentKeys] && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">{dept.description}</p>
              )}
            </div>
          ))}

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
            Administration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {administration.map((admin, index) => (
              <div key={index} className="text-center">
                <img
                  src={admin.imageUri}
                  alt={admin.name}
                  className="w-full h-36 object-cover rounded-md bg-gray-200 dark:bg-gray-700"
                />
                <p className="mt-2 text-gray-900 dark:text-gray-100">{admin.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{admin.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default AboutFET;