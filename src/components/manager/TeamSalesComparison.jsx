import { useEffect, useMemo, useState } from "react";

import { getAgentsWithTeams } from "../../services/agentTeamService";
import { getReportsBetweenDates } from "../../services/managerService";

import "./TeamSalesComparison.css";


function getEasternDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


function getMonthStart(dateString) {
  const [year, month] = dateString.split("-");

  return `${year}-${month}-01`;
}


function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}


function calculateTeamStats(reports) {

  const stats = {
    freshCalls: 0,
    freshTickets: 0,
    macCalls: 0,
    b2cSales: 0,
    dcSales: 0,
    cancellationSales: 0,
    insurance: 0,
    pnrs: 0,
    toa: 0,
    googleReviews: 0,
    trustpilotReviews: 0,
  };


  reports.forEach((report) => {

    stats.freshCalls += Number(
      report.fresh_calls || 0
    );

    stats.freshTickets += Number(
      report.fresh_tickets || 0
    );

    stats.macCalls += Number(
      report.mac_calls || 0
    );

    stats.b2cSales += Number(
      report.b2c_sales || 0
    );

    stats.dcSales += Number(
      report.dc_sales || 0
    );

    stats.cancellationSales += Number(
      report.cancellation_sales || 0
    );

    stats.insurance += Number(
      report.insurance_sold || 0
    );

   

    stats.toa += Number(
      report.toa || report.toa_sales || 0
    );

    stats.googleReviews += Number(
      report.google_reviews || 0
    );

    stats.trustpilotReviews += Number(
      report.trustpilot_reviews || 0
    );

  });


  return stats;
}


function getConversion(stats) {

  if (!stats.freshCalls) {
    return 0;
  }

  return (
    stats.freshTickets /
    stats.freshCalls
  ) * 100;
}


function MetricRow({
  label,
  aarav,
  eric,
  suffix = "",
}) {

  const aaravValue = Number(aarav || 0);
  const ericValue = Number(eric || 0);

  let winner = "tie";

  if (aaravValue > ericValue) {
    winner = "aarav";
  }

  if (ericValue > aaravValue) {
    winner = "eric";
  }


  return (

    <div className="team-comparison-row">

      <div className="team-metric-name">
        {label}
      </div>


      <div
        className={
          winner === "aarav"
            ? "team-metric-value winner"
            : "team-metric-value"
        }
      >

        <span>
          {formatNumber(aaravValue)}
          {suffix}
        </span>

        {winner === "aarav" && (
          <small>▲</small>
        )}

      </div>


      <div
        className={
          winner === "eric"
            ? "team-metric-value winner"
            : "team-metric-value"
        }
      >

        <span>
          {formatNumber(ericValue)}
          {suffix}
        </span>

        {winner === "eric" && (
          <small>▲</small>
        )}

      </div>

    </div>

  );

}


export default function TeamSalesComparison() {

  const [agents, setAgents] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const today = getEasternDate();

  const monthStart = getMonthStart(today);


  async function loadData() {

    try {

      setLoading(true);


      const [
        agentData,
        reportData,
      ] = await Promise.all([

        getAgentsWithTeams(),

        getReportsBetweenDates(
          monthStart,
          today
        ),

      ]);


      setAgents(agentData || []);
      setReports(reportData || []);

    }

    catch (error) {

      console.error(
        "Team comparison error:",
        error
      );

    }

    finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadData();

  }, []);


  const teamData = useMemo(() => {

    const agentTeamMap = new Map();


    agents.forEach((agent) => {

      agentTeamMap.set(
        Number(agent.id),
        agent.manager_name
      );

      agentTeamMap.set(
        agent.name
          ?.trim()
          .toLowerCase(),
        agent.manager_name
      );

    });


    const aaravReports = [];
    const ericReports = [];


    reports.forEach((report) => {

      const reportAgentName =
        report.agent_name
          ?.trim()
          .toLowerCase();


      const team =
        agentTeamMap.get(
          reportAgentName
        );


      if (team === "Aarav") {

        aaravReports.push(report);

      }

      else if (team === "Eric") {

        ericReports.push(report);

      }

    });


    return {

      aarav: {
        reports: aaravReports,
        stats:
          calculateTeamStats(
            aaravReports
          ),
      },

      eric: {
        reports: ericReports,
        stats:
          calculateTeamStats(
            ericReports
          ),
      },

    };

  }, [agents, reports]);


  const aarav =
    teamData.aarav.stats;

  const eric =
    teamData.eric.stats;


  const monthName =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
        timeZone:
          "America/New_York",
      }
    ).format(new Date());


  if (loading) {

    return (

      <section className="team-sales-comparison">

        <div className="team-comparison-loading">

          Loading team performance...

        </div>

      </section>

    );

  }


  return (

    <section className="team-sales-comparison">


      {/* HEADER */}

      <div className="team-comparison-header">

        <div>

          <span className="comparison-eyebrow">
            MANAGEMENT OVERVIEW
          </span>

          <h2>
            Team Sales Comparison
          </h2>

          <p>
            Overall team performance from
            <strong> {monthStart} </strong>
            to
            <strong> {today}</strong>
          </p>

        </div>


        <div className="comparison-period">

          <span>
            CURRENT MONTH
          </span>

          <strong>
            {monthName}
          </strong>

        </div>

      </div>


      {/* TEAM HEADER */}

      <div className="team-comparison-table">

        <div className="team-comparison-team-header">

          <div className="metric-header">
            Metric
          </div>


          <div className="aarav-header">

            <span>
              TEAM
            </span>

            <strong>
              Aarav Team
            </strong>

            <small>
              {teamData.aarav.reports.length} reports
            </small>

          </div>


          <div className="eric-header">

            <span>
              TEAM
            </span>

            <strong>
              Eric Team
            </strong>

            <small>
              {teamData.eric.reports.length} reports
            </small>

          </div>

        </div>


        {/* CORE SALES */}

        <div className="comparison-section-title">

          SALES PERFORMANCE

        </div>


        <MetricRow
          label="Fresh Calls"
          aarav={aarav.freshCalls}
          eric={eric.freshCalls}
        />


        <MetricRow
          label="Fresh Tickets"
          aarav={aarav.freshTickets}
          eric={eric.freshTickets}
        />


        <MetricRow
          label="Conversion"
          aarav={getConversion(aarav).toFixed(1)}
          eric={getConversion(eric).toFixed(1)}
          suffix="%"
        />


        {/* MAC */}

        <div className="comparison-section-title">

          MAC / AFTER SALES

        </div>


        <MetricRow
          label="MAC Calls"
          aarav={aarav.macCalls}
          eric={eric.macCalls}
        />


        <MetricRow
          label="B2C Sales"
          aarav={aarav.b2cSales}
          eric={eric.b2cSales}
        />


        <MetricRow
          label="DC Sales"
          aarav={aarav.dcSales}
          eric={eric.dcSales}
        />


        <MetricRow
          label="Cancellation Sales"
          aarav={aarav.cancellationSales}
          eric={eric.cancellationSales}
        />


        {/* SUPPORTING */}

        <div className="comparison-section-title">

          SUPPORTING PERFORMANCE

        </div>


        <MetricRow
          label="Insurance"
          aarav={aarav.insurance}
          eric={eric.insurance}
        />


       


        <MetricRow
          label="TOA"
          aarav={aarav.toa}
          eric={eric.toa}
        />


        <MetricRow
          label="Google Reviews"
          aarav={aarav.googleReviews}
          eric={eric.googleReviews}
        />


        <MetricRow
          label="Trustpilot"
          aarav={aarav.trustpilotReviews}
          eric={eric.trustpilotReviews}
        />

      </div>


      {/* FOOTER */}

      <div className="team-comparison-footer">

        <span>
          ▲ Higher value
        </span>

        <span>
          Comparison uses all submitted reports for the current month.
        </span>

      </div>


    </section>

  );

}