import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveUser } from "../services/authService";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const user = await login(
        username,
        password
      );

      saveUser(user);

      if (user.role === "Manager") {

        navigate("/manager");

      } else {

        navigate("/agent");

      }

    } catch (err) {

      alert(err.message);

    }

  }

  return (

    <div className="login-page">

      <form
        className="login-card"
        onSubmit={handleLogin}
      >

        <h1>✈ Alanita Hub</h1>

        <p>
          Login to continue
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />

        <button type="submit">

          Login

        </button>

      </form>

    </div>

  );

}

export default Login;