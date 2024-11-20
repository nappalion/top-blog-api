import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/tokenStorage";

function Login() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { username, password };

    try {
      const tokenResponse = await fetch(baseUrl + "/sessions", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        setToken(token);
        console.log("Token stored in localStorage:", token);
        navigate("/home");
      } else {
        console.log("Token creation failed.");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Log in</button>
      </form>
      <p>Need an account?</p>
      <button onClick={() => navigate("/")}>Sign up</button>
    </div>
  );
}

export default Login;
