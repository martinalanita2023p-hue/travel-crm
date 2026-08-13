import useAgentPerformance
  from "../../../hooks/useAgentPerformance";

import "./AgentSalesPerformance.css";


export default function AgentSalesPerformance() {

  const {
    stats,
    loading,
    fromDate,
    toDate,
  } = useAgentPerformance();


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <section className="agent-sales-performance">

        <div className="agent-sales-header">

          <h3>
            Sales &amp; Performance
          </h3>

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


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <section className="agent-sales-performance">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="agent-sales-header">

        <h3>
          Sales &amp; Performance
        </h3>

        <span>
          {fromDate} → {toDate}
        </span>

      </div>


      {/* =================================================
          CARDS
      ================================================= */}

      <div className="agent-sales-grid">


        {/* DC CALLS */}

        <div className="agent-sales-card">

          <span>
            DC Calls
          </span>

          <strong>
            {stats.dcCalls}
          </strong>

        </div>


        {/* DC SALES */}

        <div className="agent-sales-card">

          <span>
            DC Sales
          </span>

          <strong>
            {stats.dcSales}
          </strong>

          {stats.dcSales === 0 ? (

            <small className="needs-attention">
              Needs Attention
            </small>

          ) : (

            <small className="active-status">
              Active
            </small>

          )}

        </div>


        {/* B2C SALES */}

        <div className="agent-sales-card">

          <span>
            B2C Sales
          </span>

          <strong>
            {stats.b2cSales}
          </strong>

        </div>


        {/* MAC CALLS */}

        <div className="agent-sales-card">

          <span>
            MAC Calls
          </span>

          <strong>
            {stats.macCalls}
          </strong>

        </div>


        {/* PNRS */}

        <div className="agent-sales-card">

          <span>
            PNRs Created
          </span>

          <strong>
            {stats.pnrs}
          </strong>

        </div>


        {/* TOA */}

        <div className="agent-sales-card">

          <span>
            TOA
          </span>

          <strong className="money-value">

            $
            {Number(
              stats.toa || 0
            ).toFixed(2)}

          </strong>

        </div>


        {/* GOOGLE */}

        <div className="agent-sales-card">

          <span>
            Google Reviews
          </span>

          <strong>
            {stats.google}
          </strong>

          {stats.google === 0 ? (

            <small className="needs-attention">
              Needs Attention
            </small>

          ) : (

            <small className="active-status">
              Active
            </small>

          )}

        </div>


        {/* TRUSTPILOT */}

        <div className="agent-sales-card">

          <span>
            Trustpilot
          </span>

          <strong>
            {stats.trustpilot}
          </strong>

          {stats.trustpilot === 0 ? (

            <small className="needs-attention">
              Needs Attention
            </small>

          ) : (

            <small className="active-status">
              Active
            </small>

          )}

        </div>


      </div>

    </section>

  );

}