import React from "react";

export default function AgentIndividualInsight({
  agents = [],
  reports = [],
  selectedAgent = null,
  onSelectAgent,
}) {
  const agent =
    agents.find(
      (item) =>
        Number(item.id) === Number(selectedAgent?.id)
    ) || selectedAgent;

  /* =====================================================
     AGENT SELECTION
  ===================================================== */

  if (!agent) {
    return (
      <section className="agent-individual-insight">

        <div className="agent-insight-header">
          <div>
            <p className="agent-insight-eyebrow">
              INDIVIDUAL PERFORMANCE
            </p>

            <h2>Individual Agent Insights</h2>

            <p>
              Select an agent to open their detailed
              performance analysis.
            </p>
          </div>
        </div>

        <div className="agent-insight-selector">

          <h3>Select Agent</h3>

          <p>
            Choose an agent to view their individual
            performance dashboard.
          </p>

          <div className="agent-selector-grid">

            {agents.map((item) => (
              <button
                key={item.id}
                type="button"
                className="agent-selector-card"
                onClick={() =>
                  onSelectAgent?.(item)
                }
              >
                <div className="agent-selector-avatar">
                  👤
                </div>

                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    View Performance →
                  </span>
                </div>
              </button>
            ))}

          </div>

        </div>

      </section>
    );
  }

  /* =====================================================
     SELECTED AGENT
  ===================================================== */

  const agentReports = reports.filter(
    (report) =>
      report.agent_name
        ?.trim()
        .toLowerCase() ===
      agent.name
        ?.trim()
        .toLowerCase()
  );

  const totalFreshCalls =
    agentReports.reduce(
      (sum, report) =>
        sum + Number(report.fresh_calls || 0),
      0
    );

  const totalFreshTickets =
    agentReports.reduce(
      (sum, report) =>
        sum + Number(report.fresh_tickets || 0),
      0
    );

  const totalB2CSales =
    agentReports.reduce(
      (sum, report) =>
        sum + Number(report.b2c_sales || 0),
      0
    );

  const totalInsurance =
    agentReports.reduce(
      (sum, report) =>
        sum + Number(report.insurance_sold || 0),
      0
    );

  const conversion =
    totalFreshCalls > 0
      ? (
          (totalFreshTickets /
            totalFreshCalls) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <section className="agent-individual-insight">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="agent-insight-header">

        <div>

          <p className="agent-insight-eyebrow">
            INDIVIDUAL PERFORMANCE
          </p>

          <h2>
            {agent.name}
          </h2>

          <p>
            Detailed performance analysis and
            management insights
          </p>

        </div>

        <button
          type="button"
          className="agent-insight-back"
          onClick={() =>
            onSelectAgent?.(null)
          }
        >
          ← Back to Team Overview
        </button>

      </div>


      {/* =================================================
          TOP KPI CARDS
      ================================================= */}

      <div className="agent-insight-summary">

        <div className="agent-insight-card">
          <span>Reports</span>
          <strong>
            {agentReports.length}
          </strong>
        </div>

        <div className="agent-insight-card">
          <span>Fresh Calls</span>
          <strong>
            {totalFreshCalls}
          </strong>
        </div>

        <div className="agent-insight-card">
          <span>Fresh Tickets</span>
          <strong>
            {totalFreshTickets}
          </strong>
        </div>

        <div className="agent-insight-card">
          <span>Conversion</span>
          <strong>
            {conversion}%
          </strong>
        </div>

        <div className="agent-insight-card">
          <span>B2C Sales</span>
          <strong>
            {totalB2CSales}
          </strong>
        </div>

        <div className="agent-insight-card">
          <span>Insurance</span>
          <strong>
            {totalInsurance}
          </strong>
        </div>

      </div>


      {/* =================================================
          PERFORMANCE BREAKDOWN
      ================================================= */}

      <div className="agent-insight-section">

        <div className="agent-insight-section-header">

          <div>

            <p className="agent-insight-eyebrow">
              KPI PERFORMANCE
            </p>

            <h3>
              Performance Breakdown
            </h3>

          </div>

        </div>

        <div className="agent-insight-kpi-grid">

          <div className="agent-insight-kpi">
            <span>MAC Calls</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(report.mac_calls || 0),
                0
              )}
            </strong>
          </div>

          <div className="agent-insight-kpi">
            <span>DC Calls</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(report.dc_calls || 0),
                0
              )}
            </strong>
          </div>

          <div className="agent-insight-kpi">
            <span>Cancellation Calls</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(
                    report.cancellation_calls || 0
                  ),
                0
              )}
            </strong>
          </div>

          <div className="agent-insight-kpi">
            <span>Google Reviews</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(
                    report.google_reviews || 0
                  ),
                0
              )}
            </strong>
          </div>

          <div className="agent-insight-kpi">
            <span>Trustpilot</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(
                    report.trustpilot_reviews || 0
                  ),
                0
              )}
            </strong>
          </div>

          <div className="agent-insight-kpi">
            <span>TOA</span>
            <strong>
              {agentReports.reduce(
                (sum, report) =>
                  sum +
                  Number(
                    report.token_appreciation || 0
                  ),
                0
              )}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          EMPTY REPORT STATE
      ================================================= */}

      {agentReports.length === 0 && (

        <div className="agent-insight-empty">

          <div className="agent-insight-empty-icon">
            📊
          </div>

          <h3>
            No performance reports yet
          </h3>

          <p>
            {agent.name} does not have any daily
            reports available for the selected period.
          </p>

        </div>

      )}

    </section>
  );
}