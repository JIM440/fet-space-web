import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import NotFound from "./pages/protected/not-found";
import { ThemeProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  authRoutes,
  protectedRoutes,
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
