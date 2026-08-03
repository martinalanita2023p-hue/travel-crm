import "./ManagerHeader.css";

export default function ManagerHeader({
  selectedDate,
  setSelectedDate,
  selectedAgent,
  setSelectedAgent,
  agents,
  search,
  setSearch,
  exportExcel,
}) {
  return (
    <div className="manager-toolbar">

      <div className="toolbar-title">

        <h2>📊 Manager Dashboard</h2>

        <p>Daily Team Performance Overview</p>

      </div>

      <div className="toolbar-controls">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />

        <select
          value={selectedAgent}
          onChange={(e) =>
            setSelectedAgent(e.target.value)
          }
        >
          <option>All Agents</option>

          {agents.map((agent) => (
            <option
              key={agent.id}
              value={agent.username}
            >
              {agent.username}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search agent..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="export-btn"
          onClick={exportExcel}
        >
          📥 Export Excel
        </button>

      </div>

    </div>
  );
}