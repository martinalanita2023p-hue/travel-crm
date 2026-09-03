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
import { getBostonDate } from "../utils/bostonTime";

import {
  validateAgentAgainstReception,
} from "../services/agentReceptionValidationService";

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
   RECEPTION VERIFICATION
===================================================== */

const [receptionVerification, setReceptionVerification] =
  useState(null);

const [receptionVerificationLoading, setReceptionVerificationLoading] =
  useState(true);


  /* =====================================================
     LOAD TODAY'S REPORT
  ===================================================== */

  /* =====================================================
   LOAD TODAY'S REPORT + RECEPTION VERIFICATION
===================================================== */

useEffect(() => {

  async function loadReport() {

    try {

      setLoadingReport(true);
      setReceptionVerificationLoading(true);


      if (!currentUser?.name) {

        return;

      }


      const reportDate =
        getBostonDate();


      const todayReport =
        await getTodayReport(
          currentUser.name
        );


      /* =============================================
         LOAD AGENT REPORT
      ============================================== */

      if (todayReport) {

        setReport(
          todayReport
        );

        setIsSubmitted(true);

      }

      else {

        setReport(
          createEmptyReport(
            currentUser.name
          )
        );

        setIsSubmitted(false);

      }


      /* =============================================
         CHECK RECEPTION
      ============================================== */

      const reportForVerification =
        todayReport ||
        createEmptyReport(
          currentUser.name
        );


      const verification =
        await validateAgentAgainstReception(
          currentUser.name,
          reportDate,
          reportForVerification
        );


      setReceptionVerification(
        verification
      );

    }

    catch (error) {

      console.error(
        "Failed to load today's report:",
        error
      );

      toast.error(
        "Unable to load today's report."
      );

      setReceptionVerification(
        null
      );

    }

    finally {

      setLoadingReport(false);

      setReceptionVerificationLoading(false);

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
    getBostonDate(),

};


      /* =============================================
         REMOVE DATABASE GENERATED FIELDS
      ============================================== */

      delete reportData.id;

      delete reportData.created_at;

      /* =============================================
   CHECK AGAINST RECEPTION BEFORE SAVING
============================================= */

const verification =
  await validateAgentAgainstReception(
    currentUser.name,
    reportData.report_date,
    reportData
  );


/* =============================================
   RECEPTION EXISTS + NUMBERS DON'T MATCH
============================================= */

if (
  verification.receptionExists &&
  !verification.allowed
) {

  setReceptionVerification(
    verification
  );


  const mismatchMessage =
    verification.mismatches
      .map(
        (item) =>
          `${item.metric}: Reception ${item.reception}, you entered ${item.agent}`
      )
      .join(" | ");


  toast.error(
    `Report not submitted. ${mismatchMessage}`
  );


  return;

}


/* =============================================
   NUMBERS MATCH / RECEPTION NOT ENTERED
============================================= */

setReceptionVerification(
  verification
);




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

        {/* =================================================
    RECEPTION VERIFICATION
================================================= */}

{!receptionVerificationLoading &&
  receptionVerification && (
    <div
      className={`agent-reception-verification ${
        receptionVerification.receptionExists
          ? receptionVerification.allowed
            ? "verified"
            : "mismatch"
          : "waiting"
      }`}
    >

      {/* ============================================
          RECEPTION NOT ENTERED
      ============================================ */}

      {!receptionVerification.receptionExists && (

        <>
          <div className="agent-verification-icon">
            🟡
          </div>

          <div className="agent-verification-content">

            <strong>
              Waiting for Reception verification
            </strong>

            <span>
              Reception has not entered today's
              call numbers yet. You can submit
              your report normally.
            </span>

          </div>
        </>

      )}


      {/* ============================================
          VERIFIED
      ============================================ */}

      {receptionVerification.receptionExists &&
        receptionVerification.allowed && (

        <>
          <div className="agent-verification-icon">
            🟢
          </div>

          <div className="agent-verification-content">

            <strong>
              Reception Verified
            </strong>

            <span>
              Your Fresh Calls, DC Calls, and
              Cancellation Calls match Reception.
            </span>

          </div>
        </>

      )}


      {/* ============================================
          MISMATCH
      ============================================ */}

      {receptionVerification.receptionExists &&
        !receptionVerification.allowed && (

        <>

          <div className="agent-verification-icon">
            🔴
          </div>

          <div className="agent-verification-content">

            <strong>
              Reception Mismatch
            </strong>

            <span>
              Your report does not match the numbers
              entered by Reception. Please correct
              the values below.
            </span>


            <div className="agent-reception-mismatches">

              {receptionVerification.mismatches.map(
                (item) => (

                  <div
                    className="agent-reception-mismatch"
                    key={item.field}
                  >

                    <strong>
                      {item.metric}
                    </strong>

                    <span>
                      Reception:{" "}
                      <b>{item.reception}</b>
                    </span>

                    <span>
                      You entered:{" "}
                      <b>{item.agent}</b>
                    </span>

                    <span className="agent-reception-fix">
                      Please change {item.metric} to{" "}
                      <b>{item.reception}</b>
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </>

      )}

    </div>
  )}

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