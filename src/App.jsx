import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import AppLayout from "./layout/app-layout";
import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import JobListing from "./pages/job-listing";
import JobPage from "./pages/job";
import PostJob from "./pages/post-job";
import SavedJobs from "./pages/saved-job";
import MyJobs from "./pages/my-jobs";

import { ThemeProvider } from "./components/ui/theme-provider";
import ProtectedRoute from "./components/protected-route";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            
            {/* Public Route */}
            <Route index element={<LandingPage />} />

            {/* Protected Routes */}
            <Route
              path="onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="jobs"
              element={
                <ProtectedRoute>
                  <JobListing />
                </ProtectedRoute>
              }
            />

            <Route
              path="jobs/:id"
              element={
                <ProtectedRoute>
                  <JobPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="post-job"
              element={
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="my-jobs"
              element={
                <ProtectedRoute>
                  <MyJobs />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;