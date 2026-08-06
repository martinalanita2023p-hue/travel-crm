import "./TeamTable.css";
import reportFields from "../../../constants/reportFields";
import performanceScore from "../../../utils/performanceScore";

export default function TeamTable({
  reports,
  onAnalytics,
  visibleColumns,
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

            {reportFields
              .filter(field => field.showInTable)
              .sort((a, b) => a.order - b.order)
              .map(field => (

                <th key={field.key}>
                  {field.short}
                </th>

              ))}

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

                  {report.agent_name
                    ?.charAt(0)
                    ?.toUpperCase()}

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

              {reportFields
                .filter(field => field.showInTable)
                .sort((a, b) => a.order - b.order)
                .map(field => (

                  <td key={field.key}>

                    {field.type === "currency"

                      ? `$${Number(
                          report[field.key] || 0
                        ).toFixed(2)}`

                      : report[field.key] || 0}

                  </td>

                ))}

              <td>

                <button
                  className="view-btn"
                  onClick={() =>
                    onAnalytics(report)
                  }
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