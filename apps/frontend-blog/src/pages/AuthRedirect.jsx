import { useNavigate } from "react-router-dom";
import { getToken, isTokenValid } from "../utils/tokenStorage";
import { useEffect } from "react";

const AuthRedirect = ({ children }) => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (isTokenValid(token)) {
      navigate("/home");
    }
  }, [navigate, token]);

  return children;
};

export default AuthRedirect;
