function ManagerHeader({
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
    <div className="manager-header">

      <div className="manager-title">
        <h1>📊 Manager Dashboard</h1>
        <p>Daily Team Performance</p>
      </div>

      <div className="manager-controls">

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
          <option value="All Agents">
            All Agents
          </option>

          {agents.map((agent) => (
            <option
              key={agent.id}
              value={agent.name}
            >
              {agent.name}
            </option>
          ))}

        </select>

        <input
          type="text"
          placeholder="🔍 Search Agent..."
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

export default ManagerHeader;