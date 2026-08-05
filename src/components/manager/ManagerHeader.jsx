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
  viewMode,
  setViewMode,
  filterMode,
  setFilterMode,
}) {
  return (
    <div className="manager-toolbar">

      {/* ==========================
          TITLE
      ========================== */}

      <div className="toolbar-title">

        <h2>📊 Manager Dashboard</h2>

        <p>Travel CRM Performance Center</p>

      </div>

      {/* ==========================
          CONTROLS
      ========================== */}

      <div className="toolbar-controls">

        {/* Date */}

        <div className="filter-group">

          <label>Date</label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
          />

        </div>

        {/* View */}

        <div className="filter-group">

          <label>View</label>

          <select
            value={viewMode}
            onChange={(e) =>
              setViewMode(e.target.value)
            }
          >

            <option value="day">
              Day
            </option>

            <option value="week">
              Week
            </option>

            <option value="month">
              Month
            </option>

          </select>

        </div>

        {/* Agent */}

        <div className="filter-group">

          <label>Agent</label>

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
                value={agent.username}
              >

                {agent.username}

              </option>

            ))}

          </select>

        </div>

        {/* Performance Filter */}

        <div className="filter-group">

          <label>Filter</label>

          <select
            value={filterMode}
            onChange={(e) =>
              setFilterMode(e.target.value)
            }
          >

            <option value="all">
              All Agents
            </option>

            <option value="top">
              Top Performers
            </option>

            <option value="attention">
              Needs Attention
            </option>

            <option value="insurance">
              No Insurance
            </option>

            <option value="reviews">
              No Reviews
            </option>

            <option value="toa">
              High TOA
            </option>

          </select>

        </div>

        {/* Search */}

        <div className="filter-group">

          <label>Search</label>

          <input
            type="text"
            placeholder="Search agent..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* Export */}

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