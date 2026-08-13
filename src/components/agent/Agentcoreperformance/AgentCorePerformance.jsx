import "./AgentCorePerformance.css";


export default function AgentCorePerformance({
  stats,
  conversion,
  loading,
  fromDate,
  toDate,
}) {

  if (loading) {

    return (
      <section className="agent-core-performance">

        <div className="agent-core-header">

          <h3>My Performance</h3>

          <span>
            {fromDate} → {toDate}
          </span>

        </div>

        <div className="agent-core-loading">
          Loading performance...
        </div>

      </section>
    );

  }


  return (
    <section className="agent-core-performance">

      <div className="agent-core-header">

        <h3>My Performance</h3>

        <span>
          {fromDate} → {toDate}
        </span>

      </div>


      <div className="agent-core-grid">

        <div className="agent-core-card">
          <span>Fresh Calls</span>

          <strong>
            {stats.freshCalls}
          </strong>
        </div>


        <div className="agent-core-card">
          <span>Fresh Tickets</span>

          <strong>
            {stats.freshTickets}
          </strong>
        </div>


        <div className="agent-core-card">
          <span>Conversion</span>

          <strong>
            {Number(conversion).toFixed(1)}%
          </strong>
        </div>


        <div className="agent-core-card">
          <span>Insurance</span>

          <strong>
            {stats.insurance}
          </strong>
        </div>

      </div>

    </section>
  );
}