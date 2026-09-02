import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

import "../styles/layout.css";
import "../styles/sidebar.css";

import {
  getUser,
  logout,
} from "../services/authService";

import {
  formatBostonDate,
  formatBostonTime,
} from "../utils/bostonTime";

export default function Layout({
  title,
  children,
}) {

  const navigate = useNavigate();

  const user = getUser();

  const now = new Date();

  const date = formatBostonDate(now, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = formatBostonTime(now);

  function handleLogout() {

    logout();

    navigate("/login");

  }

  return (

    <div className="app-layout">

      <Sidebar />

      <div className="main-layout">

        <header className="header">

          <div className="header-left">

            <div className="header-title">

              <h1>

                {title || "Alanita Hub"}

              </h1>

              <p>

                {date}

                &nbsp;&nbsp;

                🟢 {time}

              </p>

            </div>

          </div>

          <div className="header-right">

            <div className="user-card">

              <div className="avatar">

                👤

              </div>

              <div>

                <h4>

                  {user?.username || "User"}

                </h4>

              </div>

            </div>

            <button

              className="logout-btn"

              onClick={handleLogout}

            >

              Logout

            </button>

          </div>

        </header>

        <main className="content">

          {children}

        </main>

      </div>

    </div>

  );

}