import { NavLink } from "react-router-dom";

export default function Sidebar() {

  return (

    <aside className="sidebar">

      <div className="sidebar-logo">

        <h2>Alanita Hub</h2>

        <p>Management Portal</p>

      </div>

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

      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-user">

        <div className="sidebar-avatar">

          👤

        </div>

        <div>

          <h4>Manager</h4>

          <span>Administrator</span>

        </div>

      </div>

    </aside>

  );

}