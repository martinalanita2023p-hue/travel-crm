import { useEffect, useMemo, useState } from "react";

import { importReceptionExcel } from "../services/receptionExcelImporter";

import Layout from "../components/Layout";

import "../styles/reception.css";

import {
  getAgents,
  getReceptionCallsForDate,
  saveReceptionDailyCall,
} from "../services/receptionDailyService";

import { getUser } from "../services/authService";

import { getBostonDate } from "../utils/bostonTime";


/* =========================================================
   CREATE EMPTY ROW
========================================================= */

function createEmptyRow(agent) {
  return {
    agent_id: agent.id,
    agent_name: agent.name,

    dc: 0,
    ex_ind: 0,
    ex_usa: 0,
    maccall: 0,
    managercall: 0,
    namecall: 0,
    sc: 0,

    cancellation_calls: "",

    grand_total: 0,

    reception_record_id: null,

    dirty: false,
  };
}


/* =========================================================
   NUMBER HELPER
========================================================= */

function number(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


/* =========================================================
   GRAND TOTAL
========================================================= */

function calculateGrandTotal(row) {
  return (
    number(row.dc) +
    number(row.ex_ind) +
    number(row.ex_usa) +
    number(row.maccall) +
    number(row.managercall) +
    number(row.namecall) +
    number(row.sc) +
    number(row.cancellation_calls)
  );
}


/* =========================================================
   RECEPTION PAGE
========================================================= */

function Reception() {
  const currentUser = getUser();


  /* =======================================================
     REPORT DATE
  ======================================================= */

  const [reportDate, setReportDate] =
    useState(getBostonDate());


  /* =======================================================
     AGENTS
  ======================================================= */

  const [agents, setAgents] =
    useState([]);

  const [loadingAgents, setLoadingAgents] =
    useState(true);


  /* =======================================================
     RECEPTION ROWS
  ======================================================= */

  const [rows, setRows] =
    useState([]);

  const [loadingRows, setLoadingRows] =
    useState(true);


  /* =======================================================
     SAVE
  ======================================================= */

  const [saving, setSaving] =
    useState(false);


  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");


  /* =======================================================
     EXCEL IMPORT
  ======================================================= */

  const [importFile, setImportFile] =
    useState(null);

  const [importPreview, setImportPreview] =
    useState(null);

  const [importLoading, setImportLoading] =
    useState(false);

  const [importError, setImportError] =
    useState("");


  /* =======================================================
     LOAD AGENTS
  ======================================================= */

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoadingAgents(true);

        const data =
          await getAgents();

        setAgents(data || []);
      } catch (error) {
        console.error(
          "Failed to load agents:",
          error
        );

        alert(
          "Unable to load agents."
        );
      } finally {
        setLoadingAgents(false);
      }
    }

    loadAgents();
  }, []);


  /* =======================================================
     LOAD RECEPTION DATA
  ======================================================= */

  useEffect(() => {
    async function loadRows() {
      if (!agents.length) {
        setRows([]);
        setLoadingRows(false);
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
          agents.map((agent) => {
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

              dc:
                record.dc ?? 0,

              ex_ind:
                record.ex_ind ?? 0,

              ex_usa:
                record.ex_usa ?? 0,

              maccall:
                record.maccall ?? 0,

              managercall:
                record.managercall ?? 0,

              namecall:
                record.namecall ?? 0,

              sc:
                record.sc ?? 0,

              cancellation_calls:
                record.cancellation_calls ?? "",

              grand_total:
                record.grand_total ?? 0,

              reception_record_id:
                record.id,

              dirty: false,
            };
          });


        setRows(newRows);

      } catch (error) {
        console.error(
          "Failed to load Reception data:",
          error
        );

        alert(
          "Unable to load the Reception call register."
        );
      } finally {
        setLoadingRows(false);
      }
    }

    loadRows();
  }, [
    agents,
    reportDate,
  ]);


  /* =======================================================
     UPDATE CELL
  ======================================================= */

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
              field !== "agent_name"
            ) {
              finalValue =
                Math.max(
                  0,
                  number(value)
                );
            }

            const updatedRow = {
              ...row,

              [field]:
                finalValue,

              dirty: true,
            };

            if (field !== "agent_name") {
              updatedRow.grand_total =
                calculateGrandTotal(
                  updatedRow
                );
            }

            return updatedRow;
          }
        )
    );
  }


  /* =======================================================
     EXCEL IMPORT
  ======================================================= */

  async function handleReceptionImport(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setImportFile(file);

    setImportPreview(null);

    setImportError("");

    setImportLoading(true);

    try {
      const fileName =
        file.name
          ?.toLowerCase() || "";

      const isImage =
        file.type?.startsWith(
          "image/"
        ) ||
        /\.(png|jpg|jpeg|webp)$/i.test(
          fileName
        );


      /* ===================================================
         SCREENSHOT
      =================================================== */

      if (isImage) {
        setImportError(
          "Screenshot selected. Screenshot extraction is not connected yet. Please upload the Excel file."
        );

        return;
      }


      /* ===================================================
         EXCEL / CSV
      =================================================== */

      const result =
        await importReceptionExcel(
          file
        );


      setImportPreview(
        result
      );


      /* ===================================================
         BUILD IMPORT LOOKUP
      =================================================== */

      const importedMap =
        new Map();


      (result.rows || []).forEach(
        (row) => {
          const key =
            row.agent_name
              ?.trim()
              .toLowerCase();

          if (!key) return;

          importedMap.set(
            key,
            row
          );
        }
      );


      /* ===================================================
         POPULATE ACTUAL REGISTER
      =================================================== */

      setRows(
        (currentRows) =>
          currentRows.map(
            (existingRow) => {
              const key =
                existingRow.agent_name
                  ?.trim()
                  .toLowerCase();

              const imported =
                importedMap.get(
                  key
                );

              if (!imported) {
                return existingRow;
              }


              return {
                ...existingRow,

                dc:
                  number(
                    imported.dc
                  ),

                ex_ind:
                  number(
                    imported.ex_ind
                  ),

                ex_usa:
                  number(
                    imported.ex_usa
                  ),

                maccall:
                  number(
                    imported.maccall
                  ),

                managercall:
                  number(
                    imported.managercall
                  ),

                namecall:
                  number(
                    imported.namecall
                  ),

                sc:
                  number(
                    imported.sc ??
                    imported.schedule_change
                  ),

                cancellation_calls:
                  imported.cancellation_calls ??
                  "",

                grand_total:
                  calculateGrandTotal({
                    dc: imported.dc,
                    ex_ind: imported.ex_ind,
                    ex_usa: imported.ex_usa,
                    maccall: imported.maccall,
                    managercall: imported.managercall,
                    namecall: imported.namecall,
                    sc:
                      imported.sc ??
                      imported.schedule_change,
                    cancellation_calls:
                      imported.cancellation_calls ??
                      "",
                  }),

                dirty: true,
              };
            }
          )
      );

    } catch (error) {
      console.error(
        "Reception import failed:",
        error
      );

      setImportError(
        error?.message ||
          "Unable to read the uploaded file."
      );
    } finally {
      setImportLoading(false);

      event.target.value = "";
    }
  }


  /* =======================================================
     SAVE ALL
  ======================================================= */

  async function handleSaveAll() {
    const dirtyRows =
      rows.filter(
        (row) =>
          row.dirty
      );

    if (
      dirtyRows.length === 0
    ) {
      alert(
        "There are no changes to save."
      );

      return;
    }


    try {
      setSaving(true);


      for (
        const row of dirtyRows
      ) {
        await saveReceptionDailyCall(
          {
            report_date:
              reportDate,

            agent_name:
              row.agent_name,

            dc:
              number(row.dc),

            ex_ind:
              number(row.ex_ind),

            ex_usa:
              number(row.ex_usa),

            maccall:
              number(row.maccall),

            managercall:
              number(row.managercall),

            namecall:
              number(row.namecall),

            sc:
              number(row.sc),

            cancellation_calls:
              row.cancellation_calls === ""
                ? 0
                : number(
                    row.cancellation_calls
                  ),

            grand_total:
              calculateGrandTotal(
                row
              ),

            reception_user:
              currentUser?.name ||
              currentUser?.username ||
              null,
          }
        );
      }


      /* ===================================================
         MARK SAVED
      =================================================== */

      setRows(
        (currentRows) =>
          currentRows.map(
            (row) => ({
              ...row,
              dirty: false,
            })
          )
      );


      /* ===================================================
         REMOVE IMPORT PREVIEW
         Preview is reference-only.
      =================================================== */

      setImportPreview(null);

      setImportFile(null);


      alert(
        "Reception call data saved successfully."
      );

    } catch (error) {
      console.error(
        "Failed to save Reception data:",
        error
      );

      alert(
        error?.message ||
          "Failed to save Reception data."
      );
    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     FILTER ROWS
  ======================================================= */

  const filteredRows =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return rows;
      }

      return rows.filter(
        (row) =>
          row.agent_name
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      rows,
      search,
    ]);


  /* =======================================================
     TOTALS
  ======================================================= */

  const totals =
    useMemo(() => {
      return rows.reduce(
        (total, row) => {
          total.dc +=
            number(row.dc);

          total.ex_ind +=
            number(row.ex_ind);

          total.ex_usa +=
            number(row.ex_usa);

          total.maccall +=
            number(row.maccall);

          total.managercall +=
            number(
              row.managercall
            );

          total.namecall +=
            number(
              row.namecall
            );

          total.sc +=
            number(row.sc);

          total.cancellation_calls +=
            number(
              row.cancellation_calls
            );

          total.grand_total +=
            number(
              row.grand_total
            );

          return total;
        },
        {
          dc: 0,
          ex_ind: 0,
          ex_usa: 0,
          maccall: 0,
          managercall: 0,
          namecall: 0,
          sc: 0,
          cancellation_calls: 0,
          grand_total: 0,
        }
      );
    }, [
      rows,
    ]);


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <Layout title="Reception Dashboard">

      <div className="reception-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="reception-hero">

          <div>

            <span className="reception-eyebrow">
              OPERATIONS
            </span>

            <p>
              Daily panel call register
              and tracking
            </p>

          </div>


          <div className="reception-date-card">

            <span>
              REPORT DATE
            </span>

            <strong>
              {new Intl.DateTimeFormat(
                "en-US",
                {
                  timeZone:
                    "America/New_York",

                  weekday:
                    "short",

                  month:
                    "short",

                  day:
                    "numeric",

                  year:
                    "numeric",
                }
              ).format(
                new Date(
                  reportDate +
                    "T12:00:00"
                )
              )}
            </strong>

          </div>

        </section>


        {/* =================================================
            IMPORT
        ================================================= */}

        <section className="reception-import-card">

          <div className="reception-import-header">

            <div>

              <p className="reception-import-eyebrow">
                RECEPTION DATA IMPORT
              </p>

              <h2>
                📥 Import Reception Call Data
              </h2>

              <p>
                Upload the daily Reception
                Excel file, CSV, or screenshot.
              </p>

            </div>


            <label
              className="reception-import-button"
            >

              {importLoading
                ? "Reading File..."
                : "Choose File"}

              <input
                type="file"
                accept=".xlsx,.xls,.csv,image/png,image/jpeg,image/jpg,image/webp"
                onChange={
                  handleReceptionImport
                }
                hidden
              />

            </label>

          </div>


          {/* =================================================
              FILE
          ================================================= */}

          {importFile && (

            <div className="reception-import-file">

              <span>
                📊
              </span>

              <div>

                <strong>
                  {importFile.name}
                </strong>

                <small>
                  {(
                    importFile.size /
                    1024
                  ).toFixed(1)}
                  {" KB"}
                </small>

              </div>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {importError && (

            <div className="reception-import-error">
              {importError}
            </div>

          )}


          {/* =================================================
              IMPORT PREVIEW
          ================================================= */}

          {importPreview && (

            <div className="reception-import-preview">

              <div className="reception-import-preview-header">

                <div>

                  <h3>
                    Import Preview
                  </h3>

                  <p>
                    {
                      importPreview.rows
                        ?.length || 0
                    }{" "}
                    agents found
                  </p>

                </div>

              </div>


              <div className="reception-import-table-wrapper">

                <table className="reception-import-table">

                  <thead>

                    <tr>

                      <th>
                        Agent
                      </th>

                      <th>
                        DC
                      </th>

                      <th>
                        EX.IND
                      </th>

                      <th>
                        EX.USA
                      </th>

                      <th>
                        MACCALL
                      </th>

                      <th>
                        MANAGERCALL
                      </th>

                      <th>
                        NAMECALL
                      </th>

                      <th>
                        SC
                      </th>

                      <th>
                        Grand Total
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {(importPreview.rows ||
                      []).map(
                      (row, index) => (

                        <tr
                          key={
                            `${row.agent_name}-${index}`
                          }
                        >

                          <td>
                            <strong>
                              {
                                row.agent_name
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              number(
                                row.dc
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.ex_ind
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.ex_usa
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.maccall
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.managercall
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.namecall
                              )
                            }
                          </td>

                          <td>
                            {
                              number(
                                row.sc ??
                                row.schedule_change
                              )
                            }
                          </td>

                          <td>
                            <strong>
                              {
                                number(
                                  row.grand_total
                                )
                              }
                            </strong>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              <div className="reception-import-note">

                <span>
                  ℹ️
                </span>

                <p>
                  <strong>
                    Reference only.
                  </strong>{" "}
                  The imported numbers have
                  been placed into the Daily
                  Register below. They are
                  not saved until you click
                  Save All Changes.
                </p>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            DAILY REGISTER
        ================================================= */}

       



        <section className="reception-register">

          <div className="reception-register-top">

            <div>

              <span className="section-label">
                DAILY REGISTER
              </span>

              <h2>
                Reception Call Register
              </h2>

              <p>
                Review and edit the imported
                Reception call numbers.
              </p>

            </div>


            <div className="register-status">

              <span className="status-dot" />

              {rows.some(
                (row) =>
                  row.dirty
              )
                ? "Unsaved Changes"
                : "Saved"}

            </div>

          </div>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="reception-controls">

            <div className="reception-control">

              <label>
                Report Date
              </label>

              <input
                type="date"
                value={
                  reportDate
                }
                onChange={(e) =>
                  setReportDate(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="reception-control search-control">

              <label>
                Search Agent
              </label>

              <div className="search-box">

                <span>
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Search agent..."
                  value={
                    search
                  }
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <button
              type="button"
              className="save-all-btn"
              onClick={
                handleSaveAll
              }
              disabled={
                saving ||
                loadingRows ||
                !rows.some(
                  (row) =>
                    row.dirty
                )
              }
            >

              {saving
                ? "Saving..."
                : "✓ Save All Changes"}

            </button>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          {loadingRows ? (

            <div className="reception-loading">

              <div className="loading-spinner" />

              Loading call register...

            </div>

          ) : (

            <div className="reception-table-wrapper">

              <table className="reception-table">

                <thead>

                  <tr>

                    <th className="agent-column">
                      Agent
                    </th>

                    <th>
                      DC
                    </th>

                    <th>
                      EX.IND
                    </th>

                    <th>
                      EX.USA
                    </th>

                    <th>
                      MACCALL
                    </th>

                    <th>
                      MANAGERCALL
                    </th>

                    <th>
                      NAMECALL
                    </th>

                    <th>
                      SC
                    </th>

                    <th>
                      Cancellation Calls
                    </th>

                    <th>
                      Grand Total
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRows.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="10"
                        className="empty-register"
                      >
                        No agents found.
                      </td>

                    </tr>

                  ) : (

                    filteredRows.map(
                      (row) => (

                        <tr
                          key={
                            row.agent_id
                          }
                          className={
                            row.dirty
                              ? "row-dirty"
                              : ""
                          }
                        >

                          {/* AGENT */}

                          <td className="agent-name-cell">

                            <div className="agent-cell">

                              <div className="agent-avatar">

                                {row.agent_name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}

                              </div>

                              <div>

                                <strong>
                                  {
                                    row.agent_name
                                  }
                                </strong>

                                {row.dirty && (

                                  <span className="unsaved-label">
                                    Unsaved
                                  </span>

                                )}

                              </div>

                            </div>

                          </td>


                          {/* DC */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.dc
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "dc",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* EX.IND */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.ex_ind
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "ex_ind",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* EX.USA */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.ex_usa
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "ex_usa",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* MACCALL */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.maccall
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "maccall",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* MANAGERCALL */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.managercall
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "managercall",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* NAMECALL */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.namecall
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "namecall",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* SC */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              value={
                                row.sc
                              }
                              onChange={(e) =>
                                updateCell(
                                  row.agent_name,
                                  "sc",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          {/* CANCELLATION CALLS */}

                          <td>

                            <input
                              type="number"
                              min="0"
                              placeholder="—"
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


                          {/* GRAND TOTAL */}

                          <td className="grand-total-cell">

                            <strong>
                              {
                                row.grand_total
                              }
                            </strong>

                          </td>

                        </tr>

                      )
                    )

                  )}


                  {/* =================================================
                      TOTAL ROW
                  ================================================= */}

                  {filteredRows.length >
                    0 && (

                    <tr className="reception-total-row">

                      <td>
                        <strong>
                          TOTAL
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.dc
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.ex_ind
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.ex_usa
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.maccall
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.managercall
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.namecall
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.sc
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.cancellation_calls
                          }
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {
                            totals.grand_total
                          }
                        </strong>
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </Layout>
  );
}


export default Reception;