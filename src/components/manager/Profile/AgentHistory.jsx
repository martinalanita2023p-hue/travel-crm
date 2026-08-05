import "./AgentHistory.css";

export default function AgentHistory({
    history = [],
}) {

    return (

        <div className="history-card">

            <h3>📅 Report History</h3>

            <table className="history-table">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Fresh Calls</th>

                        <th>Tickets</th>

                        <th>Insurance</th>

                        <th>TOA</th>

                    </tr>

                </thead>

                <tbody>

                    {history.map((item) => (

                        <tr key={item.id}>

                            <td>{item.report_date}</td>

                            <td>{item.fresh_calls}</td>

                            <td>{item.fresh_tickets}</td>

                            <td>{item.insurance_sold}</td>

                            <td>
                                $
                                {Number(
                                    item.token_appreciation || 0
                                ).toFixed(2)}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}