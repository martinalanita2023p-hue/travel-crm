import "./AgentPerformanceChart.css";


export default function AgentPerformanceChart({
  reports = [],
  fromDate,
  toDate,
}) {

  const totalFreshCalls = reports.reduce(
    (sum, report) =>
      sum + Number(report.fresh_calls || 0),
    0
  );

  const totalFreshTickets = reports.reduce(
    (sum, report) =>
      sum + Number(report.fresh_tickets || 0),
    0
  );


  const maxValue = Math.max(
    totalFreshCalls,
    totalFreshTickets,
    1
  );


  const callHeight =
    (totalFreshCalls / maxValue) * 100;

  const ticketHeight =
    (totalFreshTickets / maxValue) * 100;


  return (
    <section className="agent-performance-chart">

      {/* HEADER */}

      <div className="agent-performance-chart-header">

        <div>

          <h3>
            Fresh Calls vs Fresh Tickets
          </h3>

          <p>
            {fromDate} → {toDate}
          </p>

        </div>

      </div>


      {/* CHART */}

      <div className="agent-chart-area">

        {/* FRESH CALLS */}

        <div className="agent-chart-column">

          <div className="agent-chart-value">
            {totalFreshCalls}
          </div>

          <div className="agent-chart-bar-wrapper">

            <div
              className="agent-chart-bar fresh-calls-bar"
              style={{
                height: `${callHeight}%`,
              }}
            />

          </div>

          <strong>
            Fresh Calls
          </strong>

        </div>


        {/* FRESH TICKETS */}

        <div className="agent-chart-column">

          <div className="agent-chart-value">
            {totalFreshTickets}
          </div>

          <div className="agent-chart-bar-wrapper">

            <div
              className="agent-chart-bar fresh-tickets-bar"
              style={{
                height: `${ticketHeight}%`,
              }}
            />

          </div>

          <strong>
            Fresh Tickets
          </strong>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="agent-chart-summary">

        <div>

          <span>
            Fresh Calls
          </span>

          <strong>
            {totalFreshCalls}
          </strong>

        </div>


        <div>

          <span>
            Fresh Tickets
          </span>

          <strong>
            {totalFreshTickets}
          </strong>

        </div>

      </div>

    </section>
  );
}