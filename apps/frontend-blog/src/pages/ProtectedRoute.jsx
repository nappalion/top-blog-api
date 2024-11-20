import { useNavigate } from "react-router-dom";
import { getToken, isTokenValid } from "../utils/tokenStorage";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!isTokenValid(token)) {
      navigate("/login");
    }
  }, [navigate, token]);

  return children;
};

export default ProtectedRoute;
