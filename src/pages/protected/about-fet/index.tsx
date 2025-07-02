import ContentContainer from "@/components/commons/containers/ContentContainer";
import ThemedText from "@/components/commons/typography/ThemedText";
import React, { useState } from "react";

type DepartmentKeys =
  | "mechanical"
  | "electrical"
  | "computer"
  | "civil"
  | "petroleum";

const AboutFET: React.FC = () => {
  const [expandedDepartments, setExpandedDepartments] = useState<
    Record<DepartmentKeys, boolean>
  >({
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
    {
      key: "mechanical",
      name: "Mechanical Engineering",
      description: "Focuses on design and manufacturing systems.",
    },
    {
      key: "electrical",
      name: "Electrical Engineering",
      description: "Deals with electrical systems and power.",
    },
    {
      key: "computer",
      name: "Computer Engineering",
      description: "Covers hardware and software integration.",
    },
    { key: "civil", name: "Involves construction and infrastructure." },
    { key: "petroleum", description: "Focuses on oil and gas extraction." },
  ];

  // Placeholder administration data
  const administration = [
    {
      name: "Prof. Agbor Dieudonne Agbor",
      role: "Dean",
      imageUri: "../../src/assets/images/admins/dean.jpg",
    },
    {
      name: "Dr. Nde Nguti",
      role: "Vice Dean",
      imageUri: "../../src/assets/images/admins/nguti.jpg",
    },
    {
      name: "Dr. Nkemeni Valerie",
      role: "HOD of Electrical Department",
      imageUri: "../../src/assets/images/admins/valerie.jpg",
    },
    {
      name: "Prof. Elie Fute",
      role: "HOD of Computer Department",
      imageUri: "../../src/assets/images/admins/fute.jpg",
    },
    {
      name: "Dr. Sop Leonel",
      role: "Coordinator of Computer Engineering",
      imageUri: "../../src/assets/images/admins/sop.jpg",
    },
    {
      name: "Dr. Fozin",
      role: "Lecturer",
      imageUri: "../../src/assets/images/admins/fozin.jpg",
    },
  ];

  return (
    <ContentContainer>
      <div className="container mx-auto p-4">
        <img
          // src="../../src/assets/images/programs.png"
          src="https://www.camexamen.com/wp-content/uploads/2018/08/Fet-picture.jpg"
          alt="FET Banner"
          className="w-full h-48 sm:h-88 object-cover bg-background-neutral"
        />
        <div className="mt-6 space-y-6">
          <ThemedText variant="h1">
            Faculty of Engineering and Technology
          </ThemedText>

          <ThemedText
            variant="h2"
            className="border-b border-neutral-border pb-4"
          >
            History
          </ThemedText>
          <ThemedText>
            The Faculty of Engineering and Technology is one of the
            establishments of the University of Buea. Created in 1993 with the
            creation of the University, it opened its doors to the first
            students in 2010, featuring four degree programs: Bachelor of
            Science in Engineering in Power Systems, Telecommunications Systems,
            Software Engineering and Network and Security. Currently, the
            Faculty has five departments with over each featuring at least one
            degree program. Postgraduate programs have enabled the Faculty to
            train more of its manpower.
          </ThemedText>

          <ThemedText
            variant="h2"
            className="border-b border-neutral-border pb-4"
          >
            Mission
          </ThemedText>
          <ThemedText>
            In fulfilment of its vision, the Faculty of Engineering and
            Technology trains a diverse pool of students to become future
            engineers and engineering leaders, capable of sustainable
            self-employment.
              <li className="ml-4">
              Integrate quality Assessment in teaching /research programmes
            </li>
            <li className="ml-4">
              Seek collaboration with international and national leaders in
              engineering training
            </li>
            <li className="ml-4">
              Vigorously impact the entrepreneurial spirit in our students
            </li>
          </ThemedText>

          <ThemedText
            variant="h2"
            className="border-b border-neutral-border pb-4"
          >
            Vision
          </ThemedText>
          <ThemedText>
            The Faculty of Engineering and Technology (FET) will be an impactful
            institution that excels in knowledge creation, propagation and
            application across a spectrum of engineering disciplines using
            traditional and leading-edge teaching technologies and methods,
            whose graduates will respond to the national and sub-regional
            development needs and competing successfully in the global job
            market.
          </ThemedText>

          <ThemedText
            variant="h2"
            className="border-b border-neutral-border pb-4"
          >
            Departments
          </ThemedText>
          {departments.map((dept) => (
            <div key={dept.key} className="mb-4">
              <button
                className="flex items-center justify-between w-full p-2"
                onClick={() => toggleDepartment(dept.key as DepartmentKeys)}
              >
                <ThemedText variant="h3">{dept.name}</ThemedText>
                <span
                  className={`material-icons ${
                    expandedDepartments[dept.key as DepartmentKeys]
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              {expandedDepartments[dept.key as DepartmentKeys] && (
                <ThemedText className="mt-2">{dept.description}</ThemedText>
              )}
            </div>
          ))}

          <ThemedText
            variant="h2"
            className="border-b border-neutral-border pb-4"
          >
            Administration
          </ThemedText>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {administration.map((admin, index) => (
              <div key={index} className="text-center">
                <img
                  src={admin.imageUri}
                  alt={admin.name}
                  className="w-full h-90 object-cover rounded-md bg-background-neutral mb-2"
                />
                <ThemedText variant="h4">{admin.name}</ThemedText>
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
