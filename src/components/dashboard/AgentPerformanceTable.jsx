import "./AgentPerformanceTable.css";

export default function AgentPerformanceTable({
  reports,
  onEdit,
  onDelete,
}) {

  return (

    <div className="table-card">

      <div className="table-header">

        <h2>👥 Agent Performance</h2>

        <span>
          {reports.length} Agent(s)
        </span>

      </div>

      <div className="table-wrapper">

        <table className="performance-table">

          <thead>

            <tr>

              <th>Agent</th>

              <th>Fresh</th>

              <th>Name</th>

              <th>MAC</th>

              <th>Manager</th>

              <th>Airport</th>

              <th>Tickets</th>

              <th>PNRs</th>

              <th>Insurance</th>

              <th>Google</th>

              <th>Trustpilot</th>

              <th>TOA</th>

              <th>Conversion</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {reports.length === 0 ? (

              <tr>

                <td
                  colSpan="14"
                  className="no-data"
                >

                  No reports found.

                </td>

              </tr>

            ) : (

              reports.map((report) => {

                const fresh =
                  Number(
                    report.fresh_calls || 0
                  );

                const tickets =
                  Number(
                    report.fresh_tickets || 0
                  );

                const conversion =
                  fresh === 0
                    ? 0
                    : Number(
                        (
                          (tickets / fresh) *
                          100
                        ).toFixed(1)
                      );

                return (

                  <tr key={report.id}>

                    <td className="agent-name">

                      👤 {report.agent_name}

                    </td>

                    <td>{fresh}</td>

                    <td>
                      {report.name_calls || 0}
                    </td>

                    <td>
                      {report.mac_calls || 0}
                    </td>

                    <td>
                      {report.manager_calls || 0}
                    </td>

                    <td>
                      {report.airport_calls || 0}
                    </td>

                    <td className="ticket-cell">

                      {tickets}

                    </td>

                    <td>

                      {report.pnrs_created || 0}

                    </td>

                    <td>

                      {report.insurance_sold || 0}

                    </td>

                    <td>

                      {report.google_reviews || 0}

                    </td>

                    <td>

                      {report.trustpilot_reviews || 0}

                    </td>

                    <td>

                      $

                      {Number(
                        report.token_appreciation || 0
                      )}

                    </td>

                    <td>

                      <span
                        className={
                          conversion >= 80
                            ? "badge green"

                            : conversion >= 60

                            ? "badge orange"

                            : "badge red"
                        }
                      >

                        {conversion}%

                      </span>

                    </td>

                    <td>

                      <div className="actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            onEdit(report)
                          }
                        >

                          ✏️

                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            onDelete(report)
                          }
                        >

                          🗑

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

    </div>

  );

}