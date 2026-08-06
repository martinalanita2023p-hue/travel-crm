import "./AgentReportForm.css";

export default function AgentReportForm({
  report,
  handleChange,
  handleSubmit,
}) {
  return (
    <div className="agent-form-card">

      <h2>📝 Today's Report</h2>

      {/* ================= CALLS ================= */}

      <div className="form-section">

        <h3>📞 Calls</h3>

        <div className="form-grid">

          <FormInput
            label="Fresh Calls"
            name="fresh_calls"
            value={report.fresh_calls}
            onChange={handleChange}
          />

          <FormInput
            label="SC Calls"
            name="sc_calls"
            value={report.sc_calls}
            onChange={handleChange}
          />

          <FormInput
            label="Name Calls"
            name="name_calls"
            value={report.name_calls}
            onChange={handleChange}
          />

          <FormInput
            label="MAC Calls"
            name="mac_calls"
            value={report.mac_calls}
            onChange={handleChange}
          />

          <FormInput
            label="DC Calls"
            name="dc_calls"
            value={report.dc_calls}
            onChange={handleChange}
          />

          <FormInput
            label="Manager Calls"
            name="manager_calls"
            value={report.manager_calls}
            onChange={handleChange}
          />

          <FormInput
            label="Airport Calls"
            name="airport_calls"
            value={report.airport_calls}
            onChange={handleChange}
          />

          <FormInput
            label="Cancellation Calls"
            name="cancellation_calls"
            value={report.cancellation_calls}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ================= SALES ================= */}

      <div className="form-section">

        <h3>🎫 Sales</h3>

        <div className="form-grid">

          <FormInput
            label="Fresh Tickets"
            name="fresh_tickets"
            value={report.fresh_tickets}
            onChange={handleChange}
          />

          <FormInput
            label="PNRs Created"
            name="pnrs_created"
            value={report.pnrs_created}
            onChange={handleChange}
          />

          <FormInput
            label="B2C Sales"
            name="b2c_sales"
            value={report.b2c_sales}
            onChange={handleChange}
          />

          <FormInput
            label="DC Sales"
            name="dc_sales"
            value={report.dc_sales}
            onChange={handleChange}
          />

          <FormInput
            label="Cancellation Sales"
            name="cancellation_sales"
            value={report.cancellation_sales}
            onChange={handleChange}
          />

          <FormInput
            label="Insurance Sold"
            name="insurance_sold"
            value={report.insurance_sold}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ================= REVIEWS ================= */}

      <div className="form-section">

        <h3>⭐ Reviews</h3>

        <div className="form-grid">

          <FormInput
            label="Google Reviews"
            name="google_reviews"
            value={report.google_reviews}
            onChange={handleChange}
          />

          <FormInput
            label="Trustpilot Reviews"
            name="trustpilot_reviews"
            value={report.trustpilot_reviews}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ================= FINANCE ================= */}

      <div className="form-section">

        <h3>💰 Finance</h3>

        <div className="form-grid">

          <FormInput
            label="Token of Appreciation ($)"
            name="token_appreciation"
            value={report.token_appreciation}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ================= SAVE ================= */}

      <div className="save-report-section">

        <button
          className="save-report-btn"
          onClick={handleSubmit}
        >
          💾 Save Today's Report
        </button>

      </div>

    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="agent-form-input">

      <label>{label}</label>

      <input
        type="number"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}