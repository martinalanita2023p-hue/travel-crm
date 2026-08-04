import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Layout from "../components/Layout";
import ManagerHeader from "../components/manager/ManagerHeader";


import SummaryCards from "../components/manager/SummaryCards/SummaryCards";
import AttentionCenter from "../components/dashboard/AttentionCenter";
import TopPerformers from "../components/dashboard/TopPerformers";
import TeamTable from "../components/manager/TeamTable/TeamTable";


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

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedAgent, setSelectedAgent] =
    useState("All Agents");

  const [search, setSearch] = useState("");

  const [selectedKPI, setSelectedKPI] =
    useState(null);

  const [editingReport, setEditingReport] =
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
  } = useManagerData(selectedDate);

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

  const filteredReports = useMemo(() => {

    let data = [...reports];

    if (selectedAgent !== "All Agents") {

      data = data.filter(
        report =>
          report.agent_name === selectedAgent
      );

    }

    if (search.trim()) {

      data = data.filter(report =>
        report.agent_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    return data;

  }, [
    reports,
    selectedAgent,
    search,
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
        />

        
      <SummaryCards
    stats={stats}
    onCardClick={setSelectedKPI}
/>

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

        <TeamTable
    reports={filteredReports}
    onAnalytics={setEditingReport}
/>

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

export default Manager;