import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/sidebar.css";

import {
  getUser,
  logout,
} from "../services/authService";

function Layout({ title, children }) {

  const navigate = useNavigate();

  const user = getUser();

  const today = new Date();

  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleLogout() {

    logout();

    navigate("/login");

  }

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1 }}>

        <header className="header">

          <div>

            <h1 className="welcome-title">

              👋 Welcome, {user?.username}

            </h1>

            <div className="header-date">

              {date}

              &nbsp;&nbsp;🕓 {time}

            </div>

            <h2>{title}</h2>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </header>

        <main className="content">

          {children}

        </main>

      </div>

    </div>

  );

}

export default Layout;