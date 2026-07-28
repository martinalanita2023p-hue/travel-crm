import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import AgentHeader from "../components/agentHeader";
import DashboardRenderer from "../components/DashboardRenderer";

import "../styles/agentDashboard.css";

import { getUser } from "../services/AuthService";

import {
  getTodayReport,
  submitAgentReport,
} from "../services/agentService";

function Agent() {

  const currentUser = getUser();

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

        report_date:

          new Date()

            .toISOString()

            .split("T")[0],

      };

      delete reportData.id;
      delete reportData.created_at;

      await submitAgentReport(reportData);

      alert("✅ Report Saved Successfully");

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

  return (

    <Layout title="Agent Dashboard">

      <div className="dashboard-container">

        <AgentHeader />

        <DashboardRenderer

          report={report}

          handleChange={handleChange}

        />

        

        <div className="performance-card">

          <h2>📈 Today's Conversion</h2>

          <h1>{conversion.toFixed(2)}%</h1>

        </div>

        <button

          className="submit-btn"

          onClick={handleSubmit}

        >

          💾 Save Today's Report

        </button>

      </div>

    </Layout>

  );

}

export default Agent;