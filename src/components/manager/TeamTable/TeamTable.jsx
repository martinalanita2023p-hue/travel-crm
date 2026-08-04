import "./TeamTable.css";

export default function TeamTable({
  reports,
  onAnalytics,
}) {
  return (
    <div className="team-table-card">

      <div className="team-header">

        <div>

          <h2>👥 Team Performance</h2>

          <p>Monitor your team's daily performance</p>

        </div>

      </div>

      <table className="team-table">

        <thead>

          <tr>

            <th>Agent</th>

            <th>Calls</th>

            <th>Tickets</th>

            <th>Conversion</th>

            <th>Insurance</th>

            <th>Reviews</th>

            <th>TOA</th>

            <th>Status</th>

            <th></th>

          </tr>

        </thead>

        <tbody>

          {reports.map((report) => {

            const conversion =
              Number(report.fresh_calls) === 0
                ? 0
                : (
                    (Number(report.fresh_tickets) /
                      Number(report.fresh_calls)) *
                    100
                  ).toFixed(1);

            return (

              <tr key={report.id}>

                <td className="agent-cell">

                  <div className="avatar">

                    {report.agent_name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <strong>

                      {report.agent_name}

                    </strong>

                    <p>Travel Consultant</p>

                  </div>

                </td>

                <td>{report.fresh_calls}</td>

                <td>{report.fresh_tickets}</td>

                <td>{conversion}%</td>

                <td>{report.insurance_sold}</td>

                <td>

                  {Number(report.google_reviews) +
                    Number(report.trustpilot_reviews)}

                </td>

                <td>

                  $

                  {Number(
                    report.token_appreciation
                  ).toFixed(0)}

                </td>

                <td>

                  <span className="status">

                    🟢 Active

                  </span>

                </td>

                <td>

                  <button
                    className="analytics-btn"
                    onClick={() =>
                      onAnalytics(report)
                    }
                  >

                    📊 View

                  </button>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}