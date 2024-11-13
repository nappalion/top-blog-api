import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/tokenStorage";

function NavBar() {
  const navigate = useNavigate();

  const onLogOut = () => {
    removeToken();
    navigate("/");
  };

  return <button onClick={onLogOut}>Log out</button>;
}

export default NavBar;
