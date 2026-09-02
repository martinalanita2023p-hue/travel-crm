import { useEffect, useMemo, useState } from "react";

import Layout from "../components/Layout";
import "../styles/reception.css";

import {
  getAgents,
  getReceptionCallsForDate,
  saveReceptionDailyCall,
} from "../services/receptionDailyService";

import { getUser } from "../services/authService";

import { getBostonDate } from "../utils/bostonTime";


function createEmptyRow(agent) {
  return {
    agent_id: agent.id,
    agent_name: agent.name,

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


function Reception() {
  const currentUser = getUser();

  const [reportDate, setReportDate] =
    useState(getBostonDate());

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");


  useEffect(() => {
    async function loadAgents() {
      try {
        setLoadingAgents(true);

        const data = await getAgents();

        setAgents(data || []);
      } catch (error) {
        console.error("Failed to load agents:", error);
        alert("Unable to load agents.");
      } finally {
        setLoadingAgents(false);
      }
    }

    loadAgents();
  }, []);


  useEffect(() => {
    async function loadRows() {
      if (!agents.length) return;

      try {
        setLoadingRows(true);

        const existing =
          await getReceptionCallsForDate(reportDate);

        const existingMap = new Map();

        (existing || []).forEach((record) => {
          existingMap.set(
            record.agent_name?.trim().toLowerCase(),
            record
          );
        });

        const newRows = agents.map((agent) => {
          const record =
            existingMap.get(
              agent.name?.trim().toLowerCase()
            );

          if (!record) {
            return createEmptyRow(agent);
          }

          return {
            agent_id: agent.id,
            agent_name: agent.name,

            fresh_calls: record.fresh_calls ?? 0,
            dc_calls: record.dc_calls ?? 0,
            cancellation_calls:
              record.cancellation_calls ?? 0,

            fresh_disposed:
              record.fresh_disposed ?? 0,

            dc_disposed:
              record.dc_disposed ?? 0,

            cancellation_disposed:
              record.cancellation_disposed ?? 0,

            remarks: record.remarks ?? "",

            reception_record_id: record.id,

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
  }, [agents, reportDate]);


  function updateCell(agentName, field, value) {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.agent_name !== agentName) {
          return row;
        }

        let finalValue = value;

        if (field !== "remarks") {
          finalValue =
            value === ""
              ? ""
              : Math.max(0, Number(value) || 0);
        }

        return {
          ...row,
          [field]: finalValue,
          dirty: true,
        };
      })
    );
  }


  async function handleSaveAll() {
    const changedRows =
      rows.filter((row) => row.dirty);

    if (!changedRows.length) {
      alert("There are no changes to save.");
      return;
    }

    for (const row of changedRows) {
      const disposedTotal =
        Number(row.fresh_disposed || 0) +
        Number(row.dc_disposed || 0) +
        Number(row.cancellation_disposed || 0);

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

      for (const row of changedRows) {
        await saveReceptionDailyCall({
          report_date: reportDate,

          agent_name: row.agent_name,

          fresh_calls:
            Number(row.fresh_calls || 0),

          dc_calls:
            Number(row.dc_calls || 0),

          cancellation_calls:
            Number(row.cancellation_calls || 0),

          fresh_disposed:
            Number(row.fresh_disposed || 0),

          dc_disposed:
            Number(row.dc_disposed || 0),

          cancellation_disposed:
            Number(row.cancellation_disposed || 0),

          remarks:
            row.remarks?.trim() || null,

          reception_user:
            currentUser?.id || null,
        });
      }

      setRows((currentRows) =>
        currentRows.map((row) => ({
          ...row,
          dirty: false,
        }))
      );

      alert(
        "Reception call data saved successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error?.message ||
        "Failed to save Reception data."
      );
    } finally {
      setSaving(false);
    }
  }


  const filteredRows = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) =>
      row.agent_name
        ?.toLowerCase()
        .includes(query)
    );
  }, [rows, search]);


  const totals = useMemo(() => {
    return rows.reduce(
      (total, row) => {
        total.fresh +=
          Number(row.fresh_calls || 0);

        total.dc +=
          Number(row.dc_calls || 0);

        total.cancellation +=
          Number(row.cancellation_calls || 0);

        total.freshDisposed +=
          Number(row.fresh_disposed || 0);

        total.dcDisposed +=
          Number(row.dc_disposed || 0);

        total.cancellationDisposed +=
          Number(row.cancellation_disposed || 0);

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
  }, [rows]);


  const totalCalls =
    totals.fresh +
    totals.dc +
    totals.cancellation;


  const totalDisposed =
    totals.freshDisposed +
    totals.dcDisposed +
    totals.cancellationDisposed;


  return (
    <Layout title="Reception Dashboard">

      <div className="reception-page">

        {/* HEADER */}

        <section className="reception-hero">

          <div>

            <span className="reception-eyebrow">
              OPERATIONS
            </span>

            <p>
              Daily panel call register and disposition tracking
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
                  timeZone: "America/New_York",
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              ).format(
                new Date(reportDate + "T12:00:00")
              )}
            </strong>

          </div>

        </section>


        {/* KPI CARDS */}

        <section className="reception-summary-grid">

          <div className="reception-kpi total">

            <div className="kpi-icon">
              ☎
            </div>

            <div>

              <span>
                Total Calls
              </span>

              <strong>
                {totalCalls}
              </strong>

            </div>

          </div>


          <div className="reception-kpi fresh">

            <div className="kpi-icon">
              ↗
            </div>

            <div>

              <span>
                Fresh Calls
              </span>

              <strong>
                {totals.fresh}
              </strong>

            </div>

          </div>


          <div className="reception-kpi dc">

            <div className="kpi-icon">
              ⇄
            </div>

            <div>

              <span>
                DC Calls
              </span>

              <strong>
                {totals.dc}
              </strong>

            </div>

          </div>


          <div className="reception-kpi cancellation">

            <div className="kpi-icon">
              ×
            </div>

            <div>

              <span>
                Cancellation
              </span>

              <strong>
                {totals.cancellation}
              </strong>

            </div>

          </div>


          <div className="reception-kpi disposed">

            <div className="kpi-icon">
              !
            </div>

            <div>

              <span>
                Disposed
              </span>

              <strong>
                {totalDisposed}
              </strong>

            </div>

          </div>

        </section>


        {/* REGISTER */}

        <section className="reception-register">

          <div className="reception-register-top">

            <div>

              <span className="section-label">
                DAILY REGISTER
              </span>

              <h2>
                Agent Call Register
              </h2>

              <p>
                Enter the call counts received
                from the panel for each agent.
              </p>

            </div>


            <div className="register-status">

              <span className="status-dot" />

              Boston Time

            </div>

          </div>


          {/* CONTROLS */}

          <div className="reception-controls">

            <div className="reception-control">

              <label>
                Report Date
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) =>
                  setReportDate(e.target.value)
                }
              />

            </div>


            <div className="reception-control search-control">

              <label>
                Search Agent
              </label>

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search agent..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            <button
              className="save-all-btn"
              onClick={handleSaveAll}
              disabled={
                saving ||
                loadingRows
              }
            >

              {saving
                ? "Saving..."
                : "✓ Save All Changes"}

            </button>

          </div>


          {/* TABLE */}

          {loadingAgents ||
          loadingRows ? (

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

                    <th className="fresh-column">
                      Fresh Calls
                    </th>

                    <th className="dc-column">
                      DC Calls
                    </th>

                    <th className="cancel-column">
                      Cancellation
                    </th>

                    <th>
                      Fresh
                      <br />
                      Disposed
                    </th>

                    <th>
                      DC
                      <br />
                      Disposed
                    </th>

                    <th>
                      Cancellation
                      <br />
                      Disposed
                    </th>

                    <th className="remarks-column">
                      Remarks
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRows.map((row) => (

                    <tr
                      key={row.agent_id}
                      className={
                        row.dirty
                          ? "row-dirty"
                          : ""
                      }
                    >

                      <td className="agent-name-cell">

                        <div className="agent-cell">

                          <div className="agent-avatar">

                            {row.agent_name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {row.agent_name}
                            </strong>

                            {row.dirty && (

                              <span className="unsaved-label">
                                Unsaved
                              </span>

                            )}

                          </div>

                        </div>

                      </td>


                      <td>

                        <input
                          type="number"
                          min="0"
                          value={row.fresh_calls}
                          onChange={(e) =>
                            updateCell(
                              row.agent_name,
                              "fresh_calls",
                              e.target.value
                            )
                          }
                          aria-label={`${row.agent_name} fresh calls`}
                        />

                      </td>


                      <td>

                        <input
                          type="number"
                          min="0"
                          value={row.dc_calls}
                          onChange={(e) =>
                            updateCell(
                              row.agent_name,
                              "dc_calls",
                              e.target.value
                            )
                          }
                          aria-label={`${row.agent_name} DC calls`}
                        />

                      </td>


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


                      <td>

                        <input
                          type="text"
                          className="table-remarks-input"
                          placeholder={
                            row.fresh_disposed ||
                            row.dc_disposed ||
                            row.cancellation_disposed
                              ? "Required"
                              : "Optional remarks"
                          }
                          value={row.remarks}
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

                  ))}


                  {!filteredRows.length && (

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


        {/* DISPOSED */}

        <section className="reception-disposed-summary">

          <div className="disposed-header">

            <div>

              <span className="section-label">
                DISPOSITION
              </span>

              <h2>
                Disposed Calls
              </h2>

              <p>
                Calls that could not be serviced.
              </p>

            </div>


            <div className="disposed-total">

              <span>
                Total
              </span>

              <strong>
                {totalDisposed}
              </strong>

            </div>

          </div>


          <div className="reception-disposed-grid">

            <div className="disposed-card fresh-disposed">

              <span>
                Fresh Call Disposed
              </span>

              <strong>
                {totals.freshDisposed}
              </strong>

            </div>


            <div className="disposed-card dc-disposed">

              <span>
                DC Disposed
              </span>

              <strong>
                {totals.dcDisposed}
              </strong>

            </div>


            <div className="disposed-card cancellation-disposed">

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