function AgentReportForm({

  report,

  handleChange,

  currentUser,

}) {

  return (

    <>

      {/* ================= AGENT ================= */}

      <div className="section-card">

        <div className="section-header">

          <h2>👤 Agent Information</h2>

          <p>Logged in employee</p>

        </div>

        <div className="agent-form">

          <div className="input-group">

            <label>Agent Name</label>

            <input

              type="text"

              value={currentUser?.name || ""}

              readOnly

            />

          </div>

          <div className="input-group">

            <label>Employee ID</label>

            <input

              type="text"

              value={currentUser?.employee_id || ""}

              readOnly

            />

          </div>

        </div>

      </div>

      {/* ================= CALLS ================= */}

      <div className="section-card">

        <div className="section-header">

          <h2>📞 Calls</h2>

          <p>Enter all calls handled today</p>

        </div>

        <div className="agent-form">

          <div className="input-group">

            <label>Fresh Calls</label>

            <input

              type="number"

              name="fresh_calls"

              value={report.fresh_calls}

              onChange={handleChange}

            />

          </div>

          <div className="input-group">

            <label>MAC Calls</label>

            <input

              type="number"

              name="mac_calls"

              value={report.mac_calls}

              onChange={handleChange}

            />

          </div>

          <div className="input-group">

            <label>DC Calls</label>

            <input

              type="number"

              name="dc_calls"

              value={report.dc_calls}

              onChange={handleChange}

            />

          </div>

          <div className="input-group">

            <label>SC Calls</label>

            <input

              type="number"

              name="sc_calls"

              value={report.sc_calls}

              onChange={handleChange}

            />

          </div>

          <div className="input-group">

            <label>Manager Calls</label>

            <input

              type="number"

              name="manager_calls"

              value={report.manager_calls}

              onChange={handleChange}

            />

          </div>

          <div className="input-group">

            <label>Airport Calls</label>

            <input

              type="number"

              name="airport_calls"

              value={report.airport_calls}

              onChange={handleChange}

            />

          </div>

        </div>

      </div>

    </>

  );

}

export default AgentReportForm;