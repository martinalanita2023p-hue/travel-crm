import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Layout from "../components/Layout";

import ManagerHeader from "../components/manager/ManagerHeader";
import aggregateReports from "../utils/aggregateReports";
import AgentOverview from "../components/manager/AgentOverview/AgentOverview";

import AttentionCenter from "../components/dashboard/AttentionCenter";
import TeamTable from "../components/manager/TeamTable/TeamTable";

import TeamSalesComparison from "../components/manager/TeamSalesComparison";

import KPIDetailsModal from "../components/dashboard/KPIDetailsModal";
import EditReportModal from "../components/dashboard/EditReportModal";
import DeleteReportModal from "../components/dashboard/DeleteReportModal";

import useManagerData from "../hooks/useManagerData";

import { getAllAgents } from "../services/userService";
import { getReportsBetweenDates } from "../services/managerService";

import { getReceptionVerification } from "../services/receptionVerificationService";

import calculateStats from "../utils/calculateStats";
import buildAlerts from "../utils/buildAlerts";

import {
  getBostonDate,
  getBostonMonthStart,
} from "../utils/bostonTime";

import "../styles/manager.css";


export default function Manager() {


  /* =====================================================
     BASIC STATE
  ===================================================== */

  const [agents, setAgents] =
    useState([]);

  const [filterMode, setFilterMode] =
    useState("all");

  const [selectedDate, setSelectedDate] =
    useState(
      getBostonDate()
    );

  const [viewMode, setViewMode] =
    useState("day");

  const [selectedAgent, setSelectedAgent] =
    useState("All Agents");

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

  const [
    verificationData,
    setVerificationData,
  ] = useState(null);

  const [
    verificationLoading,
    setVerificationLoading,
  ] = useState(false);

  const [
    verificationError,
    setVerificationError,
  ] = useState(null);


  /* =====================================================
     MEETING TEAM STATE

     These selections are temporary.
     They do NOT permanently assign agents.
  ===================================================== */

  const [meetingTeam, setMeetingTeam] =
    useState([]);

  const [
    showAgentSelector,
    setShowAgentSelector,
  ] = useState(false);

  const [teamSearch, setTeamSearch] =
    useState("");

  const [teamFromDate, setTeamFromDate] =
    useState(
      getBostonMonthStart()
    );

  const [teamToDate, setTeamToDate] =
    useState(
      getBostonDate()
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
          data || []
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
     KEEP TEAM TO DATE IN SYNC
  ===================================================== */

  useEffect(() => {

    setTeamToDate(
      selectedDate
    );

  }, [selectedDate]);


  /* =====================================================
     LOAD RECEPTION VS AGENT VERIFICATION
  ===================================================== */

  useEffect(() => {

    async function loadReceptionVerification() {

      if (!selectedDate) {
        return;
      }


      try {

        setVerificationLoading(
          true
        );

        setVerificationError(
          null
        );


        const data =
          await getReceptionVerification(
            selectedDate
          );


        setVerificationData(
          data
        );

      } catch (err) {

        console.error(
          "Failed to load Reception verification:",
          err
        );


        setVerificationError(
          err?.message ||
          "Failed to load Reception verification."
        );


        setVerificationData(
          null
        );

      } finally {

        setVerificationLoading(
          false
        );

      }

    }


    loadReceptionVerification();

  }, [selectedDate]);


  /* =====================================================
     FILTER MAIN REPORTS
  ===================================================== */

  const filteredReports =
    useMemo(() => {

      let data =
        [...reports];


      /* -----------------------------------------------
         SELECTED AGENT
      ------------------------------------------------ */

      if (
        selectedAgent !==
        "All Agents"
      ) {

        data =
          data.filter(
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

      if (
        search.trim()
      ) {

        data =
          data.filter(
            (report) =>
              report.agent_name
                ?.toLowerCase()
                .includes(
                  search
                    .toLowerCase()
                )
          );

      }


      /* -----------------------------------------------
         WEEK / MONTH
      ------------------------------------------------ */

      if (
        viewMode !==
        "day"
      ) {

        data =
          aggregateReports(
            data
          );

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

  const stats =
    useMemo(

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

  const alerts =
    useMemo(

      () =>
        buildAlerts(
          stats
        ),

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
        teamFromDate >
        teamToDate
      ) {

        setTeamReports([]);

        return;

      }


      try {

        setTeamLoading(
          true
        );


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


        setTeamReports(
          filtered
        );

      } catch (err) {

        console.error(
          "Failed to load meeting team reports:",
          err
        );


        setTeamReports([]);

      } finally {

        setTeamLoading(
          false
        );

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

  const teamTotals =
    useMemo(() => {

      return teamReports.reduce(

        (total, report) => {

          total.freshCalls +=
            Number(
              report.fresh_calls ||
              0
            );


          total.freshTickets +=
            Number(
              report.fresh_tickets ||
              0
            );


          total.insurance +=
            Number(
              report.insurance_sold ||
              0
            );


          total.google +=
            Number(
              report.google_reviews ||
              0
            );


          total.trustpilot +=
            Number(
              report.trustpilot_reviews ||
              0
            );


          total.dcCalls +=
            Number(
              report.dc_calls ||
              0
            );


          total.dcSales +=
            Number(
              report.dc_sales ||
              0
            );


          total.cancellationCalls +=
            Number(
              report.cancellation_calls ||
              0
            );


          total.cancellationSales +=
            Number(
              report.cancellation_sales ||
              0
            );


          total.b2cSales +=
            Number(
              report.b2c_sales ||
              0
            );


          total.macCalls +=
            Number(
              report.mac_calls ||
              0
            );


          total.toa +=
            Number(
              report.token_appreciation ||
              0
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

          toa: 0,
        }

      );

    }, [
      teamReports
    ]);


  /* =====================================================
     TEAM CONVERSION

     Fresh Tickets can exceed Fresh Calls.
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


          const freshCalls =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.fresh_calls ||
                  0
                ),
              0
            );


          const freshTickets =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.fresh_tickets ||
                  0
                ),
              0
            );


          const insurance =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.insurance_sold ||
                  0
                ),
              0
            );


          const google =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.google_reviews ||
                  0
                ),
              0
            );


          const trustpilot =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.trustpilot_reviews ||
                  0
                ),
              0
            );


          const dcCalls =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.dc_calls ||
                  0
                ),
              0
            );


          const dcSales =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.dc_sales ||
                  0
                ),
              0
            );


          const cancellationCalls =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.cancellation_calls ||
                  0
                ),
              0
            );


          const cancellationSales =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.cancellation_sales ||
                  0
                ),
              0
            );


          const b2cSales =
            reportsForAgent.reduce(
              (sum, report) =>
                sum +
                Number(
                  report.b2c_sales ||
                  0
                ),
              0
            );


          const conversion =
            freshCalls > 0

              ? (
                  freshTickets /
                  freshCalls
                ) * 100

              : 0;


          return {

            agentName,

            freshCalls,

            freshTickets,

            conversion,

            insurance,

            google,

            trustpilot,

            dcCalls,

            dcSales,

            cancellationCalls,

            cancellationSales,

            b2cSales,

          };

        }
      );

    }, [
      meetingTeam,
      teamReports,
    ]);


  /* =====================================================
     FILTER MEETING TEAM AGENTS
  ===================================================== */

  const availableTeamAgents =
    useMemo(() => {

      const query =
        teamSearch
          .trim()
          .toLowerCase();


      return agents.filter(
        (agent) => {

          if (
            agent.role &&
            agent.role !==
            "Agent"
          ) {

            return false;

          }


          if (!query) {
            return true;
          }


          return (
            agent.name
              ?.toLowerCase()
              .includes(query)
          );

        }
      );

    }, [
      agents,
      teamSearch,
    ]);


  /* =====================================================
     TOGGLE MEETING TEAM AGENT
  ===================================================== */

  function toggleMeetingAgent(
    agentName
  ) {

    setMeetingTeam(
      (current) => {

        const exists =
          current.some(
            (name) =>
              name
                .trim()
                .toLowerCase() ===
              agentName
                .trim()
                .toLowerCase()
          );


        if (exists) {

          return current.filter(
            (name) =>
              name
                .trim()
                .toLowerCase() !==
              agentName
                .trim()
                .toLowerCase()
          );

        }


        return [
          ...current,
          agentName,
        ];

      }
    );

  }


  /* =====================================================
     REMOVE MEETING TEAM AGENT
  ===================================================== */

  function removeMeetingAgent(
    agentName
  ) {

    setMeetingTeam(
      (current) =>
        current.filter(
          (name) =>
            name
              .trim()
              .toLowerCase() !==
            agentName
              .trim()
              .toLowerCase()
        )
    );

  }


  /* =====================================================
     KPI MODAL DATA
  ===================================================== */

  function getModalData() {

    switch (
      selectedKPI
    ) {

      case "freshCalls":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.fresh_calls ||
              0,

          })
        );


      case "nameCalls":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.name_calls ||
              0,

          })
        );


      case "tickets":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.fresh_tickets ||
              0,

          })
        );


      case "insurance":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.insurance_sold ||
              0,

          })
        );


      case "google":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.google_reviews ||
              0,

          })
        );


      case "trustpilot":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              report.trustpilot_reviews ||
              0,

          })
        );


      case "toa":

        return filteredReports.map(
          (report) => ({

            agent:
              report.agent_name,

            value:
              `$${Number(
                report.token_appreciation ||
                0
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
                  alerts={
                    alerts
                  }
                />

              </div>

            </div>


            {/* =============================================
                RECEPTION VS AGENT ALERT
            ============================================== */}

            {!verificationLoading &&
            verificationData &&
            verificationData.summary
              ?.mismatch_agents > 0 && (

              <div className="reception-verification-alert">

                <div className="reception-verification-alert-icon">

                  ⚠️

                </div>


                <div className="reception-verification-alert-content">

                  <strong>
                    Reception vs Agent mismatch
                  </strong>

                  <span>

                    {
                      verificationData.summary
                        .mismatch_agents
                    }

                    {" "}

                    agent
                    {
                      verificationData.summary
                        .mismatch_agents !== 1
                        ? "s"
                        : ""
                    }

                    {" "}require
                    {
                      verificationData.summary
                        .mismatch_agents === 1
                        ? "s"
                        : ""
                    }{" "}

                    verification for{" "}

                    {selectedDate}.

                  </span>

                </div>


                <div className="reception-verification-alert-count">

                  {
                    verificationData.summary
                      .mismatch_agents
                  }

                </div>

              </div>

            )}


            {/* =============================================
                VERIFICATION ERROR
            ============================================== */}

            {verificationError && (

              <div className="reception-verification-error">

                <strong>
                  Reception verification unavailable
                </strong>

                <span>
                  {verificationError}
                </span>

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

                <span className="section-label">
                  DATA VERIFICATION
                </span>

                <h2>
                  Reception vs Agent Verification
                </h2>

                <p>
                  Compare official Reception call counts
                  against Agent daily reports.
                </p>

              </div>


              {verificationLoading ? (

                <div className="verification-loading">

                  Loading verification...

                </div>

              ) : verificationData ? (

                <>


                  {/* =====================================
                      SUMMARY
                  ====================================== */}

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
                        Mismatch
                      </span>

                      <strong>
                        {
                          verificationData.summary
                            .mismatch_agents
                        }
                      </strong>

                    </div>

                  </div>


                  {/* =====================================
                      TABLE
                  ====================================== */}

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

                        {verificationData.verification
                          ?.flatMap(
                            (item) => [

                              {
                                agent_name:
                                  item.agent_name,

                                metric:
                                  "Fresh Calls",

                                reception:
                                  item.metrics
                                    ?.fresh_calls
                                    ?.reception ??
                                  0,

                                agent:
                                  item.metrics
                                    ?.fresh_calls
                                    ?.agent ??
                                  0,

                                difference:
                                  item.metrics
                                    ?.fresh_calls
                                    ?.difference ??
                                  0,

                                status:
                                  item.metrics
                                    ?.fresh_calls
                                    ?.status ??
                                  "Verified",
                              },


                              {
                                agent_name:
                                  item.agent_name,

                                metric:
                                  "DC Calls",

                                reception:
                                  item.metrics
                                    ?.dc_calls
                                    ?.reception ??
                                  0,

                                agent:
                                  item.metrics
                                    ?.dc_calls
                                    ?.agent ??
                                  0,

                                difference:
                                  item.metrics
                                    ?.dc_calls
                                    ?.difference ??
                                  0,

                                status:
                                  item.metrics
                                    ?.dc_calls
                                    ?.status ??
                                  "Verified",
                              },


                              {
                                agent_name:
                                  item.agent_name,

                                metric:
                                  "Cancellation Calls",

                                reception:
                                  item.metrics
                                    ?.cancellation_calls
                                    ?.reception ??
                                  0,

                                agent:
                                  item.metrics
                                    ?.cancellation_calls
                                    ?.agent ??
                                  0,

                                difference:
                                  item.metrics
                                    ?.cancellation_calls
                                    ?.difference ??
                                  0,

                                status:
                                  item.metrics
                                    ?.cancellation_calls
                                    ?.status ??
                                  "Verified",
                              },

                            ]
                          )
                          .map(
                            (
                              row,
                              index
                            ) => (

                              <tr
                                key={`${row.agent_name}-${row.metric}-${index}`}
                              >

                                <td>
                                  {row.agent_name}
                                </td>

                                <td>
                                  {row.metric}
                                </td>

                                <td>
                                  {row.reception}
                                </td>

                                <td>
                                  {row.agent}
                                </td>

                                <td>
                                  {row.difference > 0
                                    ? `+${row.difference}`
                                    : row.difference}
                                </td>

                                <td>

                                  <span
                                    className={`verification-status ${
                                      row.status
                                        .toLowerCase()
                                    }`}
                                  >

                                    {row.status ===
                                    "Verified"
                                      ? "✓ Verified"
                                      : "⚠ Mismatch"}

                                  </span>

                                </td>

                              </tr>

                            )
                          )}


                        {(!verificationData.verification ||
                          verificationData.verification.length === 0) && (

                          <tr>

                            <td
                              colSpan="6"
                              className="verification-empty"
                            >

                              No Reception or Agent
                              reports found for{" "}
                              {selectedDate}.

                            </td>

                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </>

              ) : (

                <div className="verification-empty">

                  No verification data available.

                </div>

              )}

            </section>


            {/* =============================================
                MEETING TEAM
            ============================================== */}

            <section className="meeting-team-section">


              <div className="meeting-team-header">

                <div>

                  <span className="section-label">
                    COLLABORATION
                  </span>

                  <h2>
                    Meeting Team
                  </h2>

                  <p>
                    Select the agents who are part
                    of this meeting.
                  </p>

                </div>


                <button
                  type="button"
                  className="add-team-agent-btn"
                  onClick={() =>
                    setShowAgentSelector(
                      (current) =>
                        !current
                    )
                  }
                >

                  {showAgentSelector
                    ? "Close"
                    : "+ Add Agent"}

                </button>

              </div>


              {/* =========================================
                  AGENT SELECTOR
              ========================================== */}

              {showAgentSelector && (

                <div className="meeting-team-selector">

                  <div className="team-selector-search">

                    <input
                      type="text"
                      placeholder="Search agents..."
                      value={
                        teamSearch
                      }
                      onChange={(e) =>
                        setTeamSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="team-selector-list">

                    {availableTeamAgents.map(
                      (agent) => {

                        const selected =
                          meetingTeam.some(
                            (name) =>
                              name
                                .trim()
                                .toLowerCase() ===
                              agent.name
                                ?.trim()
                                .toLowerCase()
                          );


                        return (

                          <button
                            type="button"
                            key={
                              agent.id
                            }
                            className={
                              selected
                                ? "team-agent-option selected"
                                : "team-agent-option"
                            }
                            onClick={() =>
                              toggleMeetingAgent(
                                agent.name
                              )
                            }
                          >

                            <span>

                              {selected
                                ? "✓"
                                : "○"}

                            </span>

                            {agent.name}

                          </button>

                        );

                      }
                    )}


                    {availableTeamAgents.length === 0 && (

                      <div className="team-selector-empty">

                        No agents found.

                      </div>

                    )}

                  </div>

                </div>

              )}


              {/* =========================================
                  SELECTED TEAM
              ========================================== */}

              {meetingTeam.length > 0 && (

                <div className="meeting-team-members">

                  {meetingTeam.map(
                    (agentName) => (

                      <div
                        className="meeting-team-member"
                        key={
                          agentName
                        }
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
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}


              {/* =========================================
                  DATE CONTROLS
              ========================================== */}

              {meetingTeam.length > 0 && (

                <>

                  <div className="meeting-team-date-controls">

                    <div>

                      <label>
                        From
                      </label>

                      <input
                        type="date"
                        value={
                          teamFromDate
                        }
                        onChange={(e) =>
                          setTeamFromDate(
                            e.target.value
                          )
                        }
                      />

                    </div>


                    <div>

                      <label>
                        To
                      </label>

                      <input
                        type="date"
                        value={
                          teamToDate
                        }
                        onChange={(e) =>
                          setTeamToDate(
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>


                  {/* =====================================
                      TEAM KPIs
                  ====================================== */}

                  <div className="meeting-team-kpi-grid">

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
                      label="TOA"
                      value={`$${teamTotals.toa.toFixed(
                        2
                      )}`}
                    />

                  </div>


                  {/* =====================================
                      TEAM MEMBER PERFORMANCE
                  ====================================== */}

                  <div className="meeting-team-table-wrapper">

                    <div className="meeting-team-table-title">

                      <div>

                        <h3>
                          Team Member Performance
                        </h3>

                        <span>
                          Click an agent to open
                          their individual performance.
                        </span>

                      </div>

                    </div>


                    {teamLoading ? (

                      <div className="team-loading">

                        Loading team performance...

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
                                  team and date range.

                                </td>

                              </tr>

                            ) : (

                              teamAgentPerformance.map(
                                (agent) => (

                                  <tr
                                    key={
                                      agent.agentName
                                    }
                                    className="clickable-agent-row"
                                    onClick={() =>
                                      setSelectedAgent(
                                        agent.agentName
                                      )
                                    }
                                  >

                                    <td className="team-agent-name">

                                      {
                                        agent.agentName
                                      }

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

                </>

              )}

            </section>


            {/* =============================================
                EXISTING TEAM TABLE
            ============================================== */}

            <div className="team-table-card">

              <TeamTable

                reports={
                  filteredReports
                }

                onEdit={
                  setEditingReport
                }

                onDelete={
                  setDeletingReport
                }

              />

            </div>

          </>

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