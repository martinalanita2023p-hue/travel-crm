import TeamStatus from "../components/manager/TeamStatus";
import ManagerHeader from "../components/manager/ManagerHeader";
import ManagerStats from "../components/manager/ManagerStats";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import Layout from "../components/Layout";
import "../styles/manager.css";

import {
  getReportsByDate,
  updateAgentReport,
  deleteAgentReport,
} from "../services/managerService";

import {
  getAllAgents,
} from "../services/userService";

function Manager() {

  const [reports, setReports] = useState([]);
  const [agents, setAgents] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  const [selectedDate, setSelectedDate] =
    useState(new Date().toISOString().split("T")[0]);

    const [search, setSearch] = useState("");

  const [selectedAgent, setSelectedAgent] =
    useState("All Agents");

  const [stats, setStats] = useState({
    freshCalls:0,
    macCalls:0,
    dcCalls:0,
    cancellationCalls:0,
    managerCalls:0,
    airportCalls:0,
    pnrs:0,
    freshTickets:0,
    dcSales:0,
    cancellationSales:0,
    b2cSales:0,
    insurance:0,
    google:0,
    trustpilot:0,
    toa:0,
    conversion:0,
    submittedAgents:0,
    missingAgents:0,
    totalAgents:0,
  });

  const [highlights,setHighlights]=useState({
    topFreshTickets:null,
    bestConversion:null,
    highestTOA:null,
    mostReviews:null,
  });

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedAgent]);

  async function loadData() {
    try {
      const reportData = await getReportsByDate(selectedDate);
      const agentData = await getAllAgents();

      setReports(reportData);
      setAgents(agentData);

      const filtered =
        selectedAgent === "All Agents"
          ? reportData
          : reportData.filter(
              r => r.agent_name === selectedAgent
            );

      const totalAgents = agentData.length;

      const submittedAgents =
        new Set(filtered.map(r => r.agent_name)).size;

      const missingAgents =
        totalAgents - submittedAgents;

      let freshCalls=0,macCalls=0,dcCalls=0,
          cancellationCalls=0,managerCalls=0,
          airportCalls=0,pnrs=0,freshTickets=0,
          dcSales=0,cancellationSales=0,
          b2cSales=0,insurance=0,
          google=0,trustpilot=0,toa=0;

      filtered.forEach(r=>{
        freshCalls+=Number(r.fresh_calls||0);
        macCalls+=Number(r.mac_calls||0);
        dcCalls+=Number(r.dc_calls||0);
        cancellationCalls+=Number(r.cancellation_calls||0);
        managerCalls+=Number(r.manager_calls||0);
        airportCalls+=Number(r.airport_calls||0);
        pnrs+=Number(r.pnrs_created||0);
        freshTickets+=Number(r.fresh_tickets||0);
        dcSales+=Number(r.dc_sales||0);
        cancellationSales+=Number(r.cancellation_sales||0);
        b2cSales+=Number(r.b2c_sales||0);
        insurance+=Number(r.insurance_sold||0);
        google+=Number(r.google_reviews||0);
        trustpilot+=Number(r.trustpilot_reviews||0);
        toa+=Number(r.token_appreciation||0);
      });

      const conversion =
        freshCalls===0 ? 0 :
        Number(((freshTickets/freshCalls)*100).toFixed(2));

      setStats({
        freshCalls,macCalls,dcCalls,cancellationCalls,
        managerCalls,airportCalls,pnrs,freshTickets,
        dcSales,cancellationSales,b2cSales,
        insurance,google,trustpilot,toa,
        conversion,
        submittedAgents,
        missingAgents,
        totalAgents
      });

    } catch(err){
      console.error(err);
    }
  }

  function exportExcel() {

  const worksheet = XLSX.utils.json_to_sheet(reports);

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

      <TeamStatus
    stats={stats}
/>

<ManagerStats
    stats={stats}
/>


    </div>

  </Layout>
);
}

export default Manager;
