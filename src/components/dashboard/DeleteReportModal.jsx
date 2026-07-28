import { useState } from "react";
import "./DeleteReportModal.css";
import { deleteAgentReport } from "../../services/managerService";

export default function DeleteReportModal({
  report,
  onClose,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);

      await deleteAgentReport(report.id);

      onDeleted();
    } catch (err) {
      console.error(err);
      alert("Unable to delete report.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h2>⚠ Delete Report</h2>

        <p>Are you sure you want to delete this report?</p>

        <div className="delete-details">
          <p>
            <strong>Agent:</strong> {report.agent_name}
          </p>

          <p>
            <strong>Date:</strong> {report.report_date}
          </p>
        </div>

        <p className="warning">
          This action cannot be undone.
        </p>

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}