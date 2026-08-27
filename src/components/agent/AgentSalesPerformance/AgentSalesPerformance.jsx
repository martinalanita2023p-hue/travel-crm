import "./AgentSalesPerformance.css";


export default function AgentSalesPerformance({
  stats,
  loading,
  fromDate,
  toDate,
}) {

  if (loading) {

    return (
      <section className="agent-sales-performance">

        <div className="agent-sales-header">

          <h3>Sales &amp; Performance</h3>

          <span>
            {fromDate} → {toDate}
          </span>

        </div>

        <div className="agent-sales-loading">
          Loading performance...
        </div>

      </section>
    );

  }


  return (
    <section className="agent-sales-performance">

      <div className="agent-sales-header">

        <h3>Sales &amp; Performance</h3>

        <span>
          {fromDate} → {toDate}
        </span>

      </div>


      <div className="agent-sales-grid">

        <div className="agent-sales-card">
          <span>DC Calls</span>

          <strong>
            {stats.dcCalls}
          </strong>
        </div>


        <div className="agent-sales-card">
          <span>DC Sales</span>

          <strong>
            {stats.dcSales}
          </strong>

          <small
            className={
              stats.dcSales === 0
                ? "needs-attention"
                : "active-status"
            }
          >
            {stats.dcSales === 0
              ? "Needs Attention"
              : "Active"}
          </small>
        </div>


        <div className="agent-sales-card">
          <span>B2C Sales</span>

          <strong>
            {stats.b2cSales}
          </strong>
        </div>


        <div className="agent-sales-card">
          <span>MAC Calls</span>

          <strong>
            {stats.macCalls}
          </strong>
        </div>


        <div className="agent-sales-card">
          <span>PNRs Created</span>

          <strong>
            {stats.pnrs}
          </strong>
        </div>


        <div className="agent-sales-card">
          <span>TOA</span>

          <strong className="money-value">
            $
            {Number(stats.toa || 0).toFixed(2)}
          </strong>
        </div>


        <div className="agent-sales-card">
          <span>Google Reviews</span>

          <strong>
            {stats.google}
          </strong>

          <small
            className={
              stats.google === 0
                ? "needs-attention"
                : "active-status"
            }
          >
            {stats.google === 0
              ? "Needs Attention"
              : "Active"}
          </small>
        </div>


        <div className="agent-sales-card">
          <span>Trustpilot</span>

          <strong>
            {stats.trustpilot}
          </strong>

          <small
            className={
              stats.trustpilot === 0
                ? "needs-attention"
                : "active-status"
            }
          >
            {stats.trustpilot === 0
              ? "Needs Attention"
              : "Active"}
          </small>
        </div>

      </div>

    </section>
  );
}