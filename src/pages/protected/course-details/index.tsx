import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      navigate(`/courses/${courseId}/announcements`, { replace: true });
    }
  }, [courseId, navigate]);

  return null;
};

export default CourseDetails;