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


/* =====================================================
   GET CURRENT EASTERN DATE
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

    agent_name: agentName || "",

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
     REPORT STATE
  =================================================== */

  const [report, setReport] =
    useState(
      createEmptyReport(
        currentUser?.name
      )
    );


  /* ===================================================
     HISTORY STATE
  =================================================== */

  const [lastReports, setLastReports] =
    useState([]);


  /* ===================================================
     SUBMISSION STATE

     false = no report submitted yet
     true  = today's report already exists
  =================================================== */

  const [isSubmitted, setIsSubmitted] =
    useState(false);


  /* ===================================================
     LOADING STATE
  =================================================== */

  const [loadingReport, setLoadingReport] =
    useState(true);


  /* ===================================================
     LOAD TODAY'S REPORT
  =================================================== */

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
           EXISTING REPORT FOUND
        ============================================== */

        if (todayReport) {

          setReport(
            todayReport
          );

          setIsSubmitted(true);

        }


        /* =============================================
           NO REPORT FOR TODAY
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

      catch (err) {

        console.error(
          "Failed to load today's report:",
          err
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

  function handleChange(e) {

    const {
      name,
      value,
    } = e.target;


    setReport(
      (currentReport) => ({

        ...currentReport,

        [name]: value,

      })
    );

  }


  /* =====================================================
     CONVERSION
  ===================================================== */

  const conversion =

    Number(report.fresh_calls) === 0

      ? 0

      : (

          Number(
            report.fresh_tickets
          ) /

          Number(
            report.fresh_calls
          )

        ) * 100;


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


      /*
       * Remove database-generated fields.
       *
       * The upsert will find the existing row
       * using agent_name + report_date.
       */

      delete reportData.id;

      delete reportData.created_at;


      /* =============================================
         SAVE
      ============================================== */

      const savedData =
        await submitAgentReport(
          reportData
        );


      /* =============================================
         USE RETURNED DATABASE ROW
      ============================================== */

      if (
        savedData &&
        savedData.length > 0
      ) {

        setReport(
          savedData[0]
        );

      }


      /* =============================================
         MARK AS SUBMITTED
      ============================================== */

      setIsSubmitted(true);


      /* =============================================
         MESSAGE
      ============================================== */

      if (isSubmitted) {

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
     LOAD HISTORY
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
        history
      );

    }

    catch (err) {

      console.error(
        "Failed to load report history:",
        err
      );

    }

  }


  /* =====================================================
     LOADING
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
     PAGE
  ===================================================== */

  return (

    <Layout title="Agent Dashboard">

      <div className="agent-page">


        {/* =============================================
            HEADER
        ============================================== */}

        <AgentHeader />


        {/* =============================================
            SUMMARY
        ============================================== */}

        <AgentSummary
          report={report}
        />


        {/* =============================================
            MAIN GRID
        ============================================== */}

        <div className="agent-main-grid">


          {/* ===========================================
              REPORT FORM
          ============================================ */}

          <AgentReportForm

            report={
              report
            }

            handleChange={
              handleChange
            }

            handleSubmit={
              handleSubmit
            }

            isSubmitted={
              isSubmitted
            }

            submitLabel={
              isSubmitted
                ? "Update Today's Report"
                : "Submit Today's Report"
            }

          />


          {/* ===========================================
              PROGRESS
          ============================================ */}

          <AgentProgress
            report={
              report
            }

          />


        </div>


        {/* =============================================
            HISTORY
        ============================================== */}

        <AgentHistory

          reports={
            lastReports
          }

        />

      </div>

    </Layout>

  );

}


export default Agent;