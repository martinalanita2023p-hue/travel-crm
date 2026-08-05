import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Layout from "../components/Layout";
import buildInsights from "../utils/buildInsights";
import ManagerHeader from "../components/manager/ManagerHeader";
import aggregateReports from "../utils/aggregateReports";
import Leaderboard from "../components/manager/Leaderboard/Leaderboard";
import QuickActions from "../components/manager/QuickActions/QuickActions";

import SummaryCards from "../components/manager/SummaryCards/SummaryCards";
import AttentionCenter from "../components/dashboard/AttentionCenter";
import TopPerformers from "../components/dashboard/TopPerformers";
import TeamStatus from "../components/manager/TeamStatus/TeamStatus";
import TeamTable from "../components/manager/TeamTable/TeamTable";
import AnalyticsDrawer from "../components/manager/Drawer/AnalyticsDrawer";



import KPIDetailsModal from "../components/dashboard/KPIDetailsModal";
import EditReportModal from "../components/dashboard/EditReportModal";
import DeleteReportModal from "../components/dashboard/DeleteReportModal";


import useManagerData from "../hooks/useManagerData";
import { getAllAgents } from "../services/userService";

import calculateStats from "../utils/calculateStats";
import buildAlerts from "../utils/buildAlerts";

import "../styles/manager.css";

export default function Manager() {

  /* ==========================
     STATE
  ========================== */

  const [agents, setAgents] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [viewMode, setViewMode] = useState("day");

  const [selectedAgent, setSelectedAgent] =
    useState("All Agents");

  const [search, setSearch] = useState("");

  const [selectedKPI, setSelectedKPI] =
    useState(null);

  const [editingReport, setEditingReport] =
    useState(null);

    const [selectedReport, setSelectedReport] =
  useState(null);

  const [deletingReport, setDeletingReport] =
    useState(null);

  /* ==========================
     DATA
  ========================== */

const {
  reports,
  loading,
  error,
} = useManagerData(
  selectedDate,
  viewMode
);

  /* ==========================
     LOAD AGENTS
  ========================== */

  useEffect(() => {

    async function loadAgents() {

      try {

        const data = await getAllAgents();

        setAgents(data || []);

      } catch (err) {

        console.error(
          "Failed to load agents:",
          err
        );

      }

    }

    loadAgents();

  }, []);
    /* ==========================
     FILTER REPORTS
  ========================== */

  if (viewMode !== "day") {

  data = aggregateReports(data);

}

  const filteredReports = useMemo(() => {

  let data = [...reports];

  if (selectedAgent !== "All Agents") {

    data = data.filter(
      report => report.agent_name === selectedAgent
    );

  }

  if (search.trim()) {

    data = data.filter(report =>
      report.agent_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  }

  // Aggregate reports for Week & Month
  if (viewMode !== "day") {

    data = aggregateReports(data);

  }

  return data;

}, [
  reports,
  selectedAgent,
  search,
  viewMode
]);

  /* ==========================
     DASHBOARD STATS
  ========================== */

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

  const insights = useMemo(
  () => buildInsights(stats),
  [stats]
);

  /* ==========================
     ALERTS
  ========================== */

  const alerts = useMemo(

    () => buildAlerts(stats),

    [stats]

  );

    /* ==========================
     KPI MODAL DATA
  ========================== */

  function getModalData() {

    switch (selectedKPI) {

      case "freshCalls":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.fresh_calls || 0,
        }));

      case "nameCalls":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.name_calls || 0,
        }));

      case "tickets":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.fresh_tickets || 0,
        }));

      case "insurance":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.insurance_sold || 0,
        }));

      case "google":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.google_reviews || 0,
        }));

      case "trustpilot":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: report.trustpilot_reviews || 0,
        }));

      case "toa":

        return filteredReports.map(report => ({
          agent: report.agent_name,
          value: `$${Number(
            report.token_appreciation || 0
          ).toFixed(2)}`,
        }));

      default:

        return [];

    }

  }

  /* ==========================
     EXPORT EXCEL
  ========================== */

  function exportExcel() {

    const worksheet =
      XLSX.utils.json_to_sheet(filteredReports);

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

  /* ==========================
     PAGE STATES
  ========================== */

  if (loading) {

    return (

      <Layout title="Manager Dashboard">

        <div className="page-state">

          <h2>Loading Manager Dashboard...</h2>

        </div>

      </Layout>

    );

  }

  if (error) {

    return (

      <Layout title="Manager Dashboard">

        <div className="page-state error">

          <h2>{error}</h2>

        </div>

      </Layout>

    );

  }
    return (

    <Layout title="Manager Dashboard">

      <div className="manager-page">

        {/* ==========================
            HEADER
        ========================== */}

        <ManagerHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          agents={agents}
          search={search}
          setSearch={setSearch}
          exportExcel={exportExcel}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
        />

        <TeamStatus
    reports={filteredReports}
    agents={agents}
/>

        
  <SummaryCards
    stats={stats}
    onCardClick={setSelectedKPI}
    viewMode={viewMode}
/>



<Leaderboard
    reports={filteredReports}
/>

<div className="manager-tabs">

  <button
    className={activeTab==="overview" ? "active" : ""}
    onClick={()=>setActiveTab("overview")}
  >
    📊 Overview
  </button>

  <button
    className={activeTab==="team" ? "active" : ""}
    onClick={()=>setActiveTab("team")}
  >
    👥 Team
  </button>

  <button
    className={activeTab==="analytics" ? "active" : ""}
    onClick={()=>setActiveTab("analytics")}
  >
    📈 Analytics
  </button>

  <button
    className={activeTab==="leaderboard" ? "active" : ""}
    onClick={()=>setActiveTab("leaderboard")}
  >
    🏆 Leaderboard
  </button>

</div>

        {/* ==========================
            INSIGHTS
        ========================== */}

        <div className="manager-info-row">

          <div className="manager-left-panel">

            <AttentionCenter
              alerts={alerts}
            />

          </div>

          <div className="manager-right-panel">

            <TopPerformers
              reports={filteredReports}
            />

          </div>

        </div>

        {/* ==========================
            PERFORMANCE TABLE
        ========================== */}

       <div className="manager-workspace">

    <div className="workspace-left">

        {activeTab === "team" && (

<TeamTable
    reports={filteredReports}
    onAnalytics={setSelectedReport}
/>

)}

    </div>

    <div className="workspace-right">

        <AnalyticsDrawer
            report={selectedReport}
        />

    </div>

</div>


                {/* ==========================
            MODALS
        ========================== */}

        {selectedKPI && (

          <KPIDetailsModal
            title={selectedKPI}
            data={getModalData()}
            onClose={() =>
              setSelectedKPI(null)
            }
          />

        )}

        {editingReport && (

          <EditReportModal
            report={editingReport}
            onClose={() =>
              setEditingReport(null)
            }
            onSaved={() => {

              setEditingReport(null);

              window.location.reload();

            }}
          />

        )}

        {deletingReport && (

          <DeleteReportModal
            report={deletingReport}
            onClose={() =>
              setDeletingReport(null)
            }
            onDeleted={() => {

              setDeletingReport(null);

              window.location.reload();

            }}
          />

        )}

      </div>

    </Layout>

  );

}

