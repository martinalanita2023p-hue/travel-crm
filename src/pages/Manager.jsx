import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import TeamSalesComparison from "../components/manager/TeamSalesComparison";

import Layout from "../components/Layout";
import AgentIndividualInsight
  from "../components/manager/AgentIndividualInsight";

import ManagerHeader from "../components/manager/ManagerHeader";
import aggregateReports from "../utils/aggregateReports";
import AgentOverview from "../components/manager/AgentOverview/AgentOverview";
import {
  getBostonDate,
  getBostonMonthStart,
} from "../utils/bostonTime";
import AttentionCenter from "../components/dashboard/AttentionCenter";
import TeamTable from "../components/manager/TeamTable/TeamTable";

import KPIDetailsModal from "../components/dashboard/KPIDetailsModal";
import EditReportModal from "../components/dashboard/EditReportModal";
import DeleteReportModal from "../components/dashboard/DeleteReportModal";

import useManagerData from "../hooks/useManagerData";
import { getAllAgents } from "../services/userService";
import { getReportsBetweenDates } from "../services/managerService";
import { getReceptionVerification } from "../services/receptionVerificationService";

import calculateStats from "../utils/calculateStats";
import buildAlerts from "../utils/buildAlerts";

import "../styles/manager.css";


export default function Manager() {

  /* =====================================================
     BASIC STATE
  ===================================================== */

  const [agents, setAgents] = useState([]);

  const [filterMode, setFilterMode] =
    useState("all");

  const [selectedDate, setSelectedDate] =
  useState(getBostonDate);

  const [viewMode, setViewMode] =
    useState("day");
    

    

  const [selectedAgent, setSelectedAgent] =  useState("All Agents");
    
    const [selectedInsightAgent, setSelectedInsightAgent] = useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedKPI, setSelectedKPI] =
    useState(null);
    

  const [editingReport, setEditingReport] =
    useState(null);

  const [deletingReport, setDeletingReport] =
    useState(null);
    


      /* =====================================================
     RECEPTION VS AGENT VERIFICATION
  ===================================================== */

  const [verificationData, setVerificationData] =
    useState(null);

  const [verificationLoading, setVerificationLoading] =
    useState(false);

  const [verificationError, setVerificationError] =
    useState(null);


  /* =====================================================
     MEETING TEAM STATE

     These selections are temporary.
     We are NOT permanently assigning agents to teams.
  ===================================================== */

  const [meetingTeam, setMeetingTeam] =
    useState([]);

  const [showAgentSelector, setShowAgentSelector] =
    useState(false);

  const [teamSearch, setTeamSearch] =
    useState("");

  const [teamFromDate, setTeamFromDate] =
  useState(getBostonMonthStart);

  

  const [teamToDate, setTeamToDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [teamReports, setTeamReports] =
    useState([]);

  const [teamLoading, setTeamLoading] =
    useState(false);

    


  /* =====================================================
     MAIN MANAGER DATA
  ===================================================== */

  const {
    reports,
    loading,
    error,
  } = useManagerData(
    selectedDate,
    viewMode
  );


  /* =====================================================
     LOAD ALL AGENTS
  ===================================================== */

  useEffect(() => {

    async function loadAgents() {

      try {

        const data =
          await getAllAgents();

        setAgents(
  (data || []).filter(
    (user) =>
      user.role?.trim().toLowerCase() === "agent"
  )
);

      } catch (err) {

        console.error(
          "Failed to load agents:",
          err
        );

      }

    }

    loadAgents();

  }, []);


  /* =====================================================
     KEEP TEAM TO DATE IN SYNC WITH MAIN DATE
  ===================================================== */

  useEffect(() => {

    setTeamToDate(selectedDate);

  }, [selectedDate]);

    /* =====================================================
     LOAD RECEPTION VS AGENT VERIFICATION
  ===================================================== */

  useEffect(() => {

    async function loadVerification() {

      if (!selectedDate) {
        return;
      }

      try {

        setVerificationLoading(true);
        setVerificationError(null);

        const data =
          await getReceptionVerification(
            selectedDate
          );

        setVerificationData(data);

      } catch (err) {

        console.error(
          "Failed to load Reception verification:",
          err
        );

        setVerificationError(
          err.message ||
          "Failed to load Reception verification."
        );

        setVerificationData(null);

      } finally {

        setVerificationLoading(false);

      }

    }

    loadVerification();

  }, [selectedDate]);


  /* =====================================================
     FILTER MAIN REPORTS
  ===================================================== */

  const filteredReports = useMemo(() => {

    let data = [...reports];


    /* -----------------------------------------------
       SELECTED AGENT
    ------------------------------------------------ */

    if (
      selectedAgent !== "All Agents"
    ) {

      data = data.filter(
        (report) =>
          report.agent_name
            ?.trim()
            .toLowerCase() ===
          selectedAgent
            .trim()
            .toLowerCase()
      );

    }


    /* -----------------------------------------------
       SEARCH
    ------------------------------------------------ */

    if (search.trim()) {

      data = data.filter(
        (report) =>
          report.agent_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }


    /* -----------------------------------------------
       WEEK / MONTH AGGREGATION
    ------------------------------------------------ */

    if (viewMode !== "day") {

      data =
        aggregateReports(data);

    }


    return data;

  }, [
    reports,
    selectedAgent,
    search,
    viewMode,
  ]);


  /* =====================================================
     DASHBOARD STATS
  ===================================================== */

  const stats = useMemo(

    () =>
      calculateStats(
        filteredReports,
        agents
      ),

    [
      filteredReports,
      agents,
    ]

  );


  /* =====================================================
     ALERTS
  ===================================================== */

  const alerts = useMemo(

    () =>
      buildAlerts(stats),

    [stats]

  );


  /* =====================================================
     LOAD MEETING TEAM REPORTS
  ===================================================== */

  useEffect(() => {

    async function loadTeamReports() {

      if (
        meetingTeam.length === 0 ||
        !teamFromDate ||
        !teamToDate
      ) {

        setTeamReports([]);

        return;

      }


      if (
        teamFromDate > teamToDate
      ) {

        setTeamReports([]);

        return;

      }


      try {

        setTeamLoading(true);


        const data =
          await getReportsBetweenDates(
            teamFromDate,
            teamToDate
          );


        const selectedNames =
          meetingTeam.map(
            (name) =>
              name
                .trim()
                .toLowerCase()
          );


        const filtered =
          (data || []).filter(
            (report) =>
              selectedNames.includes(
                report.agent_name
                  ?.trim()
                  .toLowerCase()
              )
          );


        setTeamReports(filtered);

      } catch (err) {

        console.error(
          "Failed to load meeting team reports:",
          err
        );

        setTeamReports([]);

      } finally {

        setTeamLoading(false);

      }

    }


    loadTeamReports();

  }, [
    meetingTeam,
    teamFromDate,
    teamToDate,
  ]);


  /* =====================================================
     TEAM TOTALS
  ===================================================== */

  const teamTotals = useMemo(() => {

    return teamReports.reduce(
      (total, report) => {

        total.freshCalls +=
          Number(
            report.fresh_calls || 0
          );

        total.freshTickets +=
          Number(
            report.fresh_tickets || 0
          );

        total.insurance +=
          Number(
            report.insurance_sold || 0
          );

        total.google +=
          Number(
            report.google_reviews || 0
          );

        total.trustpilot +=
          Number(
            report.trustpilot_reviews || 0
          );

        total.dcCalls +=
          Number(
            report.dc_calls || 0
          );

        total.dcSales +=
          Number(
            report.dc_sales || 0
          );

        total.cancellationCalls +=
          Number(
            report.cancellation_calls || 0
          );

        total.cancellationSales +=
          Number(
            report.cancellation_sales || 0
          );

        total.b2cSales +=
          Number(
            report.b2c_sales || 0
          );

        total.macCalls +=
          Number(
            report.mac_calls || 0
          );

        total.pnrs +=
          Number(
            report.pnrs_created || 0
          );

        total.toa +=
          Number(
            report.token_appreciation || 0
          );

        return total;

      },

      {
        freshCalls: 0,
        freshTickets: 0,
        insurance: 0,

        google: 0,
        trustpilot: 0,

        dcCalls: 0,
        dcSales: 0,

        cancellationCalls: 0,
        cancellationSales: 0,

        b2cSales: 0,

        macCalls: 0,

        pnrs: 0,

        toa: 0,
      }

    );

  }, [teamReports]);


  /* =====================================================
     TEAM CONVERSION
  ===================================================== */

  const teamConversion =
    teamTotals.freshCalls > 0
      ? (
          teamTotals.freshTickets /
          teamTotals.freshCalls
        ) * 100
      : 0;


  /* =====================================================
     TEAM MEMBER PERFORMANCE
  ===================================================== */

  const teamAgentPerformance =
    useMemo(() => {

      return meetingTeam.map(
        (agentName) => {

          const normalizedName =
            agentName
              .trim()
              .toLowerCase();


          const reportsForAgent =
            teamReports.filter(
              (report) =>
                report.agent_name
                  ?.trim()
                  .toLowerCase() ===
                normalizedName
            );


          const totals =
            reportsForAgent.reduce(
              (total, report) => {

                total.freshCalls +=
                  Number(
                    report.fresh_calls || 0
                  );

                total.freshTickets +=
                  Number(
                    report.fresh_tickets || 0
                  );

                total.insurance +=
                  Number(
                    report.insurance_sold || 0
                  );

                total.google +=
                  Number(
                    report.google_reviews || 0
                  );

                total.trustpilot +=
                  Number(
                    report.trustpilot_reviews || 0
                  );

                total.dcCalls +=
                  Number(
                    report.dc_calls || 0
                  );

                total.dcSales +=
                  Number(
                    report.dc_sales || 0
                  );

                total.cancellationCalls +=
                  Number(
                    report.cancellation_calls || 0
                  );

                total.cancellationSales +=
                  Number(
                    report.cancellation_sales || 0
                  );

                total.b2cSales +=
                  Number(
                    report.b2c_sales || 0
                  );

                total.macCalls +=
                  Number(
                    report.mac_calls || 0
                  );

                total.pnrs +=
                  Number(
                    report.pnrs_created || 0
                  );

                total.toa +=
                  Number(
                    report.token_appreciation || 0
                  );

                return total;

              },

              {
                freshCalls: 0,
                freshTickets: 0,
                insurance: 0,

                google: 0,
                trustpilot: 0,

                dcCalls: 0,
                dcSales: 0,

                cancellationCalls: 0,
                cancellationSales: 0,

                b2cSales: 0,

                macCalls: 0,

                pnrs: 0,

                toa: 0,
              }

            );


          const conversion =
            totals.freshCalls > 0
              ? (
                  totals.freshTickets /
                  totals.freshCalls
                ) * 100
              : 0;


          return {

            agentName,

            ...totals,

            conversion,

          };

        }
      );

    }, [
      meetingTeam,
      teamReports,
    ]);


  /* =====================================================
     AGENT SELECTOR SEARCH
  ===================================================== */

  const selectableAgents =
    useMemo(() => {

      const query =
        teamSearch
          .trim()
          .toLowerCase();


      if (!query) {

        return agents;

      }


      return agents.filter(
        (agent) => {

          const agentName =
            agent.name ||
            agent.agent_name ||
            "";


          return agentName
            .toLowerCase()
            .includes(query);

        }
      );

    }, [
      agents,
      teamSearch,
    ]);


  /* =====================================================
     GET AGENT DISPLAY NAME
  ===================================================== */

  function getAgentName(agent) {

    return (
      agent?.name ||
      agent?.agent_name ||
      ""
    );

  }


  /* =====================================================
     TOGGLE MEETING TEAM MEMBER
  ===================================================== */

  function toggleMeetingAgent(
    agentName
  ) {

    if (!agentName) {
      return;
    }


    setMeetingTeam(
      (currentTeam) => {

        const normalized =
          agentName
            .trim()
            .toLowerCase();


        const alreadySelected =
          currentTeam.some(
            (name) =>
              name
                .trim()
                .toLowerCase() ===
              normalized
          );


        if (alreadySelected) {

          return currentTeam.filter(
            (name) =>
              name
                .trim()
                .toLowerCase() !==
              normalized
          );

        }


        return [
          ...currentTeam,
          agentName.trim(),
        ];

      }
    );

  }


  /* =====================================================
     REMOVE MEETING TEAM MEMBER
  ===================================================== */

  function removeMeetingAgent(
    agentName
  ) {

    const normalized =
      agentName
        .trim()
        .toLowerCase();


    setMeetingTeam(
      (currentTeam) =>
        currentTeam.filter(
          (name) =>
            name
              .trim()
              .toLowerCase() !==
            normalized
        )
    );

  }


  /* =====================================================
     KPI MODAL DATA
  ===================================================== */

  function getModalData() {

    switch (selectedKPI) {

      case "freshCalls":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.fresh_calls || 0,

          })
        );


      case "nameCalls":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.name_calls || 0,

          })
        );


      case "tickets":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.fresh_tickets || 0,

          })
        );


      case "insurance":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.insurance_sold || 0,

          })
        );


      case "google":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.google_reviews || 0,

          })
        );


      case "trustpilot":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.trustpilot_reviews || 0,

          })
        );


      case "toa":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              `$${Number(
                report.token_appreciation || 0
              ).toFixed(2)}`,

          })
        );


      default:

        return [];

    }

  }


  /* =====================================================
     EXPORT EXCEL
  ===================================================== */

  function exportExcel() {

    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredReports
      );


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Daily Reports"
    );


    XLSX.writeFile(
      workbook,
      `Manager_Report_${selectedDate}.xlsx`
    );

  }


  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {

    return (

      <Layout title="Manager Dashboard">

        <div className="page-state">

          <h2>
            Loading Manager Dashboard...
          </h2>

        </div>

      </Layout>

    );

  }


  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (error) {

    return (

      <Layout title="Manager Dashboard">

        

        <div className="page-state error">

          <h2>
            {error}
          </h2>

        </div>

      </Layout>

    );

  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (

    <Layout title="Manager Dashboard">

      <div className="manager-page">


        {/* =================================================
            MANAGER HEADER
        ================================================= */}

        <ManagerHeader

          selectedDate={
            selectedDate
          }

          setSelectedDate={
            setSelectedDate
          }

          selectedAgent={
            selectedAgent
          }

          setSelectedAgent={
            setSelectedAgent
          }

          agents={
            agents
          }

          search={
            search
          }

          setSearch={
            setSearch
          }

          exportExcel={
            exportExcel
          }

          viewMode={
            viewMode
          }

          setViewMode={
            setViewMode
          }

          filterMode={
            filterMode
          }

          setFilterMode={
            setFilterMode
          }

        />


        {/* =================================================
            COMPANY OVERVIEW
        ================================================= */}

        {selectedAgent ===
          "All Agents" && (

          <>


            {/* =============================================
                ATTENTION CENTER
            ============================================== */}

            <div className="manager-info-row">

              <div className="manager-left-panel">

                <AttentionCenter
                  alerts={alerts}
                />

              </div>

            </div>

                            {/* =============================================
                    RECEPTION VS AGENT ALERT
                ============================================== */}

                {!verificationLoading &&
                  verificationData &&
                  verificationData.summary.mismatch_agents > 0 && (

                  <div className="reception-verification-alert">

                    <div className="reception-verification-alert-icon">
                      ⚠️
                    </div>

                    <div className="reception-verification-alert-content">

                      <strong>
                        Reception vs Agent mismatch
                      </strong>

                      <span>
                        {verificationData.summary.mismatch_agents}{" "}
                        agent
                        {verificationData.summary.mismatch_agents !== 1
                          ? "s"
                          : ""}{" "}
                        require
                        {verificationData.summary.mismatch_agents === 1
                          ? "s"
                          : ""}{" "}
                        verification for {selectedDate}.
                      </span>

                    </div>

                    <div className="reception-verification-alert-count">
                      {verificationData.summary.mismatch_agents}
                    </div>

                  </div>

                )}


            {/* =============================================
    TEAM SALES COMPARISON
============================================== */}

<TeamSalesComparison />

            {/* =============================================
                RECEPTION VS AGENT VERIFICATION
            ============================================== */}

            <section className="reception-verification-section">

              <div className="reception-verification-header">

                <div>

                  <span className="reception-verification-eyebrow">
                    OPERATIONS CONTROL
                  </span>

                  <h2>
                    Reception vs Agent Verification
                  </h2>

                  <p>
                    Compare call activity recorded by Reception
                    with the corresponding Agent daily reports.
                  </p>

                </div>

                <div className="verification-date-badge">
                  {selectedDate}
                </div>

              </div>


              {verificationLoading && (

                <div className="verification-state">
                  Checking Reception and Agent reports...
                </div>

              )}


              {verificationError && (

                <div className="verification-state verification-error">
                  {verificationError}
                </div>

              )}


              {!verificationLoading &&
                !verificationError &&
                verificationData && (

                <>

                  {/* SUMMARY */}

                  <div className="verification-summary-grid">

                    <div className="verification-summary-card">

                      <span>
                        Agents Checked
                      </span>

                      <strong>
                        {
                          verificationData.summary
                            .total_agents
                        }
                      </strong>

                    </div>


                    <div className="verification-summary-card verified">

                      <span>
                        Verified
                      </span>

                      <strong>
                        {
                          verificationData.summary
                            .verified_agents
                        }
                      </strong>

                    </div>


                    <div className="verification-summary-card mismatch">

                      <span>
                        Mismatches
                      </span>

                      <strong>
                        {
                          verificationData.summary
                            .mismatch_agents
                        }
                      </strong>

                    </div>

                  </div>


                  {/* TABLE */}

                  <div className="verification-table-wrapper">

                    <table className="verification-table">

                      <thead>

                        <tr>

                          <th>
                            Agent
                          </th>

                          <th>
                            Metric
                          </th>

                          <th>
                            Reception
                          </th>

                          <th>
                            Agent
                          </th>

                          <th>
                            Difference
                          </th>

                          <th>
                            Status
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {verificationData.verification.length === 0 ? (

                          <tr>

                            <td
                              colSpan="6"
                              className="verification-empty"
                            >
                              No Reception or Agent reports found
                              for this date.
                            </td>

                          </tr>

                        ) : (

                          verificationData.verification.flatMap(
                            (item) => [

                              <tr
                                key={`${item.agent_name}-fresh`}
                              >

                                <td
                                  rowSpan="3"
                                  className="verification-agent-name"
                                >
                                  {item.agent_name}
                                </td>

                                <td>
                                  Fresh Calls
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .fresh_calls
                                      .reception
                                  }
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .fresh_calls
                                      .agent
                                  }
                                </td>

                                <td
                                  className={
                                    item.metrics
                                      .fresh_calls
                                      .difference === 0
                                      ? "verification-difference"
                                      : "verification-difference mismatch"
                                  }
                                >
                                  {
                                    item.metrics
                                      .fresh_calls
                                      .difference > 0
                                      ? "+"
                                      : ""
                                  }

                                  {
                                    item.metrics
                                      .fresh_calls
                                      .difference
                                  }
                                </td>

                                <td>

                                  {item.metrics
                                    .fresh_calls
                                    .verified ? (

                                    <span className="verification-status verified">
                                      ✓ Verified
                                    </span>

                                  ) : (

                                    <span className="verification-status mismatch">
                                      ⚠ Mismatch
                                    </span>

                                  )}

                                </td>

                              </tr>,


                              <tr
                                key={`${item.agent_name}-dc`}
                              >

                                <td>
                                  DC Calls
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .dc_calls
                                      .reception
                                  }
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .dc_calls
                                      .agent
                                  }
                                </td>

                                <td
                                  className={
                                    item.metrics
                                      .dc_calls
                                      .difference === 0
                                      ? "verification-difference"
                                      : "verification-difference mismatch"
                                  }
                                >
                                  {
                                    item.metrics
                                      .dc_calls
                                      .difference > 0
                                      ? "+"
                                      : ""
                                  }

                                  {
                                    item.metrics
                                      .dc_calls
                                      .difference
                                  }
                                </td>

                                <td>

                                  {item.metrics
                                    .dc_calls
                                    .verified ? (

                                    <span className="verification-status verified">
                                      ✓ Verified
                                    </span>

                                  ) : (

                                    <span className="verification-status mismatch">
                                      ⚠ Mismatch
                                    </span>

                                  )}

                                </td>

                              </tr>,


                              <tr
                                key={`${item.agent_name}-cancellation`}
                              >

                                <td>
                                  Cancellation Calls
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .cancellation_calls
                                      .reception
                                  }
                                </td>

                                <td>
                                  {
                                    item.metrics
                                      .cancellation_calls
                                      .agent
                                  }
                                </td>

                                <td
                                  className={
                                    item.metrics
                                      .cancellation_calls
                                      .difference === 0
                                      ? "verification-difference"
                                      : "verification-difference mismatch"
                                  }
                                >
                                  {
                                    item.metrics
                                      .cancellation_calls
                                      .difference > 0
                                      ? "+"
                                      : ""
                                  }

                                  {
                                    item.metrics
                                      .cancellation_calls
                                      .difference
                                  }
                                </td>

                                <td>

                                  {item.metrics
                                    .cancellation_calls
                                    .verified ? (

                                    <span className="verification-status verified">
                                      ✓ Verified
                                    </span>

                                  ) : (

                                    <span className="verification-status mismatch">
                                      ⚠ Mismatch
                                    </span>

                                  )}

                                </td>

                              </tr>

                            ]
                          )

                        )}

                      </tbody>

                    </table>

                  </div>

                </>

              )}

           

           

              {/* -----------------------------------------
                  DATE RANGE
              ------------------------------------------ */}

              <div className="meeting-team-dates">


                <div>

                  <label>
                    Performance From
                  </label>

                  <input
                    type="date"
                    value={
                      teamFromDate
                    }
                    onChange={(event) =>
                      setTeamFromDate(
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
                    value={
                      teamToDate
                    }
                    onChange={(event) =>
                      setTeamToDate(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* -----------------------------------------
                  DATE ERROR
              ------------------------------------------ */}

              {teamFromDate >
                teamToDate && (

                <div className="meeting-team-error">

                  Performance From date
                  cannot be after
                  Performance To date.

                </div>

              )}


              {/* -----------------------------------------
                  SELECTED AGENTS
              ------------------------------------------ */}

              <div className="selected-team-members">

                {meetingTeam.length ===
                0 ? (

                  <div className="no-team-members">

                    <strong>
                      No agents selected
                    </strong>

                    <span>
                      Click "+ Add Agent"
                      to select the agents
                      for this meeting.
                    </span>

                  </div>

                ) : (

                  meetingTeam.map(
                    (agentName) => (

                      <div
                        className="team-member-chip"
                        key={agentName}
                      >

                        <span>
                          {agentName}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            removeMeetingAgent(
                              agentName
                            )
                          }
                          aria-label={
                            `Remove ${agentName}`
                          }
                        >

                          ×

                        </button>

                      </div>

                    )
                  )

                )}

              </div>


              {/* -----------------------------------------
                  AGENT SELECTOR
              ------------------------------------------ */}

              {showAgentSelector && (

                <div className="agent-selector-panel">


                  <div className="agent-selector-top">

                    <div>

                      <h3>
                        Select Team Members
                      </h3>

                      <p>
                        These selections are
                        temporary for this
                        meeting.
                      </p>

                    </div>


                    <button
                      type="button"
                      className="selector-close-btn"
                      onClick={() =>
                        setShowAgentSelector(
                          false
                        )
                      }
                    >

                      Close

                    </button>

                  </div>


                  {/* SEARCH */}

                  <input
                    type="text"
                    className="team-agent-search"
                    placeholder="Search agents..."
                    value={
                      teamSearch
                    }
                    onChange={(event) =>
                      setTeamSearch(
                        event.target.value
                      )
                    }
                  />


                  {/* AGENT LIST */}

                  <div className="agent-selector-list">

                    {selectableAgents.length ===
                    0 ? (

                      <div className="selector-empty">

                        No agents found.

                      </div>

                    ) : (

                      selectableAgents.map(
                        (agent) => {

                          const agentName =
                            getAgentName(
                              agent
                            );


                          const isSelected =
                            meetingTeam.some(
                              (name) =>
                                name
                                  .trim()
                                  .toLowerCase() ===
                                agentName
                                  .trim()
                                  .toLowerCase()
                            );


                          return (

                            <button
                              type="button"
                              key={
                                agent.id ||
                                agentName
                              }
                              className={
                                `agent-selector-item ${
                                  isSelected
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() =>
                                toggleMeetingAgent(
                                  agentName
                                )
                              }
                            >

                              <span>

                                <span className="agent-check">

                                  {isSelected
                                    ? "✓"
                                    : ""}

                                </span>


                                {agentName}

                              </span>

                            </button>

                          );

                        }
                      )

                    )}

                  </div>

                </div>

              )}


              {/* =========================================
                  TEAM PERFORMANCE
              ========================================== */}

              {meetingTeam.length >
                0 && (

                <div className="meeting-team-performance">


                  {/* ---------------------------------------
                      TEAM HEADER
                  ---------------------------------------- */}

                  <div className="team-performance-title">

                    <div>

                      <h3>
                        Team Performance
                      </h3>

                      <span>
                        {teamFromDate}
                        {" → "}
                        {teamToDate}
                      </span>

                    </div>


                    <span>

                      {meetingTeam.length}

                      {" "}

                      team member
                      {meetingTeam.length !==
                      1
                        ? "s"
                        : ""}

                    </span>

                  </div>


                  {/* ---------------------------------------
                      TEAM KPI GRID
                  ---------------------------------------- */}

                  <div className="team-kpi-grid">


                    <TeamKPI
                      label="Fresh Calls"
                      value={
                        teamTotals.freshCalls
                      }
                    />


                    <TeamKPI
                      label="Fresh Tickets"
                      value={
                        teamTotals.freshTickets
                      }
                    />


                    <TeamKPI
                      label="Conversion"
                      value={`${teamConversion.toFixed(
                        1
                      )}%`}
                      status={
                        teamTotals.freshCalls ===
                        0
                          ? "No Fresh Calls"
                          : teamConversion >=
                            100
                          ? "Decent"
                          : "Needs Attention"
                      }
                    />


                    <TeamKPI
                      label="Insurance"
                      value={
                        teamTotals.insurance
                      }
                    />


                    <TeamKPI
                      label="Google Reviews"
                      value={
                        teamTotals.google
                      }
                    />


                    <TeamKPI
                      label="Trustpilot"
                      value={
                        teamTotals.trustpilot
                      }
                    />


                    <TeamKPI
                      label="DC Calls"
                      value={
                        teamTotals.dcCalls
                      }
                    />


                    <TeamKPI
                      label="DC Sales"
                      value={
                        teamTotals.dcSales
                      }
                    />


                    <TeamKPI
                      label="Cancellation Calls"
                      value={
                        teamTotals.cancellationCalls
                      }
                    />


                    <TeamKPI
                      label="Cancellation Sales"
                      value={
                        teamTotals.cancellationSales
                      }
                    />


                    <TeamKPI
                      label="B2C Sales"
                      value={
                        teamTotals.b2cSales
                      }
                    />


                    <TeamKPI
                      label="MAC Calls"
                      value={
                        teamTotals.macCalls
                      }
                    />


                    <TeamKPI
                      label="PNRs"
                      value={
                        teamTotals.pnrs
                      }
                    />


                    <TeamKPI
                      label="TOA"
                      value={`$${teamTotals.toa.toFixed(
                        2
                      )}`}
                    />

                  </div>


                  {/* ---------------------------------------
                      TEAM MEMBER PERFORMANCE TABLE
                  ---------------------------------------- */}

                  <div className="meeting-team-table-wrapper">


                    <div className="meeting-team-table-title">

                      <div>

                        <h3>
                          Team Member
                          Performance
                        </h3>

                        <span>
                          Click an agent to
                          open their
                          individual
                          performance.
                        </span>

                      </div>

                    </div>


                    {teamLoading ? (

                      <div className="team-loading">

                        Loading team
                        performance...

                      </div>

                    ) : (

                      <div className="meeting-team-table-scroll">

                        <table className="meeting-team-table">

                          <thead>

                            <tr>

                              <th>
                                Agent
                              </th>

                              <th>
                                Fresh Calls
                              </th>

                              <th>
                                Fresh Tickets
                              </th>

                              <th>
                                Conversion
                              </th>

                              <th>
                                Insurance
                              </th>

                              <th>
                                Google
                              </th>

                              <th>
                                Trustpilot
                              </th>

                              <th>
                                DC Calls
                              </th>

                              <th>
                                DC Sales
                              </th>

                              <th>
                                Cancellation Calls
                              </th>

                              <th>
                                Cancellation Sales
                              </th>

                              <th>
                                B2C Sales
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            {teamAgentPerformance.length ===
                            0 ? (

                              <tr>

                                <td
                                  colSpan="12"
                                  className="team-table-empty"
                                >

                                  No reports found
                                  for the selected
                                  team and date
                                  range.

                                </td>

                              </tr>

                            ) : (

                              teamAgentPerformance.map(
                                (agent) => (

                                  <tr
  key={agent.agentName}
  className="clickable-agent-row"
  onClick={() => {
    const fullAgent = agents.find(
      (item) =>
        item.name?.trim().toLowerCase() ===
        agent.agentName?.trim().toLowerCase()
    );

    setSelectedInsightAgent(
      fullAgent || {
        name: agent.agentName,
      }
    );
  }}
>

                                    <td className="team-agent-name">

                                      {agent.agentName}

                                    </td>


                                    <td>
                                      {
                                        agent.freshCalls
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.freshTickets
                                      }
                                    </td>


                                    <td
                                      className={
                                        agent.freshCalls >
                                        0
                                          ? agent.conversion >=
                                            100
                                            ? "team-status-good"
                                            : "team-status-warning"
                                          : ""
                                      }
                                    >

                                      {agent.freshCalls >
                                      0
                                        ? `${agent.conversion.toFixed(
                                            1
                                          )}%`
                                        : "—"}

                                    </td>


                                    <td>
                                      {
                                        agent.insurance
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.google
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.trustpilot
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.dcCalls
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.dcSales
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.cancellationCalls
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.cancellationSales
                                      }
                                    </td>


                                    <td>
                                      {
                                        agent.b2cSales
                                      }
                                    </td>

                                  </tr>

                                )
                              )

                            )}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </div>

                </div>

              )}

            </section>


            {/* =============================================
                EXISTING TEAM TABLE
            ============================================== */}

            <div className="team-table-card">

              <TeamTable
  reports={filteredReports}
  onAnalytics={(report) => {
    const fullAgent = agents.find(
      (item) =>
        item.name?.trim().toLowerCase() ===
        report.agent_name?.trim().toLowerCase()
    );

    setSelectedInsightAgent(
      fullAgent || {
        name: report.agent_name,
      }
    );
  }}
/>

            </div>

          </>

        )}


        {/* =================================================
    INDIVIDUAL AGENT DEEP INSIGHTS
================================================= */}

{selectedInsightAgent && (
  <AgentIndividualInsight
    agents={agents}
    reports={reports}
    selectedAgent={selectedInsightAgent}
    onSelectAgent={setSelectedInsightAgent}
  />
)}


        {/* =================================================
            INDIVIDUAL AGENT OVERVIEW
        ================================================= */}

        {selectedAgent !==
          "All Agents" && (

          <AgentOverview

            report={
              reports.find(
                (report) =>
                  report.agent_name
                    ?.trim()
                    .toLowerCase() ===
                  selectedAgent
                    .trim()
                    .toLowerCase()
              )
            }

            selectedDate={
              selectedDate
            }

          />

        )}


        {/* =================================================
            KPI DETAILS MODAL
        ================================================= */}

        {selectedKPI && (

          <KPIDetailsModal

            title={
              selectedKPI
            }

            data={
              getModalData()
            }

            onClose={() =>
              setSelectedKPI(
                null
              )
            }

          />

        )}


        {/* =================================================
            EDIT REPORT MODAL
        ================================================= */}

        {editingReport && (

          <EditReportModal

            report={
              editingReport
            }

            onClose={() =>
              setEditingReport(
                null
              )
            }

            onSaved={() => {

              setEditingReport(
                null
              );

              window.location.reload();

            }}

          />

        )}


        {/* =================================================
            DELETE REPORT MODAL
        ================================================= */}

        {deletingReport && (

          <DeleteReportModal

            report={
              deletingReport
            }

            onClose={() =>
              setDeletingReport(
                null
              )
            }

            onDeleted={() => {

              setDeletingReport(
                null
              );

              window.location.reload();

            }}

          />

        )}

      </div>

    </Layout>

  );

}


/* =========================================================
   TEAM KPI COMPONENT
========================================================= */

function TeamKPI({
  label,
  value,
  status,
}) {

  return (

    <div className="team-kpi-card">

      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>


      {status && (

        <small
          className={
            status === "Decent" ||
            status === "Good"
              ? "team-status-good"
              : "team-status-warning"
          }
        >

          {status}

        </small>

      )}

    </div>

  );

}