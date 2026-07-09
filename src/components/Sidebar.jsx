import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Travel CRM</h2>

      <ul>
        <li>
          <NavLink to="/manager">🏠 Manager</NavLink>
        </li>
        
        <li>
  <NavLink to="/agent">
    👨‍💼 Agent
  </NavLink>
</li>

        <li>
          <NavLink to="/reception">📞 Reception</NavLink>
        </li>
      </ul>
    </div>
  );
  
}

export default Sidebar;