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

        {/* DC CALLS & DC SALES */}

        <div className="agent-sales-card dc-combined-card">

          <span>DC Calls &amp; Sales</span>

          <div className="dc-combined-values">

            <div className="dc-value">

              <small>DC Calls</small>

              <strong>
                {stats.dcCalls}
              </strong>

            </div>


            <div className="dc-divider"></div>


            <div className="dc-value">

              <small>DC Sales</small>

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

          </div>

        </div>


        {/* B2C SALES */}

        <div className="agent-sales-card">
          <span>B2C Sales</span>

          <strong>
            {stats.b2cSales}
          </strong>
        </div>


        {/* MAC CALLS */}

        <div className="agent-sales-card">
          <span>MAC Calls</span>

          <strong>
            {stats.macCalls}
          </strong>
        </div>


        {/* PNRS */}

        <div className="agent-sales-card">
          <span>PNRs Created</span>

          <strong>
            {stats.pnrs}
          </strong>
        </div>


        {/* TOA */}

        <div className="agent-sales-card">
          <span>TOA</span>

          <strong className="money-value">
            $
            {Number(stats.toa || 0).toFixed(2)}
          </strong>
        </div>


        {/* GOOGLE REVIEWS */}

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


        {/* TRUSTPILOT */}

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