function AgentTable({
  reports,
  onEdit,
  onDelete,
}) {

  if (reports.length === 0) {
    return (
      <div className="no-data">
        No reports submitted for this date.
      </div>
    );
  }

  return (
    <div className="table-container">

      <table className="agent-table">

        <thead>

          <tr>

            <th>Agent</th>

            <th>Fresh</th>

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

          {reports.map((report) => {

            const conversion =
              Number(report.fresh_calls) === 0
                ? 0
                : (
                    (Number(report.fresh_tickets) /
                      Number(report.fresh_calls)) *
                    100
                  ).toFixed(2);

            return (

              <tr key={report.id}>

                <td>{report.agent_name}</td>

                <td>{report.fresh_calls}</td>

                <td>{report.fresh_tickets}</td>

                <td>{report.pnrs_created}</td>

                <td>{report.insurance_sold}</td>

                <td>{report.google_reviews}</td>

                <td>{report.trustpilot_reviews}</td>

                <td>${report.token_appreciation}</td>

                <td>{conversion}%</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => onEdit(report)}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(report.id)}
                  >
                    🗑
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

export default AgentTable;