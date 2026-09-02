import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import AgentHeader from "../components/AgentHeader";

import AgentSummary
  from "../components/agent/AgentSummary";

import AgentReportForm
  from "../components/agent/AgentReportForm";

import AgentProgress
  from "../components/agent/AgentProgress";

import AgentHistory
  from "../components/agent/AgentHistory";

import AgentSalesPerformance
  from "../components/agent/AgentSalesPerformance/AgentSalesPerformance";

import AgentAdditionalPerformance
  from "../components/agent/AgentAdditionalPerformance/AgentAdditionalPerformance";

import { toast } from "react-toastify";

import "../styles/agentDashboard.css";

import { getUser } from "../services/authService";

import {
  getTodayReport,
  submitAgentReport,
  getLastReports,
} from "../services/agentService";

import useAgentPerformance
  from "../hooks/useAgentPerformance";


/* =====================================================
   GET CURRENT EASTERN / BOSTON DATE
===================================================== */

function getEasternDate() {

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "America/New_York",

      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date());

}


/* =====================================================
   DEFAULT REPORT
===================================================== */

function createEmptyReport(agentName) {

  return {

    agent_name:
      agentName || "",

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

  };

}


/* =====================================================
   AGENT PAGE
===================================================== */

function Agent() {

  const currentUser =
    getUser();


  /* ===================================================
     SHARED AGENT PERFORMANCE
     
     This is ONLY used for:
     
     Sales & Performance
     Additional Performance
     
     It uses the current month and
     Eastern / Boston time.
  =================================================== */

  const {
    reports,
    stats,
    fromDate,
    toDate,
    loading: performanceLoading,
    error: performanceError,
  } = useAgentPerformance();


  /* ===================================================
     TODAY'S REPORT
  =================================================== */

  const [report, setReport] =
    useState(
      createEmptyReport(
        currentUser?.name
      )
    );


  /* ===================================================
     REPORT HISTORY
  =================================================== */

  const [lastReports, setLastReports] =
    useState([]);


  /* ===================================================
     SUBMISSION STATUS
  =================================================== */

  const [isSubmitted, setIsSubmitted] =
    useState(false);


  /* ===================================================
     LOADING
  =================================================== */

  const [loadingReport, setLoadingReport] =
    useState(true);


  /* =====================================================
     LOAD TODAY'S REPORT
  ===================================================== */

  useEffect(() => {

    async function loadReport() {

      try {

        setLoadingReport(true);


        if (!currentUser?.name) {

          return;

        }


        const todayReport =
          await getTodayReport(
            currentUser.name
          );


        /* =============================================
           REPORT EXISTS
        ============================================== */

        if (todayReport) {

          setReport(
            todayReport
          );

          setIsSubmitted(true);

        }


        /* =============================================
           NO REPORT YET
        ============================================== */

        else {

          setReport(
            createEmptyReport(
              currentUser.name
            )
          );

          setIsSubmitted(false);

        }

      }

      catch (error) {

        console.error(
          "Failed to load today's report:",
          error
        );

        toast.error(
          "Unable to load today's report."
        );

      }

      finally {

        setLoadingReport(false);

      }

    }


    loadReport();

  }, [currentUser?.name]);


  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setReport(
      (currentReport) => ({

        ...currentReport,

        [name]: value,

      })
    );

  }


  /* =====================================================
     SUBMIT / UPDATE TODAY'S REPORT
  ===================================================== */

  async function handleSubmit() {

    try {

      if (!currentUser?.name) {

        toast.error(
          "Agent information is missing."
        );

        return;

      }


      const reportData = {

        ...report,

        agent_name:
          currentUser.name,

        report_date:
          getEasternDate(),

      };


      /* =============================================
         REMOVE DATABASE GENERATED FIELDS
      ============================================== */

      delete reportData.id;

      delete reportData.created_at;


      /* =============================================
         SAVE / UPDATE
      ============================================== */

      const savedData =
        await submitAgentReport(
          reportData
        );


      if (
        savedData &&
        savedData.length > 0
      ) {

        setReport(
          savedData[0]
        );

      }


      const wasAlreadySubmitted =
        isSubmitted;


      setIsSubmitted(true);


      if (wasAlreadySubmitted) {

        toast.success(
          "Today's report updated successfully!"
        );

      }

      else {

        toast.success(
          "Report submitted successfully!"
        );

      }

    }

    catch (error) {

      console.error(
        "Failed to save report:",
        error
      );


      toast.error(
        error?.message ||
        "Failed to save report."
      );

    }

  }


  /* =====================================================
     LOAD REPORT HISTORY
  ===================================================== */

  async function loadHistory() {

    try {

      if (!currentUser?.name) {

        return;

      }


      const history =
        await getLastReports(
          currentUser.name
        );


      setLastReports(
        history || []
      );

    }

    catch (error) {

      console.error(
        "Failed to load report history:",
        error
      );

    }

  }


  /* =====================================================
     LOAD HISTORY ONCE
  ===================================================== */

  useEffect(() => {

    loadHistory();

  }, [currentUser?.name]);


  /* =====================================================
     PERFORMANCE ERROR
  ===================================================== */

  if (performanceError) {

    console.error(
      "Agent performance error:",
      performanceError
    );

  }


  /* =====================================================
     PAGE LOADING
  ===================================================== */

  if (loadingReport) {

    return (

      <Layout title="Agent Dashboard">

        <div className="page-state">

          <h2>
            Loading today's report...
          </h2>

        </div>

      </Layout>

    );

  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (

    <Layout title="Agent Dashboard">

      <div className="agent-page">


        {/* =================================================
            AGENT HEADER
        ================================================= */}

        <AgentHeader />


        {/* =================================================
            TODAY'S SUMMARY
        ================================================= */}

        <AgentSummary
          report={report}
        />


        {/* =================================================
            SALES & PERFORMANCE
        ================================================= */}

        <AgentSalesPerformance

          stats={stats}

          loading={performanceLoading}

          fromDate={fromDate}

          toDate={toDate}

        />


        {/* =================================================
            ADDITIONAL PERFORMANCE
        ================================================= */}

        <AgentAdditionalPerformance

          stats={stats}

          loading={performanceLoading}

          fromDate={fromDate}

          toDate={toDate}

        />


        {/* =================================================
            TODAY'S REPORT + TODAY'S PERFORMANCE
        ================================================= */}

        <div className="agent-main-grid">


          {/* ===============================================
              TODAY'S REPORT
          =============================================== */}

          <AgentReportForm

            report={report}

            handleChange={handleChange}

            handleSubmit={handleSubmit}

            isSubmitted={isSubmitted}

            submitLabel={
              isSubmitted
                ? "Update Today's Report"
                : "Submit Today's Report"
            }

          />


          {/* ===============================================
              TODAY'S PERFORMANCE
          =============================================== */}

          <AgentProgress

            report={report}

          />


        </div>


        {/* =================================================
            REPORT HISTORY
        ================================================= */}

        <AgentHistory

          reports={lastReports}

        />

      </div>

    </Layout>

  );

}


export default Agent;