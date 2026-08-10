import { useEffect, useState } from "react";
import "./AgentOverview.css";
import { getReportsBetweenDates } from "../../../services/managerService";

export default function AgentOverview({
  report,
  selectedDate,
}) {

      const [weeklyReports, setWeeklyReports] = useState([]);

        useEffect(() => {

    async function loadWeeklyReports() {

      if (!report?.agent_name || !selectedDate) {
        return;
      }

      try {

        const end = new Date(selectedDate);
        const start = new Date(selectedDate);

        start.setDate(start.getDate() - 6);

        const data = await getReportsBetweenDates(
          start.toISOString().split("T")[0],
          end.toISOString().split("T")[0]
        );

        const agentReports = data.filter(
          item =>
            item.agent_name?.toLowerCase() ===
            report.agent_name?.toLowerCase()
        );

        setWeeklyReports(agentReports);

      } catch (err) {

        console.error(
          "Failed to load weekly agent reports:",
          err
        );

        setWeeklyReports([]);

      }

    }

    loadWeeklyReports();

  }, [report?.agent_name, selectedDate]);



  if (!report) {
    return (
      <div className="agent-overview-empty">
        <h2>No report found</h2>
        <p>
          There is no report available for this agent on the selected date.
        </p>
      </div>
    );
  }

  const freshCalls = Number(report.fresh_calls || 0);
  const freshTickets = Number(report.fresh_tickets || 0);

  const conversion =
    freshCalls > 0
      ? ((freshTickets / freshCalls) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="agent-overview">

      {/* ==========================
          AGENT HEADER
      ========================== */}

      <div className="agent-overview-header">

        <div className="agent-avatar">
          {report.agent_name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <h2>{report.agent_name}</h2>
          <p>Individual Performance Overview</p>
        </div>

      </div>

      {/* ==========================
          KPI ROW
      ========================== */}

      <div className="agent-kpi-grid">

        <div className="agent-kpi-card">
          <span>Fresh Calls</span>
          <strong>{freshCalls}</strong>
        </div>

        <div className="agent-kpi-card">
          <span>Fresh Tickets</span>
          <strong>{freshTickets}</strong>
        </div>

        <div className="agent-kpi-card">
          <span>Conversion</span>
          <strong>{conversion}%</strong>
        </div>

        <div className="agent-kpi-card">
          <span>Insurance</span>
          <strong>
            {report.insurance_sold || 0}
          </strong>
        </div>

        <div className="agent-kpi-card">
          <span>TOA</span>
          <strong>
            $
            {Number(
              report.token_appreciation || 0
            ).toFixed(2)}
          </strong>
        </div>

      </div>

      {/* ==========================
          CALLS VS TICKETS
      ========================== */}

      <div className="calls-tickets-card">

        <div className="section-heading">
          <h3>📊 Fresh Calls vs Fresh Tickets</h3>

          <span>
            {conversion}% Conversion
          </span>
        </div>

        <div className="bar-chart">

          <div className="bar-column">

            <strong>{freshCalls}</strong>

            <div
              className="bar calls-bar"
              style={{
                height: `${Math.max(
                  freshCalls * 10,
                  10
                )}px`,
              }}
            />

            <span>Fresh Calls</span>

          </div>

          <div className="bar-column">

            <strong>{freshTickets}</strong>

            <div
              className="bar tickets-bar"
              style={{
                height: `${Math.max(
                  freshTickets * 10,
                  10
                )}px`,
              }}
            />

            <span>Fresh Tickets</span>

          </div>

        </div>

      </div>

      {/* ==========================
          QUICK DETAILS
      ========================== */}

      <div className="agent-details-card">

        <h3>Quick Statistics</h3>

        <div className="agent-detail-row">
          <span>PNRs Created</span>
          <strong>
            {report.pnrs_created || 0}
          </strong>
        </div>

        <div className="agent-detail-row">
          <span>MAC Calls</span>
          <strong>
            {report.mac_calls || 0}
          </strong>
        </div>

        <div className="agent-detail-row">
          <span>Schedule Change Calls</span>
          <strong>
            {report.sc_calls || 0}
          </strong>
        </div>

        <div className="agent-detail-row">
          <span>Google Reviews</span>
          <strong>
            {report.google_reviews || 0}
          </strong>
        </div>

        <div className="agent-detail-row">
          <span>Trustpilot Reviews</span>
          <strong>
            {report.trustpilot_reviews || 0}
          </strong>
        </div>

      </div>

    </div>
  );
}