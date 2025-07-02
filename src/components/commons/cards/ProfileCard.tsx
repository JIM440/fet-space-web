import React from "react";
import { useNavigate } from "react-router-dom";
import ThemedText from "@/components/commons/typography/ThemedText";

interface UserProps {
  id: number;
  name: string;
  matricule?: string;
  imageUri: string;
}


const studentImages = [
  "../../../src/assets/images/students/student1.jpg",
  "../../../src/assets/images/students/student12.jpg",
  "../../../src/assets/images/students/student3.jpg",
  "../../../src/assets/images/students/student13.jpg",
  "../../../src/assets/images/students/student4.jpg",
  "../../../src/assets/images/students/student5.jpg",
  "../../../src/assets/images/students/student6.jpg",
  "../../../src/assets/images/students/student7.jpg",
  "../../../src/assets/images/students/student8.jpg",
  "../../../src/assets/images/students/student9.jpg",
  "../../../src/assets/images/students/student10.jpg",
  "../../../src/assets/images/students/student11.jpg",
  "../../../src/assets/images/students/student7.jpg",
  "../../../src/assets/images/students/student8.jpg",
  "../../../src/assets/images/students/student9.jpg",
  "../../../src/assets/images/students/student10.jpg",
  "../../../src/assets/images/students/student11.jpg",
];

const ProfileCard: React.FC<{
  user: UserProps;
  type: "student" | "teacher";
  index: number;
}> = ({ user, type, index }) => {
  const navigate = useNavigate();
  const validIndexes = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const randomIndex =
    validIndexes[Math.floor(Math.random() * validIndexes.length)];
  
  return (
    <button
    onClick={() => navigate(`/user/${user.id}`)}
      className="flex items-center py-4 rounded-lg"
    >
      <img
        src={studentImages[randomIndex]}
        alt={user.name}
        className="w-10 h-10 rounded-full mr-2 bg-background-neutral text-[10px]"
      />
      <div>
        <ThemedText variant="h4">{user.name}</ThemedText>
        {type === "student" && (
          <ThemedText className="text-neutral-text-primary">
            {user.matricule}
          </ThemedText>
        )}
      </div>
    </button>
  );
};

export default ProfileCard;
