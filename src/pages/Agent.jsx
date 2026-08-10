import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import AgentHeader from "../components/AgentHeader";

import AgentReportForm from "../components/agent/AgentReportForm";
import AgentProgress from "../components/agent/AgentProgress";
import AgentSummary from "../components/agent/AgentSummary";
import AgentHistory from "../components/agent/AgentHistory";
import { toast } from "react-toastify";


import "../styles/agentDashboard.css";

import { getUser } from "../services/authService";

import {
  getTodayReport,
  submitAgentReport,
  getLastReports,
} from "../services/agentService";



function getEasternDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}



function Agent() {

  const currentUser = getUser();
  const [lastReports, setLastReports] = useState([]);

  const [report, setReport] = useState({
    

    agent_name: currentUser?.name || "",

    fresh_calls: 0,
    mac_calls: 0,
    manager_calls: 0,
    airport_calls: 0,
    name_calls: 0,

    dc_calls: 0,
    dc_sales: 0,

    cancellation_calls: 0,
    cancellation_sales: 0, 

    fresh_tickets: 0,
    b2c_sales: 0,

    pnrs_created: 0,

    insurance_sold: 0,
    google_reviews: 0,
    trustpilot_reviews: 0,

    token_appreciation: 0,

  });

  useEffect(() => {

    async function loadReport() {

      try {

        const todayReport = await getTodayReport(currentUser.name);

        if (todayReport) {

          setReport(todayReport);

        }

      }

      catch (err) {

        console.error(err);

      }

    }

    loadReport();

  }, []);

  function handleChange(e) {

    setReport({

      ...report,

      [e.target.name]: e.target.value,

    });

  }

  const conversion =

    Number(report.fresh_calls) === 0

      ? 0

      : (

          Number(report.fresh_tickets) /

          Number(report.fresh_calls)

        ) * 100;

  async function handleSubmit() {

    try {

      const reportData = {

        ...report,

        agent_name: currentUser.name,

        report_date: getEasternDate(),

      };

      delete reportData.id;
      delete reportData.created_at;

      await submitAgentReport(reportData);

     toast.success("Report saved successfully!");

    }

    catch (error) {

      console.error(error);

      toast.error(error.message);

    }

  }

  async function loadHistory() {

  try {

    const history =
      await getLastReports(
        currentUser.name
      );

    setLastReports(history);

  }

  catch (err) {

    console.error(err);

  }

}

  return (
  <Layout title="Agent Dashboard">

    <div className="agent-page">

      <AgentHeader />

      <AgentSummary
        report={report}
      />

      <div className="agent-main-grid">

        <AgentReportForm
          report={report}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          AgentHistory
    reports={lastReports}
        />

        <AgentProgress
          report={report}
        />

      </div>

    </div>

  </Layout>
);

}

export default Agent;