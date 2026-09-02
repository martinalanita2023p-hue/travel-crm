import { NavLink } from "react-router-dom";
import { getUser } from "../services/authService";


export default function Sidebar() {

  const user = getUser();

  const isAdmin =
    user?.role === "Admin";


  return (

    <aside className="sidebar">


      {/* =====================================
          LOGO
      ===================================== */}

      <div className="sidebar-logo">

        <h2>
          Alanita Hub
        </h2>

        <p>
          Management Portal
        </p>

      </div>


      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav>


        <NavLink to="/manager">

          📊 Dashboard

        </NavLink>


        <NavLink to="/agent">

          👨‍💼 Agents

        </NavLink>


        <NavLink to="/reception">

          ☎ Reception

        </NavLink>


        <NavLink to="/reports">

          📈 Reports

        </NavLink>


        <NavLink to="/settings">

          ⚙ Settings

        </NavLink>


        {/* =====================================
            ADMIN
            ONLY VISIBLE TO ADMIN
        ===================================== */}

        {isAdmin && (

          <NavLink to="/admin">

            🛠 Admin

          </NavLink>

        )}


      </nav>


      {/* =====================================
          SPACER
      ===================================== */}

      <div className="sidebar-spacer" />


      {/* =====================================
          LOGGED-IN USER
      ===================================== */}

      <div className="sidebar-user">

        <div className="sidebar-avatar">

          👤

        </div>


        <div>

          <h4>

            {user?.name ||
             user?.username ||
             "User"}

          </h4>


          <span>

            {user?.role ||
             "User"}

          </span>

        </div>

      </div>


    </aside>

  );

}