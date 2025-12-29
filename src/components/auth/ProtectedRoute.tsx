import { Navigate, useLocation } from 'react-router-dom';
import { useGhostSession } from '@/contexts/GhostSessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useGhostSession();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to identity page with return URL
    return <Navigate to="/identity" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
