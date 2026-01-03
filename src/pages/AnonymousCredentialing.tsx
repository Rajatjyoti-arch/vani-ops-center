import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentSession } from "@/contexts/StudentSessionContext";

// Redirect to Student Dashboard - Anonymous Credentialing is now handled via OTP
const AnonymousCredentialing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStudentSession();

  useEffect(() => {
    // Redirect to student dashboard which handles authentication
    navigate("/student-dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default AnonymousCredentialing;
