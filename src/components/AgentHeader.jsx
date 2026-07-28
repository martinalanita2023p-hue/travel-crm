import { getUser } from "../services/AuthService";

function AgentHeader() {

  const user = getUser();

  const today = new Date();

  return (

    <div className="agent-header-card">

      <div className="agent-profile">

        <div className="avatar">

          {user?.name?.charAt(0).toUpperCase()}

        </div>

        <div>

          <h2>{user?.name}</h2>

          <p>{user?.role}</p>

        </div>

      </div>

      <div className="header-item">

        <span>Report Date</span>

        <strong>{today.toLocaleDateString()}</strong>

      </div>

      <div className="header-item">

        <span>Day</span>

        <strong>
          {today.toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </strong>

      </div>

      <div className="header-item">

        <span>Days Present</span>

        <strong>Loading...</strong>

      </div>

    </div>

  );

}

export default AgentHeader;