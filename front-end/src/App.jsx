import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ResumeProvider } from "./pages/resumecontext";
import Templete from "./pages/templete";
import Form from "./pages/form";
import ResumeView from "./pages/ResumeView";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ResumeProvider>
      <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <Templete />
              </ProtectedRoute>
            } />
            <Route path="/form" element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            } />
            <Route path="/view" element={<ResumeView />} />

            {/* Redirect root to dashboard if logged in? Or just keep templates as home. */}
            {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </ResumeProvider>
  );
}

export default App;
