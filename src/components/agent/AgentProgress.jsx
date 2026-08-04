import "./AgentProgress.css";

export default function AgentProgress({ report }) {
  const freshCalls = Number(report.fresh_calls || 0);
  const freshTickets = Number(report.fresh_tickets || 0);
  const insurance = Number(report.insurance_sold || 0);
  const toa = Number(report.token_appreciation || 0);

  const conversion =
    freshCalls === 0
      ? 0
      : ((freshTickets / freshCalls) * 100).toFixed(1);

  const target = Math.min((freshCalls / 5) * 100, 100);

  return (
    <div className="agent-progress-card">

      <h2>📈 Today's Performance</h2>

      {/* Fresh Call Target */}

      <div className="progress-item">

        <div className="progress-header">
          <span>🎯 Fresh Call Target</span>
          <strong>{freshCalls} / 5</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${target}%`,
            }}
          />
        </div>

      </div>

      {/* Conversion */}

      <div className="progress-stat">
        <span>📈 Conversion</span>
        <strong>{conversion}%</strong>
      </div>

      {/* Tickets */}

      <div className="progress-stat">
        <span>🎫 Fresh Tickets</span>
        <strong>{freshTickets}</strong>
      </div>

      {/* Insurance */}

      <div className="progress-stat">
        <span>🛡 Insurance</span>
        <strong>{insurance}</strong>
      </div>

      {/* TOA */}

      <div className="progress-stat">
        <span>💰 TOA</span>
        <strong>${toa.toFixed(2)}</strong>
      </div>

      {/* Status */}

      <div className="progress-stat">
        <span>⭐ Status</span>

        <strong
          className={
            freshCalls >= 5
              ? "status-good"
              : "status-warning"
          }
        >
          {freshCalls >= 5
            ? "On Target"
            : "Needs Attention"}
        </strong>
      </div>

      {/* Daily Goal */}

      <div className="daily-goal">

        <h3>🎯 Daily Goal</h3>

        <p>
          Complete at least <strong>5 Fresh Calls</strong>,
          maximize ticket conversion,
          sell insurance whenever possible,
          and collect Google & Trustpilot reviews.
        </p>

      </div>

    </div>
  );
}