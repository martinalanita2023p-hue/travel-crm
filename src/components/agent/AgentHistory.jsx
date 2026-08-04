import "./AgentHistory.css";

export default function AgentHistory({ reports = [] }) {

  return (

    <div className="agent-history-card">

      <div className="history-header">

        <h2>📋 Recent Reports</h2>

        <span>Last 7 Days</span>

      </div>

      <table className="agent-history-table">

        <thead>

          <tr>

            <th>Date</th>

            <th>Fresh Calls</th>

            <th>Tickets</th>

            <th>Insurance</th>

            <th>TOA</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {reports.length === 0 ? (

            <tr>

              <td colSpan="6">

                No reports found.

              </td>

            </tr>

          ) : (

            reports.slice(0,7).map((report,index)=>(

              <tr key={index}>

                <td>{report.report_date}</td>

                <td>{report.fresh_calls}</td>

                <td>{report.fresh_tickets}</td>

                <td>{report.insurance_sold}</td>

                <td>

                  ${Number(
                    report.token_appreciation || 0
                  ).toFixed(2)}

                </td>

                <td>

                  <span className="submitted">

                    Submitted

                  </span>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}