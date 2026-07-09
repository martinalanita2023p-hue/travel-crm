function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
}) {
  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div className="stat-info">
        <p className="stat-title">
          {title}
        </p>

        <h2 className="stat-value">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;