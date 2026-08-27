import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import "../styles/reception.css";

import {
  getAgents,
  getReceptionDailyCall,
  saveReceptionDailyCall,
  getReceptionCallsForDate,
  getDisposedCallReasons,
  saveDisposedCallReasons,
} from "../services/receptionDailyService";

import { saveServiceRequest } from "../services/serviceRequestService";

import { getUser } from "../services/authService";


/* =========================================
   GET LOCAL DATE
========================================= */

function getLocalDate() {

  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* =========================================
   RECEPTION DASHBOARD
========================================= */

function Reception() {

  const currentUser = getUser();


  /* =======================================
     AGENTS
  ======================================= */

  const [agents, setAgents] =
    useState([]);

  const [loadingAgents, setLoadingAgents] =
    useState(true);


  /* =======================================
     DAILY REGISTER
  ======================================= */

  const [reportDate, setReportDate] =
    useState(getLocalDate());

  const [selectedAgent, setSelectedAgent] =
    useState("");


  const [freshCalls, setFreshCalls] =
    useState(0);

  const [dcCalls, setDcCalls] =
    useState(0);

  const [cancellationCalls, setCancellationCalls] =
    useState(0);


  /* =======================================
     DISPOSED CALL COUNTS
  ======================================= */

  const [freshDisposed, setFreshDisposed] =
    useState(0);

  const [dcDisposed, setDcDisposed] =
    useState(0);

  const [cancellationDisposed, setCancellationDisposed] =
    useState(0);


  /* =======================================
     DISPOSED CALL REASONS
  ======================================= */

  const [freshDisposedReasons, setFreshDisposedReasons] =
    useState([]);

  const [dcDisposedReasons, setDcDisposedReasons] =
    useState([]);

  const [cancellationDisposedReasons, setCancellationDisposedReasons] =
    useState([]);


  const [callRemarks, setCallRemarks] =
    useState("");


  const [loadingReport, setLoadingReport] =
    useState(false);

  const [savingReport, setSavingReport] =
    useState(false);


  /* =======================================
     DAILY SUMMARY
  ======================================= */

  const [dailyRows, setDailyRows] =
    useState([]);

  const [loadingStats, setLoadingStats] =
    useState(true);


  /* =======================================
     SERVICE REQUEST
  ======================================= */

  const [source, setSource] =
    useState("Phone");

  const [callType, setCallType] =
    useState("Fresh Booking");

  const [sector, setSector] =
    useState("Ex-USA");

  const [requestedAgent, setRequestedAgent] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [savingRequest, setSavingRequest] =
    useState(false);


  /* =======================================
     CREATE REASON FIELDS
  ======================================= */

  function createReasonFields(count) {

    return Array.from(
      {
        length:
          Number(count) || 0,
      },
      () => ""
    );

  }


  /* =======================================
     LOAD AGENTS
  ======================================= */

  useEffect(() => {

    async function loadAgents() {

      try {

        setLoadingAgents(true);

        const data =
          await getAgents();

        setAgents(data || []);

        if (
          data &&
          data.length > 0 &&
          !selectedAgent
        ) {

          setSelectedAgent(
            data[0].name
          );

        }

      }

      catch (error) {

        console.error(
          "Failed to load agents:",
          error
        );

        alert(
          "Unable to load agents."
        );

      }

      finally {

        setLoadingAgents(false);

      }

    }

    loadAgents();

  }, []);


  /* =======================================
     LOAD SELECTED AGENT'S RECEPTION DATA
  ======================================= */

  useEffect(() => {

    if (
      !selectedAgent ||
      !reportDate
    ) {

      return;

    }


    async function loadAgentReport() {

      try {

        setLoadingReport(true);


        const report =
          await getReceptionDailyCall(
            selectedAgent,
            reportDate
          );


        if (!report) {

          setFreshCalls(0);

          setDcCalls(0);

          setCancellationCalls(0);

          setFreshDisposed(0);

          setDcDisposed(0);

          setCancellationDisposed(0);

          setFreshDisposedReasons([]);

          setDcDisposedReasons([]);

          setCancellationDisposedReasons([]);

          setCallRemarks("");

          return;

        }


        setFreshCalls(
          report.fresh_calls ?? 0
        );

        setDcCalls(
          report.dc_calls ?? 0
        );

        setCancellationCalls(
          report.cancellation_calls ?? 0
        );


        setFreshDisposed(
          report.fresh_disposed ?? 0
        );

        setDcDisposed(
          report.dc_disposed ?? 0
        );

        setCancellationDisposed(
          report.cancellation_disposed ?? 0
        );


        setCallRemarks(
          report.remarks ?? ""
        );


        /* -------------------------------
           LOAD INDIVIDUAL REASONS
        -------------------------------- */

        const reasons =
          await getDisposedCallReasons(
            report.id
          );


        const freshReasons =
          reasons
            .filter(
              (item) =>
                item.disposition_type ===
                "Fresh Call Disposed"
            )
            .map(
              (item) =>
                item.reason || ""
            );


        const dcReasons =
          reasons
            .filter(
              (item) =>
                item.disposition_type ===
                "DC Disposed"
            )
            .map(
              (item) =>
                item.reason || ""
            );


        const cancellationReasons =
          reasons
            .filter(
              (item) =>
                item.disposition_type ===
                "Cancellation Disposed"
            )
            .map(
              (item) =>
                item.reason || ""
            );


        setFreshDisposedReasons(
          freshReasons
        );

        setDcDisposedReasons(
          dcReasons
        );

        setCancellationDisposedReasons(
          cancellationReasons
        );

      }

      catch (error) {

        console.error(
          "Failed to load Reception report:",
          error
        );

        alert(
          "Unable to load Reception data."
        );

      }

      finally {

        setLoadingReport(false);

      }

    }


    loadAgentReport();

  }, [
    selectedAgent,
    reportDate,
  ]);


  /* =======================================
     LOAD DAILY SUMMARY
  ======================================= */

  async function loadDailyStats() {

    try {

      setLoadingStats(true);

      const rows =
        await getReceptionCallsForDate(
          reportDate
        );

      setDailyRows(
        rows || []
      );

    }

    catch (error) {

      console.error(
        "Failed to load daily Reception data:",
        error
      );

    }

    finally {

      setLoadingStats(false);

    }

  }


  useEffect(() => {

    if (reportDate) {

      loadDailyStats();

    }

  }, [reportDate]);


  /* =======================================
     DAILY TOTALS
  ======================================= */

  const totalFresh =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.fresh_calls || 0
        ),
      0
    );


  const totalDC =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.dc_calls || 0
        ),
      0
    );


  const totalCancellation =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.cancellation_calls || 0
        ),
      0
    );


  const totalFreshDisposed =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.fresh_disposed || 0
        ),
      0
    );


  const totalDCDisposed =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.dc_disposed || 0
        ),
      0
    );


  const totalCancellationDisposed =
    dailyRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.cancellation_disposed || 0
        ),
      0
    );


  const totalCalls =
    totalFresh +
    totalDC +
    totalCancellation;


  /* =======================================
     SAVE DAILY REGISTER
  ======================================= */

  async function handleSaveDailyCalls(e) {

    e.preventDefault();


    if (!selectedAgent) {

      alert(
        "Please select an agent."
      );

      return;

    }


    /* -------------------------------------
       BUILD ALL REASONS
    ------------------------------------- */

    const allDisposedReasons = [

      ...freshDisposedReasons,

      ...dcDisposedReasons,

      ...cancellationDisposedReasons,

    ];


    /* -------------------------------------
       CHECK EVERY DISPOSED CALL HAS REASON
    ------------------------------------- */

    if (
      allDisposedReasons.some(
        (reason) =>
          !reason.trim()
      )
    ) {

      alert(
        "Every disposed call must have a reason."
      );

      return;

    }


    /* -------------------------------------
       MAKE SURE COUNTS MATCH REASONS
    ------------------------------------- */

    if (
      freshDisposedReasons.length !==
      Number(freshDisposed)
    ) {

      alert(
        "Fresh Call Disposed count does not match the number of reasons."
      );

      return;

    }


    if (
      dcDisposedReasons.length !==
      Number(dcDisposed)
    ) {

      alert(
        "DC Disposed count does not match the number of reasons."
      );

      return;

    }


    if (
      cancellationDisposedReasons.length !==
      Number(cancellationDisposed)
    ) {

      alert(
        "Cancellation Disposed count does not match the number of reasons."
      );

      return;

    }


    try {

      setSavingReport(true);


      /* -----------------------------------
         SAVE MAIN DAILY RECORD
      ----------------------------------- */

      const savedReport =
        await saveReceptionDailyCall({

          report_date:
            reportDate,

          agent_name:
            selectedAgent,

          fresh_calls:
            Number(freshCalls) || 0,

          dc_calls:
            Number(dcCalls) || 0,

          cancellation_calls:
            Number(cancellationCalls) || 0,

          fresh_disposed:
            Number(freshDisposed) || 0,

          dc_disposed:
            Number(dcDisposed) || 0,

          cancellation_disposed:
            Number(
              cancellationDisposed
            ) || 0,

          remarks:
            callRemarks.trim() ||
            null,

          reception_user:
            currentUser?.id ||
            null,

        });


      /* -----------------------------------
         BUILD INDIVIDUAL DISPOSED RECORDS
      ----------------------------------- */

      const disposedReasons = [

        ...freshDisposedReasons.map(
          (reason) => ({

            disposition_type:
              "Fresh Call Disposed",

            reason:
              reason.trim(),

          })
        ),


        ...dcDisposedReasons.map(
          (reason) => ({

            disposition_type:
              "DC Disposed",

            reason:
              reason.trim(),

          })
        ),


        ...cancellationDisposedReasons.map(
          (reason) => ({

            disposition_type:
              "Cancellation Disposed",

            reason:
              reason.trim(),

          })
        ),

      ];


      /* -----------------------------------
         SAVE INDIVIDUAL REASONS
      ----------------------------------- */

      await saveDisposedCallReasons(
        savedReport.id,
        disposedReasons
      );


      alert(
        `${selectedAgent}'s Reception call data saved successfully.`
      );


      await loadDailyStats();

    }

    catch (error) {

      console.error(
        "Failed to save Reception data:",
        error
      );

      alert(
        error?.message ||
        "Failed to save Reception data."
      );

    }

    finally {

      setSavingReport(false);

    }

  }


  /* =======================================
     FRESH DISPOSED CHANGE
  ======================================= */

  function handleFreshDisposedChange(e) {

    const value =
      Math.max(
        0,
        Number(e.target.value) || 0
      );


    setFreshDisposed(value);


    setFreshDisposedReasons(
      createReasonFields(value)
    );

  }


  /* =======================================
     DC DISPOSED CHANGE
  ======================================= */

  function handleDcDisposedChange(e) {

    const value =
      Math.max(
        0,
        Number(e.target.value) || 0
      );


    setDcDisposed(value);


    setDcDisposedReasons(
      createReasonFields(value)
    );

  }


  /* =======================================
     CANCELLATION DISPOSED CHANGE
  ======================================= */

  function handleCancellationDisposedChange(e) {

    const value =
      Math.max(
        0,
        Number(e.target.value) || 0
      );


    setCancellationDisposed(value);


    setCancellationDisposedReasons(
      createReasonFields(value)
    );

  }


  /* =======================================
     SERVICE REQUEST SAVE
  ======================================= */

  async function handleSaveServiceRequest(e) {

    e.preventDefault();


    try {

      setSavingRequest(true);


      await saveServiceRequest({

        source,

        request_type:
          callType,

        travel_type:
          sector,

        requested_agent:
          requestedAgent.trim() ||
          null,

        remarks:
          remarks.trim() ||
          null,

        reception_user:
          currentUser?.id ||
          null,

      });


      alert(
        "Service Request Saved Successfully!"
      );


      setSource("Phone");

      setCallType(
        "Fresh Booking"
      );

      setSector("Ex-USA");

      setRequestedAgent("");

      setRemarks("");

    }

    catch (error) {

      console.error(
        "Service Request Error:",
        error
      );

      alert(
        error?.message ||
        "Error saving service request."
      );

    }

    finally {

      setSavingRequest(false);

    }

  }


  /* =======================================
     STAT CARD
  ======================================= */

  function StatCard({
    title,
    value,
    disposed = false,
  }) {

    return (

      <div
        className={
          disposed
            ? "reception-stat-card disposed-card"
            : "reception-stat-card"
        }
      >

        <div className="reception-stat-title">
          {title}
        </div>

        <div className="reception-stat-value">

          {loadingStats
            ? "..."
            : value}

        </div>

      </div>

    );

  }


  /* =======================================
     PAGE
  ======================================= */

  return (

    <Layout title="Reception Dashboard">

      <div className="reception-page">


        {/* =================================
            HEADER
        ================================= */}

        <div className="reception-heading">

          <div>

            

            

            <div>

            </div>

            <p>
              Daily call registration and
              service request management
            </p>

          </div>


          <div className="reception-date">

            {new Intl.DateTimeFormat(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            ).format(
              new Date()
            )}

          </div>

        </div>


        {/* =================================
            DAILY SUMMARY
        ================================= */}

        <section className="reception-section">

          <div className="section-heading">

            <div>

              <h2>
                Daily Call Summary
              </h2>

              <p>
                Reception-confirmed calls
                for {reportDate}
              </p>

            </div>


            <input
              type="date"
              value={reportDate}
              onChange={(e) =>
                setReportDate(
                  e.target.value
                )
              }
              className="report-date-input"
            />

          </div>


          <div className="reception-stats-grid">

            <StatCard
              title="Total Calls"
              value={totalCalls}
            />

            <StatCard
              title="Fresh Calls"
              value={totalFresh}
            />

            <StatCard
              title="DC Calls"
              value={totalDC}
            />

            <StatCard
              title="Cancellation Calls"
              value={totalCancellation}
            />

          </div>

        </section>


        {/* =================================
            DISPOSED SUMMARY
        ================================= */}

        <section className="reception-section">

          <div className="section-heading">

            <div>

              <h2>
                Disposed Calls
              </h2>

              <p>
                Calls not counted as
                actionable agent workload
              </p>

            </div>

          </div>


          <div className="reception-stats-grid disposed-grid">

            <StatCard
              title="Fresh Call Disposed"
              value={
                totalFreshDisposed
              }
              disposed
            />

            <StatCard
              title="DC Disposed"
              value={
                totalDCDisposed
              }
              disposed
            />

            <StatCard
              title="Cancellation Disposed"
              value={
                totalCancellationDisposed
              }
              disposed
            />

          </div>

        </section>


        {/* =================================
            AGENT DAILY CALL REGISTER
        ================================= */}

        <section className="reception-form-section">

          <div className="section-heading">

            <div>

              <h2>
                Agent Daily Call Register
              </h2>

              <p>
                Enter the official Reception
                call counts for each agent
              </p>

            </div>

          </div>


          <form
            className="reception-form"
            onSubmit={
              handleSaveDailyCalls
            }
          >


            {/* DATE */}

            <div className="form-group">

              <label>
                Report Date
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) =>
                  setReportDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* AGENT */}

            <div className="form-group">

              <label>
                Agent
              </label>

              <select
                value={selectedAgent}
                onChange={(e) =>
                  setSelectedAgent(
                    e.target.value
                  )
                }
                disabled={
                  loadingAgents
                }
                required
              >

                <option value="">
                  {loadingAgents
                    ? "Loading agents..."
                    : "Select Agent"}
                </option>

                {agents.map(
                  (agent) => (

                    <option
                      key={agent.id}
                      value={agent.name}
                    >
                      {agent.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* =================================
                ACTIONABLE CALLS
            ================================== */}

            <div className="form-section-title">

              Actionable Calls

            </div>


            {/* FRESH */}

            <div className="form-group">

              <label>
                Fresh Calls
              </label>

              <input
                type="number"
                min="0"
                value={freshCalls}
                onChange={(e) =>
                  setFreshCalls(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* DC */}

            <div className="form-group">

              <label>
                DC Calls
              </label>

              <input
                type="number"
                min="0"
                value={dcCalls}
                onChange={(e) =>
                  setDcCalls(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* CANCELLATION */}

            <div className="form-group">

              <label>
                Cancellation Calls
              </label>

              <input
                type="number"
                min="0"
                value={
                  cancellationCalls
                }
                onChange={(e) =>
                  setCancellationCalls(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================
                DISPOSED CALLS
            ================================== */}

            <div className="form-section-title disposed-title">

              Disposed Calls

            </div>


            {/* FRESH DISPOSED */}

            <div className="form-group">

              <label>
                Fresh Call Disposed
              </label>

              <input
                type="number"
                min="0"
                value={
                  freshDisposed
                }
                onChange={
                  handleFreshDisposedChange
                }
                required
              />

            </div>


            {/* DC DISPOSED */}

            <div className="form-group">

              <label>
                DC Disposed
              </label>

              <input
                type="number"
                min="0"
                value={
                  dcDisposed
                }
                onChange={
                  handleDcDisposedChange
                }
                required
              />

            </div>


            {/* CANCELLATION DISPOSED */}

            <div className="form-group">

              <label>
                Cancellation Disposed
              </label>

              <input
                type="number"
                min="0"
                value={
                  cancellationDisposed
                }
                onChange={
                  handleCancellationDisposedChange
                }
                required
              />

            </div>


            {/* =================================
                FRESH REASONS
            ================================== */}

            {freshDisposedReasons.length > 0 && (

              <div className="disposed-reasons-group">

                <h3>
                  Fresh Call Disposed Reasons
                </h3>


                {freshDisposedReasons.map(
                  (reason, index) => (

                    <div
                      className="disposed-reason-row"
                      key={`fresh-${index}`}
                    >

                      <label>
                        Fresh Call Disposed #
                        {index + 1}
                      </label>

                      <textarea
                        rows="2"
                        value={reason}
                        placeholder={
                          `Reason for Fresh Call Disposed #${index + 1}`
                        }
                        onChange={(e) => {

                          const updated = [
                            ...freshDisposedReasons,
                          ];

                          updated[index] =
                            e.target.value;

                          setFreshDisposedReasons(
                            updated
                          );

                        }}
                        required
                      />

                    </div>

                  )
                )}

              </div>

            )}


            {/* =================================
                DC REASONS
            ================================== */}

            {dcDisposedReasons.length > 0 && (

              <div className="disposed-reasons-group">

                <h3>
                  DC Disposed Reasons
                </h3>


                {dcDisposedReasons.map(
                  (reason, index) => (

                    <div
                      className="disposed-reason-row"
                      key={`dc-${index}`}
                    >

                      <label>
                        DC Disposed #
                        {index + 1}
                      </label>

                      <textarea
                        rows="2"
                        value={reason}
                        placeholder={
                          `Reason for DC Disposed #${index + 1}`
                        }
                        onChange={(e) => {

                          const updated = [
                            ...dcDisposedReasons,
                          ];

                          updated[index] =
                            e.target.value;

                          setDcDisposedReasons(
                            updated
                          );

                        }}
                        required
                      />

                    </div>

                  )
                )}

              </div>

            )}


            {/* =================================
                CANCELLATION REASONS
            ================================== */}

            {cancellationDisposedReasons.length > 0 && (

              <div className="disposed-reasons-group">

                <h3>
                  Cancellation Disposed Reasons
                </h3>


                {cancellationDisposedReasons.map(
                  (reason, index) => (

                    <div
                      className="disposed-reason-row"
                      key={`cancellation-${index}`}
                    >

                      <label>
                        Cancellation Disposed #
                        {index + 1}
                      </label>

                      <textarea
                        rows="2"
                        value={reason}
                        placeholder={
                          `Reason for Cancellation Disposed #${index + 1}`
                        }
                        onChange={(e) => {

                          const updated = [
                            ...cancellationDisposedReasons,
                          ];

                          updated[index] =
                            e.target.value;

                          setCancellationDisposedReasons(
                            updated
                          );

                        }}
                        required
                      />

                    </div>

                  )
                )}

              </div>

            )}


            {/* =================================
                GENERAL REMARKS
            ================================== */}

            <div className="form-group full-width">

              <label>
                General Remarks
              </label>

              <textarea
                rows="4"
                placeholder="Additional notes about the day's activity..."
                value={callRemarks}
                onChange={(e) =>
                  setCallRemarks(
                    e.target.value
                  )
                }
              />

            </div>


            {/* =================================
                SAVE
            ================================== */}

            <div className="form-actions">

              <button
                type="submit"
                className="save-btn"
                disabled={
                  savingReport ||
                  loadingReport
                }
              >

                {savingReport
                  ? "Saving..."
                  : loadingReport
                  ? "Loading..."
                  : "Save Call Data"}

              </button>

            </div>

          </form>

        </section>


        {/* =================================
            EXISTING SERVICE REQUEST
        ================================= */}

        <section className="reception-form-section">

          <div className="section-heading">

            <div>

              <h2>
                Create Service Request
              </h2>

              <p>
                Separate from the daily
                agent call register
              </p>

            </div>

          </div>


          <form
            className="reception-form"
            onSubmit={
              handleSaveServiceRequest
            }
          >


            {/* SOURCE */}

            <div className="form-group">

              <label>
                Source
              </label>

              <select
                value={source}
                onChange={(e) =>
                  setSource(
                    e.target.value
                  )
                }
              >

                <option value="Phone">
                  Phone
                </option>

                <option value="Email">
                  Email
                </option>

              </select>

            </div>


            {/* REQUEST TYPE */}

            <div className="form-group">

              <label>
                Request Type
              </label>

              <select
                value={callType}
                onChange={(e) =>
                  setCallType(
                    e.target.value
                  )
                }
              >

                <option value="Fresh Booking">
                  Fresh Booking
                </option>

                <option value="Name Call">
                  Name Call
                </option>

                <option value="MAC Call">
                  MAC Call
                </option>

                <option value="Date Change">
                  Date Change
                </option>

                <option value="Cancellation">
                  Cancellation
                </option>

                <option value="Schedule Change">
                  Schedule Change
                </option>

                <option value="Fare Quote">
                  Fare Quote
                </option>

                <option value="Itinerary Request">
                  Itinerary Request
                </option>

              </select>

            </div>


            {/* TRAVEL TYPE */}

            <div className="form-group">

              <label>
                Travel Type
              </label>

              <select
                value={sector}
                onChange={(e) =>
                  setSector(
                    e.target.value
                  )
                }
              >

                <option value="Ex-USA">
                  Ex-USA
                </option>

                <option value="Ex-India">
                  Ex-India
                </option>

              </select>

            </div>


            {/* REQUESTED AGENT */}

            <div className="form-group">

              <label>
                Requested Agent
              </label>

              <input
                type="text"
                placeholder="Enter agent name"
                value={
                  requestedAgent
                }
                onChange={(e) =>
                  setRequestedAgent(
                    e.target.value
                  )
                }
              />

            </div>


            {/* SERVICE REMARKS */}

            <div className="form-group full-width">

              <label>
                Remarks
              </label>

              <textarea
                rows="4"
                placeholder="Add relevant service request remarks..."
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
              />

            </div>


            {/* SAVE SERVICE REQUEST */}

            <div className="form-actions">

              <button
                type="submit"
                className="save-btn"
                disabled={
                  savingRequest
                }
              >

                {savingRequest
                  ? "Saving..."
                  : "Save Service Request"}

              </button>

            </div>

          </form>

        </section>


      </div>

    </Layout>

  );

}


export default Reception;