import StatCard from "./StatCard";

function ManagerStats({ stats }) {
  return (
    <div className="stats-container">

      <StatCard
        title="Fresh Calls"
        value={stats.freshCalls}
        icon="📞"
        color="#3b82f6"
      />

      <StatCard
        title="MAC Calls"
        value={stats.macCalls}
        icon="📱"
        color="#8b5cf6"
      />

      <StatCard
        title="DC Calls"
        value={stats.dcCalls}
        icon="📅"
        color="#f59e0b"
      />

      <StatCard
        title="Cancellation"
        value={stats.cancellationCalls}
        icon="❌"
        color="#ef4444"
      />

      <StatCard
        title="Manager Calls"
        value={stats.managerCalls}
        icon="👨‍💼"
        color="#0ea5e9"
      />

      <StatCard
        title="Airport Calls"
        value={stats.airportCalls}
        icon="✈️"
        color="#06b6d4"
      />

      <StatCard
        title="PNRs"
        value={stats.pnrs}
        icon="🎫"
        color="#10b981"
      />

      <StatCard
        title="Fresh Tickets"
        value={stats.freshTickets}
        icon="🎟️"
        color="#22c55e"
      />

      <StatCard
        title="Insurance"
        value={stats.insurance}
        icon="🛡️"
        color="#14b8a6"
      />

      <StatCard
        title="Google Reviews"
        value={stats.google}
        icon="⭐"
        color="#eab308"
      />

      <StatCard
        title="Trustpilot"
        value={stats.trustpilot}
        icon="🌟"
        color="#f97316"
      />

      <StatCard
        title="TOA ($)"
        value={stats.toa}
        icon="💰"
        color="#16a34a"
      />

      <StatCard
        title="Conversion"
        value={`${stats.conversion}%`}
        icon="📈"
        color="#2563eb"
      />

     

    </div>
  );
}

export default ManagerStats;