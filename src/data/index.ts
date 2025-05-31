// Mock data for courses
export const courses = [
  { id: 1, courseCode: "CS101", title: "Introduction to Programming", description: "Learn the basics of programming with Python." },
];

// Mock data for announcements
export const courseAnnouncementsData = [
  { id: 1, author: "Prof. Smith", timestamp: "2h ago", text: "Class canceled tomorrow due to faculty meeting." },
];

// Mock data for assignments
export const assignments = [
  { id: 1, title: "Python Basics", description: "Complete the Python exercises in Chapter 1.", date: "May 31, 2025" },
];

// Mock data for files
export const files = [
  { id: 1, name: "Lecture 1 Slides", type: "pdf", pages: 20, size: "1.2 MB", date: "May 20, 2025" },
];

// Mock data for users
export const users = {
  teachers: [{ id: 1, name: "Prof. Smith", imageUri: "https://via.placeholder.com/40" }],
  students: [{ id: 2, name: "John Doe", matricule: "STU123", imageUri: "https://via.placeholder.com/40" }],
};