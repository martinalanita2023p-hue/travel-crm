import "./RecentActivity.css";

export default function RecentActivity({ reports }) {
  const recent = [...reports]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    )
    .slice(0, 10);

  return (
    <div className="activity-card">

      <h2>🕒 Recent Activity</h2>

      {recent.length === 0 ? (
        <p>No reports submitted today.</p>
      ) : (
        recent.map((report) => (
          <div
            key={report.id}
            className="activity-item"
          >
            <div>

              <strong>{report.agent_name}</strong>

              <p>
                submitted today's report
              </p>

            </div>

            <span>
              {new Date(
                report.created_at
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))
      )}
    </div>
  );
}