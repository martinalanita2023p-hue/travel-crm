import { useState } from "react";
import { updateAgentReport } from "../../services/ManagerService";
import "./EditReportModal.css";

export default function EditReportModal({
  report,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
  fresh_calls: report.fresh_calls ?? 0,
  name_calls: report.name_calls ?? 0,
  mac_calls: report.mac_calls ?? 0,
  manager_calls: report.manager_calls ?? 0,
  airport_calls: report.airport_calls ?? 0,
  fresh_tickets: report.fresh_tickets ?? 0,
  pnrs_created: report.pnrs_created ?? 0,
  insurance_sold: report.insurance_sold ?? 0,
  google_reviews: report.google_reviews ?? 0,
  trustpilot_reviews: report.trustpilot_reviews ?? 0,
  token_appreciation: report.token_appreciation ?? 0,
  ...report,
});

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      await updateAgentReport(report.id, form);

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to update report.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="edit-modal">

        <h2>Edit Report</h2>

        <div className="edit-grid">

          <label>
            Fresh Calls
            <input
              type="number"
              name="fresh_calls"
              value={form.fresh_calls}
              onChange={handleChange}
            />
          </label>

          <label>
            Name Calls
            <input
              type="number"
              name="name_calls"
              value={form.name_calls}
              onChange={handleChange}
            />
          </label>

          <label>
            MAC Calls
            <input
              type="number"
              name="mac_calls"
              value={form.mac_calls}
              onChange={handleChange}
            />
          </label>

          <label>
            Manager Calls
            <input
              type="number"
              name="manager_calls"
              value={form.manager_calls}
              onChange={handleChange}
            />
          </label>

          <label>
            Airport Calls
            <input
              type="number"
              name="airport_calls"
              value={form.airport_calls}
              onChange={handleChange}
            />
          </label>

          <label>
            Tickets
            <input
              type="number"
              name="fresh_tickets"
              value={form.fresh_tickets}
              onChange={handleChange}
            />
          </label>

          <label>
            PNRs
            <input
              type="number"
              name="pnrs_created"
              value={form.pnrs_created}
              onChange={handleChange}
            />
          </label>

          <label>
            Insurance
            <input
              type="number"
              name="insurance_sold"
              value={form.insurance_sold}
              onChange={handleChange}
            />
          </label>

          <label>
            Google Reviews
            <input
              type="number"
              name="google_reviews"
              value={form.google_reviews}
              onChange={handleChange}
            />
          </label>

          <label>
            Trustpilot Reviews
            <input
              type="number"
              name="trustpilot_reviews"
              value={form.trustpilot_reviews}
              onChange={handleChange}
            />
          </label>

          <label>
            TOA
            <input
              type="number"
              name="token_appreciation"
              value={form.token_appreciation}
              onChange={handleChange}
            />
          </label>

        </div>

        <div className="modal-buttons">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}