import { Navigate, useLocation } from 'react-router-dom';
import { useStudentSession } from '@/contexts/StudentSessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useStudentSession();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to student dashboard (which shows login) with return URL
    return <Navigate to="/student-dashboard" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
