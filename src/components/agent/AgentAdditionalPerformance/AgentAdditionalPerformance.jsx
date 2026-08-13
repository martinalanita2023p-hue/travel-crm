import "./AgentAdditionalPerformance.css";


export default function AgentAdditionalPerformance({
  stats,
  loading,
  fromDate,
  toDate,
}) {

  if (loading) {

    return (
      <section className="agent-additional-performance">

        <div className="agent-additional-header">

          <h3>Additional Performance</h3>

          <span>
            {fromDate} → {toDate}
          </span>

        </div>

        <div className="agent-additional-loading">
          Loading performance...
        </div>

      </section>
    );

  }


  return (
    <section className="agent-additional-performance">

      <div className="agent-additional-header">

        <h3>Additional Performance</h3>

        <span>
          {fromDate} → {toDate}
        </span>

      </div>


      <div className="agent-additional-grid">

        <div className="agent-additional-card">
          <span>Name Calls</span>

          <strong>
            {stats.nameCalls}
          </strong>
        </div>


        <div className="agent-additional-card">
          <span>SC Calls</span>

          <strong>
            {stats.scCalls}
          </strong>
        </div>


        <div className="agent-additional-card">
          <span>Manager Calls</span>

          <strong>
            {stats.managerCalls}
          </strong>
        </div>


        <div className="agent-additional-card">
          <span>Airport Calls</span>

          <strong>
            {stats.airportCalls}
          </strong>
        </div>


        <div className="agent-additional-card">
          <span>Cancellation Calls</span>

          <strong>
            {stats.cancellationCalls}
          </strong>
        </div>


        <div className="agent-additional-card">
          <span>Cancellation Sales</span>

          <strong>
            {stats.cancellationSales}
          </strong>
        </div>

      </div>

    </section>
  );
}