import "./KPIComparison.css";

export default function KPIComparison({ reports }) {

  const sortedCalls = [...reports].sort(
    (a, b) => b.fresh_calls - a.fresh_calls
  );

  const sortedTickets = [...reports].sort(
    (a, b) => b.fresh_tickets - a.fresh_tickets
  );

  const sortedInsurance = [...reports].sort(
    (a, b) => b.insurance_sold - a.insurance_sold
  );

  return (

    <div className="kpi-comparison">

      <div className="kpi-box">

        <h3>📞 Fresh Calls</h3>

        {sortedCalls.slice(0,5).map(agent=>(

          <div
            className="kpi-row"
            key={agent.id}
          >

            <span>{agent.agent_name}</span>

            <strong>{agent.fresh_calls}</strong>

          </div>

        ))}

      </div>

      <div className="kpi-box">

        <h3>🎫 Fresh Tickets</h3>

        {sortedTickets.slice(0,5).map(agent=>(

          <div
            className="kpi-row"
            key={agent.id}
          >

            <span>{agent.agent_name}</span>

            <strong>{agent.fresh_tickets}</strong>

          </div>

        ))}

      </div>

      <div className="kpi-box">

        <h3>🛡 Insurance</h3>

        {sortedInsurance.slice(0,5).map(agent=>(

          <div
            className="kpi-row"
            key={agent.id}
          >

            <span>{agent.agent_name}</span>

            <strong>{agent.insurance_sold}</strong>

          </div>

        ))}

      </div>

    </div>

  );

}