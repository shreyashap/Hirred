import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import "./App.css";
import Onboarding from "./pages/Onboarding";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/Custom/ProtectedRoute";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import PublicRoute from "./components/Custom/PublicRoute";

import { GoogleOAuthProvider } from "@react-oauth/google";

import UpdateProfile from "./pages/UpdateProfile";
import RegisterCompany from "./pages/Company/AddCompany";
import RecruiterCompanies from "./pages/Company/Companies";
import JobPage from "./pages/Job";
import MyJobs from "./pages/Company/MyJobs";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Conversation from "./pages/Messaging/Conversation";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <PublicRoute>
            <Onboarding />
          </PublicRoute>
        ),
      },
      {
        path: "/applicant",
        element: (
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        ),
      },
      {
        path: "/recruiter",
        element: (
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile-update/:id",
        element: <UpdateProfile />,
      },
      {
        path: "post-job",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-company",
        element: (
          <ProtectedRoute>
            <RegisterCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "/companies",
        element: (
          <ProtectedRoute>
            <RecruiterCompanies />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/company/:id",
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/company/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-applications",
        element: (
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/:id",
        element: <Conversation />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/reset-password/:id",
        element: <UpdatePassword />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
