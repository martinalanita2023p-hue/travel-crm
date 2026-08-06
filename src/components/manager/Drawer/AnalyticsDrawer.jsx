import "./AnalyticsDrawer.css";
import TrendChart from "../../charts/TrendChart";
import { useEffect, useState } from "react";
import { getAgentTrend } from "../../../services/analyticsService";

export default function AnalyticsDrawer({ report }) {
  if (!report) {
    return (
      <div className="analytics-drawer empty">
        <h2>Select an Agent</h2>
        <p>
          Click <strong>View</strong> beside any agent to see detailed
          performance.
        </p>
      </div>
    );
  }

 const [trendData, setTrendData] = useState([]);
 const [metric, setMetric] = useState("fresh_calls");

useEffect(() => {

  if (!report) return;

  async function loadTrend() {

    try {

      const data = await getAgentTrend(
        report.agent_name
      );

      const chart = data.map(item => ({
        label: new Date(item.report_date)
          .toLocaleDateString("en-US", {
            weekday: "short",
          }),
        value: Number(item[metric] || 0),
      }));

      setTrendData(chart);

    } catch (err) {

      console.error(err);

    }

  }

  loadTrend();

}, [report, metric]);

  return (
    <div className="analytics-drawer">

      {/* ===============================
          AGENT PROFILE
      =============================== */}

      <div className="profile">

        <div className="profile-avatar">
          {report.agent_name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <h2>{report.agent_name}</h2>
          <p>Travel Consultant</p>
        </div>

      </div>

      {/* ===============================
          DASHBOARD GRID
      =============================== */}

      <div className="drawer-grid">

        {/* LEFT COLUMN */}

        <div>

          {/* Fresh Calls vs Tickets */}

          <div className="comparison-card">

            <h3>📞 Fresh Calls vs Fresh Tickets</h3>

            <div className="compare-item">

              <div className="compare-label">
                <span>Fresh Calls</span>
                <strong>{report.fresh_calls || 0}</strong>
              </div>

              <progress
                max="20"
                value={report.fresh_calls || 0}
              />

            </div>

            <div className="compare-item">

              <div className="compare-label">
                <span>Fresh Tickets</span>
                <strong>{report.fresh_tickets || 0}</strong>
              </div>

              <progress
                max="20"
                value={report.fresh_tickets || 0}
              />

            </div>

          </div>

          {/* SC Calls */}

          <div className="comparison-card">

            <h3>📅 Schedule Change Calls</h3>

            <div className="compare-item">

              <div className="compare-label">
                <span>SC Calls</span>
                <strong>{report.sc_calls || 0}</strong>
              </div>

              <progress
                max="20"
                value={report.sc_calls || 0}
              />

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN */}

        <div>

          {/* Insurance */}

          <div className="comparison-card">

            <h3>🛡 Insurance</h3>

            <div className="compare-label">
              <span>Insurance Sold</span>
              <strong>{report.insurance_sold || 0}</strong>
            </div>

          </div>

          {/* Reviews */}

          <div className="comparison-card">

            <h3>⭐ Customer Reviews</h3>

            <div className="compare-label">
              <span>Google Reviews</span>
              <strong>{report.google_reviews || 0}</strong>
            </div>

            <div className="compare-label">
              <span>Trustpilot Reviews</span>
              <strong>{report.trustpilot_reviews || 0}</strong>
            </div>

          </div>

          {/* TOA */}

          <div className="comparison-card">

            <h3>💰 Token of Appreciation</h3>

            <div className="compare-label">
              <span>Total TOA</span>

              <strong>
                $
                {Number(report.token_appreciation || 0).toFixed(2)}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ===============================
    QUICK STATS
=============================== */}

<div className="comparison-card">

  <h3>📊 Quick Statistics</h3>

  <div className="compare-label">
    <span>PNRs Created</span>
    <strong>{report.pnrs_created || 0}</strong>
  </div>

  <div className="compare-label">
    <span>Name Calls</span>
    <strong>{report.name_calls || 0}</strong>
  </div>

  <div className="compare-label">
    <span>MAC Calls</span>
    <strong>{report.mac_calls || 0}</strong>
  </div>

  <div className="compare-label">
    <span>DC Calls</span>
    <strong>{report.dc_calls || 0}</strong>
  </div>

  <div className="compare-label">
    <span>Manager Calls</span>
    <strong>{report.manager_calls || 0}</strong>
  </div>

  <div className="compare-label">
    <span>Airport Calls</span>
    <strong>{report.airport_calls || 0}</strong>
  </div>

</div>

{/* ===============================
    SALES
=============================== */}

<div className="comparison-card">

  <h3>💼 Sales Summary</h3>

  <div className="compare-label">
    <span>DC Sales</span>
    <strong>{report.dc_sales || 0}</strong>
  </div>

  <div className="compare-label">
    <span>Cancellation Sales</span>
    <strong>{report.cancellation_sales || 0}</strong>
  </div>

  <div className="compare-label">
    <span>B2C Sales</span>
    <strong>{report.b2c_sales || 0}</strong>
  </div>

  <div className="compare-label">
    <span>DC Sales</span>
    <strong>{report.dc_sales || 0}</strong>
  </div>

</div>

<div className="metric-selector">

  <button onClick={() => setMetric("fresh_calls")}>
    📞 Calls
  </button>

  <button onClick={() => setMetric("fresh_tickets")}>
    🎫 Tickets
  </button>

  <button onClick={() => setMetric("insurance_sold")}>
    🛡 Insurance
  </button>

  <button onClick={() => setMetric("token_appreciation")}>
    💰 TOA
  </button>

  <button onClick={() => setMetric("pnrs_created")}>
    📋 PNRs
  </button>

</div>

      {/* ===============================
          TREND CHART
      =============================== */}

      <TrendChart
    title={metric.replaceAll("_", " ").toUpperCase()}
        data={trendData}
        dataKey="value"
      />

    </div>
  );
}