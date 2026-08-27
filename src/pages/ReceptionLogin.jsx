import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveUser } from "../services/authService";
import "../styles/login.css";

function ReceptionLogin() {

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


      /* =====================================
         ONLY RECEPTION USERS ALLOWED
      ===================================== */

      if (user.role !== "Reception") {

        alert(
          "This login is for Reception users only."
        );

        return;

      }


      saveUser(user);

      navigate("/reception");

    }

    catch (err) {

      console.error(
        "Reception login failed:",
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
          ☎ Alanita Hub
        </h1>


        <p>
          Reception Login
        </p>


        <input
          id="reception-username"
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
          id="reception-password"
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


export default ReceptionLogin;