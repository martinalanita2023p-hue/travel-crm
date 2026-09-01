import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import "../styles/reception.css";

import {
  getAgents,
  getReceptionCallsForDate,
  saveReceptionDailyCall,
} from "../services/receptionDailyService";

import { getUser } from "../services/authService";


/* =====================================================
   EASTERN / BOSTON DATE
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
   EMPTY ROW
===================================================== */

function createEmptyRow(agent) {

  return {

    agent_id:
      agent.id,

    agent_name:
      agent.name,

    fresh_calls: 0,

    dc_calls: 0,

    cancellation_calls: 0,

    fresh_disposed: 0,

    dc_disposed: 0,

    cancellation_disposed: 0,

    remarks: "",

    reception_record_id: null,

    dirty: false,

  };

}


/* =====================================================
   RECEPTION PAGE
===================================================== */

function Reception() {

  const currentUser =
    getUser();


  /* ===================================================
     DATE
  =================================================== */

  const [reportDate, setReportDate] =
    useState(
      getEasternDate()
    );


  /* ===================================================
     AGENTS
  =================================================== */

  const [agents, setAgents] =
    useState([]);

  const [loadingAgents, setLoadingAgents] =
    useState(true);


  /* ===================================================
     GRID DATA
  =================================================== */

  const [rows, setRows] =
    useState([]);

  const [loadingRows, setLoadingRows] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  /* ===================================================
     SEARCH
  =================================================== */

  const [search, setSearch] =
    useState("");


  /* ===================================================
     LOAD AGENTS
  =================================================== */

  useEffect(() => {

    async function loadAgents() {

      try {

        setLoadingAgents(true);

        const data =
          await getAgents();

        setAgents(
          data || []
        );

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


  /* ===================================================
     LOAD RECEPTION DATA FOR SELECTED DATE
  =================================================== */

  useEffect(() => {

    async function loadRows() {

      if (
        !agents ||
        agents.length === 0
      ) {

        return;

      }


      try {

        setLoadingRows(true);


        const existing =
          await getReceptionCallsForDate(
            reportDate
          );


        const existingMap =
          new Map();


        (existing || []).forEach(
          (record) => {

            existingMap.set(
              record.agent_name
                ?.trim()
                .toLowerCase(),

              record
            );

          }
        );


        const newRows =
          agents.map(
            (agent) => {

              const record =
                existingMap.get(
                  agent.name
                    ?.trim()
                    .toLowerCase()
                );


              if (!record) {

                return createEmptyRow(
                  agent
                );

              }


              return {

                agent_id:
                  agent.id,

                agent_name:
                  agent.name,

                fresh_calls:
                  record.fresh_calls ?? 0,

                dc_calls:
                  record.dc_calls ?? 0,

                cancellation_calls:
                  record.cancellation_calls ?? 0,

                fresh_disposed:
                  record.fresh_disposed ?? 0,

                dc_disposed:
                  record.dc_disposed ?? 0,

                cancellation_disposed:
                  record.cancellation_disposed ?? 0,

                remarks:
                  record.remarks ?? "",

                reception_record_id:
                  record.id,

                dirty: false,

              };

            }
          );


        setRows(
          newRows
        );

      }

      catch (error) {

        console.error(
          "Failed to load Reception daily data:",
          error
        );

        alert(
          "Unable to load the Reception call register."
        );

      }

      finally {

        setLoadingRows(false);

      }

    }


    loadRows();

  }, [
    agents,
    reportDate,
  ]);


  /* ===================================================
     UPDATE CELL
  =================================================== */

  function updateCell(
    agentName,
    field,
    value
  ) {

    setRows(
      (currentRows) =>

        currentRows.map(
          (row) => {

            if (
              row.agent_name !==
              agentName
            ) {

              return row;

            }


            let finalValue =
              value;


            if (
              field !== "remarks"
            ) {

              finalValue =
                Math.max(
                  0,
                  Number(value) || 0
                );

            }


            return {

              ...row,

              [field]:
                finalValue,

              dirty: true,

            };

          }
        )
    );

  }


  /* ===================================================
     SAVE ALL
  =================================================== */

  async function handleSaveAll() {

    const changedRows =
      rows.filter(
        (row) => row.dirty
      );


    if (
      changedRows.length === 0
    ) {

      alert(
        "There are no changes to save."
      );

      return;

    }


    /* -----------------------------------------------
       CHECK DISPOSED REMARKS
    ----------------------------------------------- */

    for (
      const row of changedRows
    ) {

      const disposedTotal =
        Number(
          row.fresh_disposed || 0
        ) +

        Number(
          row.dc_disposed || 0
        ) +

        Number(
          row.cancellation_disposed ||
          0
        );


      if (
        disposedTotal > 0 &&
        !row.remarks?.trim()
      ) {

        alert(
          `Remarks are required for disposed calls for ${row.agent_name}.`
        );

        return;

      }

    }


    try {

      setSaving(true);


      for (
        const row of changedRows
      ) {

        await saveReceptionDailyCall({

          report_date:
            reportDate,

          agent_name:
            row.agent_name,

          fresh_calls:
            Number(
              row.fresh_calls || 0
            ),

          dc_calls:
            Number(
              row.dc_calls || 0
            ),

          cancellation_calls:
            Number(
              row.cancellation_calls || 0
            ),

          fresh_disposed:
            Number(
              row.fresh_disposed || 0
            ),

          dc_disposed:
            Number(
              row.dc_disposed || 0
            ),

          cancellation_disposed:
            Number(
              row.cancellation_disposed ||
              0
            ),

          remarks:
            row.remarks?.trim() ||
            null,

          reception_user:
            currentUser?.id ||
            null,

        });

      }


      setRows(
        (currentRows) =>
          currentRows.map(
            (row) => ({
              ...row,
              dirty: false,
            })
          )
      );


      alert(
        "Reception call data saved successfully."
      );

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

      setSaving(false);

    }

  }


  /* ===================================================
     FILTER ROWS
  =================================================== */

  const filteredRows =
    rows.filter(
      (row) =>
        row.agent_name
          ?.toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          )
    );


  /* ===================================================
     SUMMARY TOTALS
  =================================================== */

  const totals =
    rows.reduce(
      (total, row) => {

        total.fresh +=
          Number(
            row.fresh_calls || 0
          );

        total.dc +=
          Number(
            row.dc_calls || 0
          );

        total.cancellation +=
          Number(
            row.cancellation_calls ||
            0
          );

        total.freshDisposed +=
          Number(
            row.fresh_disposed || 0
          );

        total.dcDisposed +=
          Number(
            row.dc_disposed || 0
          );

        total.cancellationDisposed +=
          Number(
            row.cancellation_disposed ||
            0
          );

        return total;

      },
      {
        fresh: 0,
        dc: 0,
        cancellation: 0,
        freshDisposed: 0,
        dcDisposed: 0,
        cancellationDisposed: 0,
      }
    );


  const totalCalls =
    totals.fresh +
    totals.dc +
    totals.cancellation;


  /* ===================================================
     PAGE
  =================================================== */

  return (

    <Layout title="Reception Dashboard">

      <div className="reception-page">


        {/* =============================================
            HEADER
        ============================================== */}

        <div className="reception-heading">

          <div>

            <h1>
              Reception Dashboard
            </h1>

            <p>
              Daily call register
            </p>

          </div>


          <div className="reception-date">

            {new Intl.DateTimeFormat(
              "en-US",
              {
                timeZone:
                  "America/New_York",

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


        {/* =============================================
            CONTROLS
        ============================================== */}

        <section className="reception-register-controls">

          <div className="reception-control-group">

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
            />

          </div>


          <div className="reception-control-group search-control">

            <label>
              Search Agent
            </label>

            <input
              type="text"
              placeholder="Search agent..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="save-all-btn"
            onClick={handleSaveAll}
            disabled={
              saving ||
              loadingRows
            }
          >

            {saving
              ? "Saving..."
              : "Save All Changes"}

          </button>

        </section>


        {/* =============================================
            SUMMARY
        ============================================== */}

        <section className="reception-summary-grid">

          <div className="reception-summary-card">

            <span>
              Total Calls
            </span>

            <strong>
              {totalCalls}
            </strong>

          </div>


          <div className="reception-summary-card">

            <span>
              Fresh Calls
            </span>

            <strong>
              {totals.fresh}
            </strong>

          </div>


          <div className="reception-summary-card">

            <span>
              DC Calls
            </span>

            <strong>
              {totals.dc}
            </strong>

          </div>


          <div className="reception-summary-card">

            <span>
              Cancellation Calls
            </span>

            <strong>
              {totals.cancellation}
            </strong>

          </div>

        </section>


        {/* =============================================
            MAIN REGISTER
        ============================================== */}

        <section className="reception-register">

          <div className="reception-register-header">

            <div>

              <h2>
                Agent Daily Call Register
              </h2>

              <p>
                {reportDate}
              </p>

            </div>

          </div>


          {loadingAgents ||
          loadingRows ? (

            <div className="reception-register-loading">

              Loading call register...

            </div>

          ) : (

            <div className="reception-table-wrapper">

              <table className="reception-table">

                <thead>

                  <tr>

                    <th>
                      Agent
                    </th>

                    <th>
                      Fresh Calls
                    </th>

                    <th>
                      DC Calls
                    </th>

                    <th>
                      Cancellation
                    </th>

                    <th>
                      Fresh Disposed
                    </th>

                    <th>
                      DC Disposed
                    </th>

                    <th>
                      Cancellation Disposed
                    </th>

                    <th>
                      Remarks
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRows.map(
                    (row) => (

                      <tr
                        key={row.agent_id}
                        className={
                          row.dirty
                            ? "row-dirty"
                            : ""
                        }
                      >

                        {/* AGENT */}

                        <td className="agent-name-cell">

                          {row.agent_name}

                        </td>


                        {/* FRESH */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.fresh_calls
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "fresh_calls",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* DC */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.dc_calls
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "dc_calls",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* CANCELLATION */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.cancellation_calls
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "cancellation_calls",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* FRESH DISPOSED */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.fresh_disposed
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "fresh_disposed",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* DC DISPOSED */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.dc_disposed
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "dc_disposed",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* CANCELLATION DISPOSED */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={
                              row.cancellation_disposed
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "cancellation_disposed",
                                e.target.value
                              )
                            }
                          />

                        </td>


                        {/* REMARKS */}

                        <td>

                          <input
                            type="text"
                            className="table-remarks-input"
                            placeholder="Reason / remarks"
                            value={
                              row.remarks
                            }
                            onChange={(e) =>
                              updateCell(
                                row.agent_name,
                                "remarks",
                                e.target.value
                              )
                            }
                          />

                        </td>

                      </tr>

                    )
                  )}


                  {filteredRows.length === 0 && (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-register"
                      >
                        No agents found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =============================================
            DISPOSED SUMMARY
        ============================================== */}

        <section className="reception-disposed-summary">

          <h2>
            Disposed Calls Summary
          </h2>


          <div className="reception-disposed-grid">

            <div>

              <span>
                Fresh Call Disposed
              </span>

              <strong>
                {totals.freshDisposed}
              </strong>

            </div>


            <div>

              <span>
                DC Disposed
              </span>

              <strong>
                {totals.dcDisposed}
              </strong>

            </div>


            <div>

              <span>
                Cancellation Disposed
              </span>

              <strong>
                {totals.cancellationDisposed}
              </strong>

            </div>

          </div>

        </section>


      </div>

    </Layout>

  );

}


export default Reception;