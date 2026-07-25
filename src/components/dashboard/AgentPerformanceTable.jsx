import "./AgentPerformanceTable.css";

export default function AgentPerformanceTable({
  reports,
  onEdit,
  onDelete,
}) {
  return (
    <div className="performance-card">
      <h2>👥 Agent Performance</h2>

      <table className="performance-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Fresh Calls</th>
            <th>Name Calls</th>
            <th>MAC Calls</th>
            <th>Manager Calls</th>
            <th>Airport Calls</th>
            <th>Tickets</th>
            <th>PNRs</th>
            <th>Insurance</th>
            <th>Google</th>
            <th>Trustpilot</th>
            <th>TOA ($)</th>
            <th>Conversion</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="14" className="no-data">
                No reports found.
              </td>
            </tr>
          ) : (
            reports.map((report) => {
              const freshCalls = Number(report.fresh_calls || 0);
              const tickets = Number(report.fresh_tickets || 0);

              const conversion =
                freshCalls === 0
                  ? 0
                  : Number(((tickets / freshCalls) * 100).toFixed(1));

              return (
                <tr key={report.id}>
                  <td>{report.agent_name}</td>

                  {/* Fresh Calls */}
                  <td
                    className={
                      freshCalls >= 5
                        ? "target-met"
                        : "target-missed"
                    }
                  >
                    {freshCalls}
                  </td>

                  {/* Name Calls */}
                  <td>{report.name_calls || 0}</td>

                  {/* MAC Calls */}
                  <td>{report.mac_calls || 0}</td>

                  {/* Manager Calls */}
                  <td>{report.manager_calls || 0}</td>

                  {/* Airport Calls */}
                  <td>{report.airport_calls || 0}</td>

                  {/* Tickets */}
                  <td>{tickets}</td>

                  {/* PNRs */}
                  <td>{report.pnrs_created || 0}</td>

                  {/* Insurance */}
                  <td>{report.insurance_sold || 0}</td>

                  {/* Google */}
                  <td>{report.google_reviews || 0}</td>

                  {/* Trustpilot */}
                  <td>{report.trustpilot_reviews || 0}</td>

                  {/* TOA */}
                  <td>${Number(report.token_appreciation || 0)}</td>

                  {/* Conversion */}
                  <td
                    className={
                      conversion >= 80
                        ? "conversion-good"
                        : conversion >= 60
                        ? "conversion-average"
                        : "conversion-poor"
                    }
                  >
                    {conversion}%
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => onEdit?.(report)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => onDelete?.(report)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}