import CourseDetailsLayout from "@/components/layout/CourseDetailsLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AboutFET from "@/pages/protected/about-fet";
import Announcements from "@/pages/protected/announcement-details";
import AnnouncementDetails from "@/pages/protected/announcements";
import AssignmentDetails from "@/pages/protected/assignment-details";
import Assignments from "@/pages/protected/assignments";
import CourseContent from "@/pages/protected/content";
import CourseAnnouncements from "@/pages/protected/course-announcements";
import CourseAnnouncementDetails from "@/pages/protected/course-announcements-details";
import CourseDetails from "@/pages/protected/course-details";
import Courses from "@/pages/protected/courses";
import Curriculums from "@/pages/protected/curriculums";
import EditProfile from "@/pages/protected/edit-profile";
import HelpAndSupport from "@/pages/protected/help-and-support";
import Home from "@/pages/protected/home";
import NotFound from "@/pages/protected/not-found";
import Notifications from "@/pages/protected/notifications";
import People from "@/pages/protected/people";
import Settings from "@/pages/protected/settings";
import UpcomingDeadlines from "@/pages/protected/upcoming-deadlines";
import UserDetails from "@/pages/protected/user-details";

export const protectedRoutes = {
  // path: '/courses',
  path: "/",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "/courses",
      element: <Courses />,
    },
    {
      path: "/courses/:courseId",
      element: <CourseDetailsLayout />,
      children: [
        {
          index: true,
          element: <CourseDetails />,
        },
        {
          path: "/courses/:courseId/announcements",
          element: <CourseAnnouncements />,
        },
        {
          path: "/courses/:courseId/announcements/:announcementId",
          element: <CourseAnnouncementDetails />,
        },
        {
          path: "/courses/:courseId/content",
          element: <CourseContent />,
        },
        {
          path: "/courses/:courseId/assignments",
          element: <Assignments />,
        },
        {
          path: "/courses/:courseId/assignments/:assignmentId",
          element: <AssignmentDetails />,
        },
        {
          path: "/courses/:courseId/people",
          element: <People />,
        },
        {
          path: "/courses/:courseId/people/:personId",
          element: <UserDetails />,
        },
      ],
    },
    {
      path: "/announcements",
      element: <Announcements />,
    },
    {
      path: "/announcements/:announcementId",
      element: <AnnouncementDetails />,
    },
    {
      path: "/notifications",
      element: <Notifications />,
    },
    {
      path: "/upcoming-deadlines",
      element: <UpcomingDeadlines />,
    },
    {
      path: "/help-and-support",
      element: <HelpAndSupport />,
    },
    {
      path: "/curriculums",
      element: <Curriculums />,
    },
    {
      path: "/about-fet",
      element: <AboutFET />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};
