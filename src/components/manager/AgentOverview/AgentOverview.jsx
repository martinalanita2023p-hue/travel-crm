import { useEffect, useMemo, useState } from "react";
import "./AgentOverview.css";
import { getReportsBetweenDates } from "../../../services/managerService";

export default function AgentOverview({
  report,
  selectedDate,
}) {
  /* =====================================================
     DATE HELPER
  ===================================================== */

  function getEasternDate() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  /* =====================================================
     DEFAULT DATE RANGE
     First day of current selected month → selected date
  ===================================================== */

  const defaultEndDate = selectedDate || getEasternDate();

  const defaultStartDate = useMemo(() => {
    const date = new Date(`${defaultEndDate}T00:00:00`);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}-01`;
  }, [defaultEndDate]);

  /* =====================================================
     STATE
  ===================================================== */

  const [fromDate, setFromDate] = useState(defaultStartDate);
  const [toDate, setToDate] = useState(defaultEndDate);

  const [agentReports, setAgentReports] = useState([]);

  const [loading, setLoading] = useState(false);

  /* =====================================================
     RESET DATE RANGE WHEN SELECTED DATE CHANGES
  ===================================================== */

  useEffect(() => {
    setFromDate(defaultStartDate);
    setToDate(defaultEndDate);
  }, [defaultStartDate, defaultEndDate]);

  /* =====================================================
     LOAD AGENT REPORTS
  ===================================================== */

  useEffect(() => {
    async function loadReports() {
      if (
        !report?.agent_name ||
        !fromDate ||
        !toDate ||
        fromDate > toDate
      ) {
        setAgentReports([]);
        return;
      }

      try {
        setLoading(true);

        const data = await getReportsBetweenDates(
          fromDate,
          toDate
        );

        const filteredReports = (data || []).filter(
          (item) =>
            item.agent_name
              ?.trim()
              .toLowerCase() ===
            report.agent_name
              ?.trim()
              .toLowerCase()
        );

        setAgentReports(filteredReports);
      } catch (error) {
        console.error(
          "Failed to load agent reports:",
          error
        );

        setAgentReports([]);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [
    report?.agent_name,
    fromDate,
    toDate,
  ]);

  /* =====================================================
     PERIOD TOTALS
  ===================================================== */

  const totals = useMemo(() => {
    return agentReports.reduce(
      (total, item) => {
        total.freshCalls += Number(
          item.fresh_calls || 0
        );

        total.freshTickets += Number(
          item.fresh_tickets || 0
        );

        total.insurance += Number(
          item.insurance_sold || 0
        );

        total.dcCalls += Number(
          item.dc_calls || 0
        );

        total.dcSales += Number(
          item.dc_sales || 0
        );

        total.b2cSales += Number(
          item.b2c_sales || 0
        );

        total.macCalls += Number(
          item.mac_calls || 0
        );

        total.pnrs += Number(
          item.pnrs_created || 0
        );

        total.toa += Number(
          item.token_appreciation || 0
        );

        total.googleReviews += Number(
          item.google_reviews || 0
        );

        total.trustpilotReviews += Number(
          item.trustpilot_reviews || 0
        );

        total.nameCalls += Number(
          item.name_calls || 0
        );

        total.managerCalls += Number(
          item.manager_calls || 0
        );

        total.airportCalls += Number(
          item.airport_calls || 0
        );

        total.scCalls += Number(
          item.sc_calls || 0
        );

        total.cancellationCalls += Number(
          item.cancellation_calls || 0
        );

        total.cancellationSales += Number(
          item.cancellation_sales || 0
        );

        return total;
      },
      {
        freshCalls: 0,
        freshTickets: 0,
        insurance: 0,

        dcCalls: 0,
        dcSales: 0,

        b2cSales: 0,

        macCalls: 0,

        pnrs: 0,

        toa: 0,

        googleReviews: 0,
        trustpilotReviews: 0,

        nameCalls: 0,
        managerCalls: 0,
        airportCalls: 0,

        scCalls: 0,

        cancellationCalls: 0,
        cancellationSales: 0,
      }
    );
  }, [agentReports]);

  /* =====================================================
     TICKET CONVERSION

     This is the ONLY percentage calculation.

     Fresh Tickets can be greater than Fresh Calls.
  ===================================================== */

  const conversion =
    totals.freshCalls > 0
      ? (totals.freshTickets /
          totals.freshCalls) *
        100
      : 0;

  /* =====================================================
     PERFORMANCE ANALYSIS
  ===================================================== */

  const performanceAnalysis = useMemo(() => {
    /* -----------------------------------------------
       TICKET CONVERSION
    ------------------------------------------------ */

    let conversionStatus = "No Fresh Calls";

    if (totals.freshCalls > 0) {
      if (conversion >= 100) {
        conversionStatus = "Decent";
      } else if (conversion >= 80) {
        conversionStatus = "Needs Attention";
      } else {
        conversionStatus = "Below Target";
      }
    }

    /* -----------------------------------------------
       INSURANCE
    ------------------------------------------------ */

    let insuranceStatus = "No Fresh Calls";

    if (totals.freshCalls > 0) {
      if (totals.freshCalls >= 15) {
        insuranceStatus =
          totals.insurance >= 10
            ? "Good"
            : "Needs Attention";
      } else {
        insuranceStatus =
          totals.insurance > 0
            ? "Active"
            : "Needs Attention";
      }
    }

    /* -----------------------------------------------
       GOOGLE REVIEWS
    ------------------------------------------------ */

    let googleStatus = "No Fresh Calls";

    if (totals.freshCalls > 0) {
      googleStatus =
        totals.googleReviews > 0
          ? "Active"
          : "Needs Attention";
    }

    /* -----------------------------------------------
       TRUSTPILOT
    ------------------------------------------------ */

    let trustpilotStatus = "No Fresh Calls";

    if (totals.freshCalls > 0) {
      trustpilotStatus =
        totals.trustpilotReviews > 0
          ? "Active"
          : "Needs Attention";
    }

    /* -----------------------------------------------
       DC SALES
       Compared with DC Calls
    ------------------------------------------------ */

    let dcStatus = "No DC Calls";

    if (totals.dcCalls > 0) {
      dcStatus =
        totals.dcSales > 0
          ? "Sales Active"
          : "Needs Attention";
    }

    /* -----------------------------------------------
       CANCELLATION SALES
       Compared with Cancellation Calls
    ------------------------------------------------ */

    let cancellationStatus =
      "No Cancellation Calls";

    if (totals.cancellationCalls > 0) {
      cancellationStatus =
        totals.cancellationSales > 0
          ? "Sales Active"
          : "Needs Attention";
    }

    return {
      conversionStatus,
      insuranceStatus,
      googleStatus,
      trustpilotStatus,
      dcStatus,
      cancellationStatus,
    };
  }, [totals, conversion]);

  /* =====================================================
     DAILY PERFORMANCE TREND
  ===================================================== */

  const dailyTrend = useMemo(() => {
    const grouped = {};

    agentReports.forEach((item) => {
      const date = item.report_date;

      if (!date) {
        return;
      }

      if (!grouped[date]) {
        grouped[date] = {
          date,
          freshCalls: 0,
          freshTickets: 0,
        };
      }

      grouped[date].freshCalls += Number(
        item.fresh_calls || 0
      );

      grouped[date].freshTickets += Number(
        item.fresh_tickets || 0
      );
    });

    return Object.values(grouped).sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );
  }, [agentReports]);

  /* =====================================================
     MAIN BAR CHART SCALE
  ===================================================== */

  const maxBarValue = Math.max(
    totals.freshCalls,
    totals.freshTickets,
    1
  );

  const callsBarHeight = Math.max(
    (totals.freshCalls / maxBarValue) *
      190,
    10
  );

  const ticketsBarHeight = Math.max(
    (totals.freshTickets / maxBarValue) *
      190,
    10
  );

  /* =====================================================
     NO REPORT SELECTED
  ===================================================== */

  if (!report) {
    return (
      <div className="agent-overview">
        <div className="agent-overview-empty">
          <h3>No report found</h3>

          <p>
            There is no report available
            for this agent.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     INVALID DATE RANGE
  ===================================================== */

  if (fromDate > toDate) {
    return (
      <div className="agent-overview">
        <AgentHeaderBlock
          agentName={report.agent_name}
        />

        <DateRangeBlock
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />

        <div className="agent-overview-empty">
          <h3>Invalid date range</h3>

          <p>
            The Performance From date must
            be before the Performance To date.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="agent-overview">
        <AgentHeaderBlock
          agentName={report.agent_name}
        />

        <div className="agent-overview-empty">
          <h3>
            Loading performance...
          </h3>

          <p>
            Fetching the selected period.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="agent-overview">

      {/* ================================================
          AGENT HEADER
      ================================================= */}

      <AgentHeaderBlock
        agentName={report.agent_name}
      />


      {/* ================================================
          DATE RANGE
      ================================================= */}

      <DateRangeBlock
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />


      {/* ================================================
          PERIOD
      ================================================= */}

      <div className="agent-period-label">
        <span>
          Performance Period
        </span>

        <strong>
          {fromDate} → {toDate}
        </strong>
      </div>


      {/* ================================================
          CORE KPI ROW

          Four cards:
          Fresh Calls
          Fresh Tickets
          Ticket Conversion
          Insurance
      ================================================= */}

      <div className="agent-kpi-grid core-kpi-grid">

        {/* Fresh Calls */}

        <div className="agent-kpi-card">
          <span>
            Fresh Calls
          </span>

          <strong>
            {totals.freshCalls}
          </strong>
        </div>


        {/* Fresh Tickets */}

        <div className="agent-kpi-card">
          <span>
            Fresh Tickets
          </span>

          <strong>
            {totals.freshTickets}
          </strong>
        </div>


        {/* Conversion */}

        <div className="agent-kpi-card">
          <span>
            Ticket Conversion
          </span>

          <strong>
            {conversion.toFixed(1)}%
          </strong>

          <small
            className={
              performanceAnalysis.conversionStatus ===
              "Decent"
                ? "status-good"
                : "status-warning"
            }
          >
            {performanceAnalysis.conversionStatus}
          </small>
        </div>


        {/* Insurance */}

        <div className="agent-kpi-card">
          <span>
            Insurance
          </span>

          <strong>
            {totals.insurance}
          </strong>

          <small
            className={
              performanceAnalysis.insuranceStatus ===
              "Good"
                ? "status-good"
                : "status-warning"
            }
          >
            {performanceAnalysis.insuranceStatus}
          </small>
        </div>

      </div>


      {/* ================================================
          CHARTS ROW

          THIS IS THE IMPORTANT PART.

          Fresh Calls vs Fresh Tickets
                         BESIDE
          Daily Performance Trend
      ================================================= */}

      <div className="performance-charts-row">

        {/* ==============================================
            FRESH CALLS VS FRESH TICKETS
        =============================================== */}

        <div className="calls-tickets-card">

          <div className="section-heading">

            <div>

              <h3>
                📊 Fresh Calls vs Fresh Tickets
              </h3>

              <span>
                Ticket conversion:
                {" "}
                {conversion.toFixed(1)}%
              </span>

            </div>

          </div>


          <div className="bar-chart">

            {/* Fresh Calls */}

            <div className="bar-column">

              <strong>
                {totals.freshCalls}
              </strong>

              <div
                className="bar calls-bar"
                style={{
                  height:
                    `${callsBarHeight}px`,
                }}
              />

              <span>
                Fresh Calls
              </span>

            </div>


            {/* Fresh Tickets */}

            <div className="bar-column">

              <strong>
                {totals.freshTickets}
              </strong>

              <div
                className="bar tickets-bar"
                style={{
                  height:
                    `${ticketsBarHeight}px`,
                }}
              />

              <span>
                Fresh Tickets
              </span>

            </div>

          </div>

        </div>


        {/* ==============================================
            DAILY PERFORMANCE TREND
        =============================================== */}

        <div className="agent-trend-card">

          <div className="section-heading">

            <div>

              <h3>
                📈 Daily Performance Trend
              </h3>

              <span>
                Fresh Calls vs Fresh Tickets
              </span>

            </div>


            <div className="trend-legend">

              <span>
                <i className="legend-calls"></i>
                Calls
              </span>

              <span>
                <i className="legend-tickets"></i>
                Tickets
              </span>

            </div>

          </div>


          {dailyTrend.length === 0 ? (

            <div className="trend-empty">
              No daily reports available
              for this period.
            </div>

          ) : (

            <div className="trend-chart">

              {dailyTrend.map((day) => {

                const maxValue =
                  Math.max(
                    day.freshCalls,
                    day.freshTickets,
                    1
                  );


                const callsHeight =
                  Math.max(
                    (
                      day.freshCalls /
                      maxValue
                    ) * 135,
                    8
                  );


                const ticketsHeight =
                  Math.max(
                    (
                      day.freshTickets /
                      maxValue
                    ) * 135,
                    8
                  );


                const formattedDate =
                  new Date(
                    `${day.date}T00:00:00`
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  );


                return (
                  <div
                    className="trend-day"
                    key={day.date}
                  >

                    <div className="trend-bars">

                      {/* Calls */}

                      <div
                        className="trend-bar trend-calls"
                        style={{
                          height:
                            `${callsHeight}px`,
                        }}
                      >
                        <span>
                          {day.freshCalls}
                        </span>
                      </div>


                      {/* Tickets */}

                      <div
                        className="trend-bar trend-tickets"
                        style={{
                          height:
                            `${ticketsHeight}px`,
                        }}
                      >
                        <span>
                          {day.freshTickets}
                        </span>
                      </div>

                    </div>


                    <div className="trend-date">
                      {formattedDate}
                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </div>


      {/* ================================================
          SALES & PERFORMANCE
      ================================================= */}

      <div className="agent-section-title">

        <h3>
          Sales & Performance
        </h3>

        <span>
          {fromDate} → {toDate}
        </span>

      </div>


      <div className="agent-secondary-grid">

        {/* ==============================================
            DC CALLS & DC SALES
            COMBINED INTO ONE CARD
        =============================================== */}

        <div className="agent-kpi-card agent-dc-combined-card">

          <span>
            DC Calls & Sales
          </span>

          <div className="dc-combined-values">

            <div>

              <small>
                DC Calls
              </small>

              <strong>
                {totals.dcCalls}
              </strong>

            </div>


            <div className="dc-combined-divider" />


            <div>

              <small>
                DC Sales
              </small>

              <strong>
                {totals.dcSales}
              </strong>

              <em
                className={
                  performanceAnalysis.dcStatus ===
                  "Sales Active"
                    ? "status-good"
                    : "status-warning"
                }
              >
                {performanceAnalysis.dcStatus}
              </em>

            </div>

          </div>

        </div>


        {/* B2C Sales */}

        <div className="agent-kpi-card">

          <span>
            B2C Sales
          </span>

          <strong>
            {totals.b2cSales}
          </strong>

        </div>


        {/* MAC Calls */}

        <div className="agent-kpi-card">

          <span>
            MAC Calls
          </span>

          <strong>
            {totals.macCalls}
          </strong>

        </div>


        {/* PNRs */}

        <div className="agent-kpi-card">

          <span>
            PNRs Created
          </span>

          <strong>
            {totals.pnrs}
          </strong>

        </div>


        {/* TOA */}

        <div className="agent-kpi-card">

          <span>
            TOA
          </span>

          <strong>
            $
            {totals.toa.toFixed(2)}
          </strong>

        </div>


        {/* Google Reviews */}

        <div className="agent-kpi-card">

          <span>
            Google Reviews
          </span>

          <strong>
            {totals.googleReviews}
          </strong>

          <small
            className={
              performanceAnalysis.googleStatus ===
              "Active"
                ? "status-good"
                : "status-warning"
            }
          >
            {performanceAnalysis.googleStatus}
          </small>

        </div>


        {/* Trustpilot */}

        <div className="agent-kpi-card">

          <span>
            Trustpilot
          </span>

          <strong>
            {totals.trustpilotReviews}
          </strong>

          <small
            className={
              performanceAnalysis.trustpilotStatus ===
              "Active"
                ? "status-good"
                : "status-warning"
            }
          >
            {performanceAnalysis.trustpilotStatus}
          </small>

        </div>

      </div>


      {/* ================================================
          ADDITIONAL PERFORMANCE
      ================================================= */}

      <div className="agent-details-card">

        <h3>
          Additional Performance
        </h3>


        <div className="agent-detail-grid">

          {/* Name Calls */}

          <DetailRow
            label="Name Calls"
            value={totals.nameCalls}
          />


          {/* Manager Calls */}

          <DetailRow
            label="Manager Calls"
            value={totals.managerCalls}
          />


          {/* Airport Calls */}

          <DetailRow
            label="Airport Calls"
            value={totals.airportCalls}
          />


          {/* Schedule Change Calls */}

          <DetailRow
            label="Schedule Change Calls"
            value={totals.scCalls}
          />


          {/* Cancellation Calls */}

          <DetailRow
            label="Cancellation Calls"
            value={totals.cancellationCalls}
          />


          {/* Cancellation Sales */}

          <DetailRow
            label="Cancellation Sales"
            value={totals.cancellationSales}
            status={
              performanceAnalysis.cancellationStatus
            }
          />

        </div>

      </div>


      {/* ================================================
          REPORT COUNT
      ================================================= */}

      <div className="agent-report-count">

        {agentReports.length === 0 ? (

          <span>
            No reports found for the
            selected period.
          </span>

        ) : (

          <span>
            {agentReports.length} report
            {agentReports.length !== 1
              ? "s"
              : ""}{" "}
            included in this period.
          </span>

        )}

      </div>

    </div>
  );
}


/* =====================================================
   HEADER COMPONENT
===================================================== */

function AgentHeaderBlock({
  agentName,
}) {

  return (
    <div className="agent-overview-header">

      <div className="agent-avatar">
        {agentName
          ?.charAt(0)
          ?.toUpperCase()}
      </div>

      <div>

        <h2>
          {agentName}
        </h2>

        <p>
          Individual Performance Center
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   DATE RANGE COMPONENT
===================================================== */

function DateRangeBlock({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {

  return (
    <div className="agent-date-panel">

      <div>

        <label>
          Performance From
        </label>

        <input
          type="date"
          value={fromDate}
          onChange={(event) =>
            setFromDate(
              event.target.value
            )
          }
        />

      </div>


      <div>

        <label>
          Performance To
        </label>

        <input
          type="date"
          value={toDate}
          onChange={(event) =>
            setToDate(
              event.target.value
            )
          }
        />

      </div>

    </div>
  );
}


/* =====================================================
   DETAIL ROW COMPONENT
===================================================== */

function DetailRow({
  label,
  value,
  status,
}) {

  return (
    <div className="agent-detail-row">

      <span>
        {label}
      </span>

      <div className="detail-value">

        <strong>
          {value}
        </strong>

        {status && (
          <small>
            {status}
          </small>
        )}

      </div>

    </div>
  );
}