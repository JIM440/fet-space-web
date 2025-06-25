import ThemedText from "@/components/commons/typography/ThemedText";

// Assignment interface updated to include courseId and description
interface Assignment {
  assignment_id: number;
  title: string;
  course_title: string;
  due_date: string;
  courseId: number;
  description?: string;
}

// Reusable DeadlineCard component
interface DeadlineCardProps {
  assignment: Assignment;
  onClick: (assignmentId: number, courseId: number) => void;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({ assignment, onClick }) => {
  const currentDate = new Date().getTime();
  const dueDate = new Date(assignment.due_date).getTime();
  const isPastDue = dueDate < currentDate;

  return (
    <button
      className={`p-4 border-1 border-neutral-border cursor-pointer'
      `}
      onClick={() => onClick(assignment.assignment_id, assignment.courseId)}
    >
      <ThemedText variant="h3" className="text-left text-neutral-text-primary">
        {assignment.title} - {assignment.course_title}
      </ThemedText>
      {assignment.description && (
        <ThemedText  className="text-left mt-2 ">
          {assignment.description}
        </ThemedText>
      )}
      <ThemedText
        variant="caption"
        className={`text-left block mt-2 ${
          isPastDue ? 'text-error' : 'text-neutral-text-tertiary'
        }`}
      >
        Due: {new Date(assignment.due_date).toLocaleString()} {isPastDue && '(Past Due )'}
      </ThemedText>
    </button>
  );
};

export default DeadlineCard;