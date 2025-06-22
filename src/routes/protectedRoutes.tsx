import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CourseDetailsLayout from "@/components/layout/CourseDetailsLayout";
import Home from "@/pages/protected/home";
import Courses from "@/pages/protected/courses";
import CourseDetails from "@/pages/protected/course-details";
import CourseAnnouncements from "@/pages/protected/course-announcements";
import CourseAnnouncementDetails from "@/pages/protected/course-announcements-details";
import CourseContent from "@/pages/protected/content";
import Assignments from "@/pages/protected/assignments";
import AssignmentDetails from "@/pages/protected/assignment-details";
import People from "@/pages/protected/people";
import UserDetails from "@/pages/protected/user-details";
import Announcements from "@/pages/protected/announcements";
import AnnouncementDetails from "@/pages/protected/announcement-details";
import Notifications from "@/pages/protected/notifications";
import UpcomingDeadlines from "@/pages/protected/upcoming-deadlines";
import HelpAndSupport from "@/pages/protected/help-and-support";
import Curriculums from "@/pages/protected/curriculums";
import AboutFET from "@/pages/protected/about-fet";
import EditProfile from "@/pages/protected/edit-profile";
import Settings from "@/pages/protected/settings";
import NotFound from "@/pages/protected/not-found";
import SearchStudentsPage from "@/pages/protected/search/SearchStudents";
import SearchTeachersPage from "@/pages/protected/search/SearchTeachers";
import UploadRevisionQuestions from "@/pages/protected/create/UploadRevisionQuestions";
import UploadCourseContent from "@/pages/protected/create/UploadCourseContent";
import RevisionQuestions from "@/pages/protected/revisions-questions/RevisionQuestions";

export const protectedRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetailsLayout />}>
        <Route index element={<CourseDetails />} />
        <Route
          path="/courses/:courseId/announcements"
          element={<CourseAnnouncements />}
        />
        <Route
          path="/courses/:courseId/announcements/:announcementId"
          element={<CourseAnnouncementDetails />}
        />
        <Route path="/courses/:courseId/content" element={<CourseContent />} />
        <Route path="/courses/:courseId/revision-questions" element={<RevisionQuestions />} />
        <Route
          path="/courses/:courseId/assignments"
          element={<Assignments />}
        />
        <Route
          path="/courses/:courseId/assignments/:assignmentId"
          element={<AssignmentDetails />}
        />
        <Route path="/courses/:courseId/people" element={<People />} />
        <Route
          path="/courses/:courseId/people/:personId"
          element={<UserDetails />}
        />
      </Route>
      <Route
        path="/create/:courseId/search/student"
        element={<SearchStudentsPage />}
      />
      <Route
        path="/create/:courseId/search/teacher"
        element={<SearchTeachersPage />}
      />
      <Route
        path="/create/:courseId/content"
        element={<UploadCourseContent />}
      />
      <Route
        path="/create/:courseId/revision-questions"
        element={<UploadRevisionQuestions />}
      />

      <Route path="/announcements" element={<Announcements />} />
      <Route
        path="/announcements/:announcementId"
        element={<AnnouncementDetails />}
      />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/upcoming-deadlines" element={<UpcomingDeadlines />} />
      <Route path="/help-and-support" element={<HelpAndSupport />} />
      <Route path="/curriculums" element={<Curriculums />} />
      <Route path="/about-fet" element={<AboutFET />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
);
