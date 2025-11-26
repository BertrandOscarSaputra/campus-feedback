import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import FeedbackForm from "./pages/FeedbackForm";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./hooks/useAuth";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* FORM FEEDBACK (untuk user biasa) */}
      <Route path="/" element={<FeedbackForm />} />

      {/* LOGIN ADMIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD ADMIN (protected) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
