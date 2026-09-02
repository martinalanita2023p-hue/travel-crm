import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveUser } from "../services/authService";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");


  async function handleLogin(e) {

    e.preventDefault();

    try {

      const user = await login(
        username,
        password
      );

      saveUser(user);


      /* =====================================
         SEND USER TO THEIR DASHBOARD
      ===================================== */

    if (user.role === "Admin") {
  navigate("/admin");
}

else if (user.role === "Manager") {
  navigate("/manager");
}

else if (user.role === "Agent") {
  navigate("/agent");
}

else if (user.role === "Reception") {
  navigate("/reception");
}

else {
  alert("Invalid user role. Please contact the manager.");
}



    }

    catch (err) {

      console.error(
        "Login failed:",
        err
      );

      alert(
        err?.message ||
        "Invalid Username or Password"
      );

    }

  }


  return (

    <div className="login-page">

      <form
        className="login-card"
        onSubmit={handleLogin}
      >

        <h1>
          ✈ Alanita Hub
        </h1>

        <p>
          Login to continue
        </p>


        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          required
        />


        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />


        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

}

export default Login;