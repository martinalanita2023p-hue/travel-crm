import "./TeamTable.css";
import performanceScore from "../../../utils/performanceScore";

export default function TeamTable({
  reports,
  onAnalytics,
}) {

  const rankedReports = [...reports]
    .map(report => ({
      ...report,
      score: performanceScore(report),
    }))
    .sort((a, b) => b.score - a.score);

  return (

    <div className="team-table-card">

      <div className="team-table-header">

        <div>

          <h2>👥 Team Performance</h2>

          <p>Daily Team Overview</p>

        </div>

      </div>

      <table className="team-table">

        <thead>

          <tr>

            <th>Rank</th>

            <th>Agent</th>

            <th>Fresh Calls</th>

            <th>Fresh Tickets</th>

            <th>SC Calls</th>

            <th>Insurance</th>

            <th>Google</th>

            <th>Trustpilot</th>

            <th>TOA</th>

            <th>PNRs</th>

            <th>📊</th>

          </tr>

        </thead>

        <tbody>

          {rankedReports.map((report, index) => (

            <tr key={report.id}>

              <td>

                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : index + 1}

              </td>

              <td className="agent-cell">

                <div className="avatar">

                  {report.agent_name?.charAt(0)?.toUpperCase()}

                </div>

                <div>

                  <strong>

                    {report.agent_name}

                  </strong>

                  <small>

                    Travel Consultant

                  </small>

                </div>

              </td>

              <td>

                {report.fresh_calls || 0}

              </td>

              <td>

                {report.fresh_tickets || 0}

              </td>

              <td>

                {report.sc_calls || 0}

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
                ).toFixed(2)}

              </td>

              <td>

                {report.pnrs_created || 0}

              </td>

              <td>

                <button
                  className="view-btn"
                  onClick={() => onAnalytics(report)}
                >

                  📊

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}