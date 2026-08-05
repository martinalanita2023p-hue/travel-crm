import "./QuickActions.css";

export default function QuickActions({
  exportExcel,
  refresh,
}) {
  return (
    <div className="quick-actions">

      <button onClick={exportExcel}>
        📥 Export Excel
      </button>

      <button onClick={() => window.print()}>
        🖨 Print
      </button>

      <button onClick={refresh}>
        🔄 Refresh
      </button>

      <button
        onClick={() =>
          window.location.reload()
        }
      >
        ♻ Reload
      </button>

    </div>
  );
}