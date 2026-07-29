import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import Layout from "../components/Layout";
import ManagerHeader from "../components/manager/ManagerHeader";

import DashboardSummary from "../components/dashboard/DashboardSummary";
import KPICards from "../components/dashboard/KPICards";
import TopPerformers from "../components/dashboard/TopPerformers";
import RecentActivity from "../components/dashboard/RecentActivity";
import AgentPerformanceTable from "../components/dashboard/AgentPerformanceTable";
import KPIDetailsModal from "../components/dashboard/KPIDetailsModal";
import EditReportModal from "../components/dashboard/EditReportModal";
import DeleteReportModal from "../components/dashboard/DeleteReportModal";

// Uncomment if you have this component
// import Leaderboard from "../components/dashboard/Leaderboard";

import useManagerData from "../hooks/useManagerData";
import { getAllAgents } from "../services/userService";

import "../styles/manager.css";

function Manager() {
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

  const {
    reports,
    loading,
    error,
  } = useManagerData(selectedDate);

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await getAllAgents();
        setAgents(data || []);
      } catch (err) {
        console.error("Failed to load agents:", err);
      }
    }

    loadAgents();
  }, []);

  const filteredReports = useMemo(() => {
    let data = [...reports];

    if (selectedAgent !== "All Agents") {
      data = data.filter(
        (r) => r.agent_name === selectedAgent
      );
    }

    if (search.trim()) {
      data = data.filter((r) =>
        r.agent_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return data;
  }, [reports, selectedAgent, search]);
  
    const stats = useMemo(() => {
    let freshCalls = 0;
    let nameCalls = 0;
    let macCalls = 0;
    let dcCalls = 0;
    let cancellationCalls = 0;
    let managerCalls = 0;
    let airportCalls = 0;

    let pnrs = 0;
    let freshTickets = 0;

    let dcSales = 0;
    let cancellationSales = 0;
    let b2cSales = 0;

    let insurance = 0;
    let google = 0;
    let trustpilot = 0;

    let toa = 0;

    filteredReports.forEach((r) => {
      freshCalls += Number(r.fresh_calls ?? 0);
      nameCalls += Number(r.name_calls ?? 0);
      macCalls += Number(r.mac_calls ?? 0);
      dcCalls += Number(r.dc_calls ?? 0);
      cancellationCalls += Number(r.cancellation_calls ?? 0);
      managerCalls += Number(r.manager_calls ?? 0);
      airportCalls += Number(r.airport_calls ?? 0);

      pnrs += Number(r.pnrs_created ?? 0);
      freshTickets += Number(r.fresh_tickets ?? 0);

      dcSales += Number(r.dc_sales ?? 0);
      cancellationSales += Number(r.cancellation_sales ?? 0);
      b2cSales += Number(r.b2c_sales ?? 0);

      insurance += Number(r.insurance_sold ?? 0);
      google += Number(r.google_reviews ?? 0);
      trustpilot += Number(r.trustpilot_reviews ?? 0);

      toa += Number(r.token_appreciation ?? 0);
    });

    const conversion =
      freshCalls === 0
        ? 0
        : Number(
            ((freshTickets / freshCalls) * 100).toFixed(2)
          );

    const submittedAgents = new Set(
      filteredReports.map((r) => r.agent_name)
    ).size;

    const totalAgents = agents.length;

    const missingAgents = Math.max(
      totalAgents - submittedAgents,
      0
    );

    const targetMetAgents = filteredReports.filter(
      (r) => Number(r.fresh_calls ?? 0) >= 5
    ).length;

    const belowTargetAgents = filteredReports.filter(
      (r) => Number(r.fresh_calls ?? 0) < 5
    ).length;

    return {
      freshCalls,
      nameCalls,
      macCalls,
      dcCalls,
      cancellationCalls,
      managerCalls,
      airportCalls,

      pnrs,
      freshTickets,

      dcSales,
      cancellationSales,
      b2cSales,

      insurance,
      google,
      trustpilot,

      toa,
      conversion,

      submittedAgents,
      missingAgents,
      totalAgents,

      targetMetAgents,
      belowTargetAgents,
    };
  }, [filteredReports, agents]);

  function getModalData() {
    switch (selectedKPI) {
      case "freshCalls":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.fresh_calls ?? 0,
        }));

      case "nameCalls":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.name_calls ?? 0,
        }));

      case "tickets":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.fresh_tickets ?? 0,
        }));

      case "insurance":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.insurance_sold ?? 0,
        }));

      case "google":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.google_reviews ?? 0,
        }));

      case "trustpilot":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: r.trustpilot_reviews ?? 0,
        }));

      case "toa":
        return filteredReports.map((r) => ({
          agent: r.agent_name,
          value: `$${Number(
            r.token_appreciation ?? 0
          ).toFixed(2)}`,
        }));

      default:
        return [];
    }
  }

  function exportExcel() {
    const worksheet =
      XLSX.utils.json_to_sheet(filteredReports);

    const workbook = XLSX.utils.book_new();

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

  if (loading) {
    return (
      <Layout>
        <h2>Loading Manager Dashboard...</h2>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h2>{error}</h2>
      </Layout>
    );
  }
  
    return (
    <Layout>
      <div className="manager-page">

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

        <DashboardSummary stats={stats} />

        <KPICards
          stats={stats}
          onCardClick={setSelectedKPI}
        />

        <div className="manager-row">

          <TopPerformers
            reports={filteredReports}
          />

          <RecentActivity
            reports={filteredReports}
          />

          {/* Uncomment when Leaderboard component exists */}

          {/*
          <Leaderboard
            reports={filteredReports}
          />
          */}

        </div>

        <AgentPerformanceTable
          reports={filteredReports}
          onEdit={setEditingReport}
          onDelete={setDeletingReport}
        />

        {selectedKPI && (
          <KPIDetailsModal
            title={selectedKPI}
            data={getModalData()}
            onClose={() => setSelectedKPI(null)}
          />
        )}

        {editingReport && (
          <EditReportModal
            report={editingReport}
            onClose={() => setEditingReport(null)}
            onSaved={() => {
              setEditingReport(null);
              window.location.reload();
            }}
          />
        )}

        {deletingReport && (
          <DeleteReportModal
            report={deletingReport}
            onClose={() => setDeletingReport(null)}
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