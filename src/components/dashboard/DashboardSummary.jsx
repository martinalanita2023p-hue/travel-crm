import "./DashboardSummary.css";

function Card({ title, value, icon, color }) {
  return (
    <div
      className="summary-card"
      style={{ borderTop: `5px solid ${color}` }}
    >
      <div className="summary-icon">{icon}</div>

      <div className="summary-info">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default function DashboardSummary({ stats }) {
  const submissionPercentage =
    stats.totalAgents === 0
      ? 0
      : (
          (stats.submittedAgents / stats.totalAgents) *
          100
        ).toFixed(1);

  return (
    <div className="summary-grid">

      <Card
        title="Total Agents"
        value={stats.totalAgents}
        icon="👥"
        color="#2563eb"
      />

      <Card
        title="Submitted"
        value={stats.submittedAgents}
        icon="✅"
        color="#16a34a"
      />

      <Card
        title="Submission %"
        value={`${submissionPercentage}%`}
        icon="📊"
        color="#9333ea"
      />

    </div>
  );
}