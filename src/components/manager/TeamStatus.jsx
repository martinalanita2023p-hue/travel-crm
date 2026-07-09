function TeamStatus({ stats }) {

  const percentage =
    stats.totalAgents === 0
      ? 0
      : Math.round(
          (stats.submittedAgents / stats.totalAgents) * 100
        );

  return (
    <div className="team-status">

      <h2>👥 Team Status</h2>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`
          }}
        />
      </div>

      <div className="team-grid">

        <div className="team-box">
          <h3>Submitted</h3>
          <h1>{stats.submittedAgents}</h1>
        </div>

        <div className="team-box">
          <h3>Missing</h3>
          <h1>{stats.missingAgents}</h1>
        </div>

        <div className="team-box">
          <h3>Total Agents</h3>
          <h1>{stats.totalAgents}</h1>
        </div>

      </div>

    </div>
  );
}

export default TeamStatus;