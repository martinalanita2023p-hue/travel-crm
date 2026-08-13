import { useState } from "react";

import Layout from "../components/Layout";

import {
  getUser,
  logout,
} from "../services/authService";

import { useNavigate } from "react-router-dom";

import "../styles/settings.css";


export default function Settings() {

  const navigate = useNavigate();

  const user = getUser();


  /* =====================================================
     DEFAULT DASHBOARD VIEW
  ===================================================== */

  const [defaultView, setDefaultView] =
    useState(
      localStorage.getItem(
        "defaultDashboardView"
      ) || "month"
    );


  const [saved, setSaved] =
    useState(false);


  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  function saveSettings() {

    localStorage.setItem(
      "defaultDashboardView",
      defaultView
    );


    setSaved(true);


    setTimeout(() => {

      setSaved(false);

    }, 2000);

  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function handleLogout() {

    logout();

    navigate("/login");

  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <Layout title="Settings">

      <div className="settings-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="settings-header">

          <div>

            <h1>
              ⚙️ Settings
            </h1>

            <p>
              Manage your profile and dashboard preferences.
            </p>

          </div>

        </div>


        {/* =================================================
            PROFILE
        ================================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h2>
                👤 Profile
              </h2>

              <p>
                Your current account information.
              </p>

            </div>

          </div>


          <div className="settings-grid">


            {/* NAME */}

            <div className="settings-field">

              <label>
                Name
              </label>

              <div className="settings-value">

                {user?.name ||
                  "Not available"}

              </div>

            </div>


            {/* USERNAME */}

            <div className="settings-field">

              <label>
                Username
              </label>

              <div className="settings-value">

                {user?.username ||
                  "Not available"}

              </div>

            </div>


            {/* ROLE */}

            <div className="settings-field">

              <label>
                Role
              </label>

              <div className="settings-value role-value">

                {user?.role ||
                  "Not available"}

              </div>

            </div>


          </div>

        </section>


        {/* =================================================
            PREFERENCES
        ================================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h2>
                🎛️ Preferences
              </h2>

              <p>
                Personal dashboard preferences.
              </p>

            </div>

          </div>


          <div className="settings-grid">


            {/* DEFAULT DASHBOARD VIEW */}

            <div className="settings-field">

              <label>
                Default Dashboard View
              </label>

              <select
                value={defaultView}
                onChange={(e) =>
                  setDefaultView(
                    e.target.value
                  )
                }
              >

                <option value="day">
                  Day
                </option>

                <option value="week">
                  Week
                </option>

                <option value="month">
                  Month
                </option>

              </select>

            </div>


            {/* FIXED TIMEZONE */}

            <div className="settings-field">

              <label>
                Time Zone
              </label>

              <div className="settings-value">

                Eastern Time (Boston)

              </div>

            </div>


          </div>


          {/* =================================================
              SAVE
          ================================================= */}

          <div className="settings-save-row">

            <button
              type="button"
              className="settings-save-btn"
              onClick={saveSettings}
            >

              💾 Save Preferences

            </button>


            {saved && (

              <span className="settings-saved-message">

                ✓ Settings saved

              </span>

            )}

          </div>

        </section>


        {/* =================================================
            SECURITY
        ================================================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div>

              <h2>
                🔐 Security
              </h2>

              <p>
                Account and session controls.
              </p>

            </div>

          </div>


          <div className="settings-actions">


            <button
              type="button"
              className="settings-secondary-btn"
              onClick={() =>
                alert(
                  "Password management will be added here."
                )
              }
            >

              🔑 Change Password

            </button>


            <button
              type="button"
              className="settings-danger-btn"
              onClick={handleLogout}
            >

              🚪 Logout

            </button>


          </div>

        </section>


      </div>

    </Layout>

  );

}