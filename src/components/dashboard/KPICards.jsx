import "./KPICards.css";

export default function KPICards({
  stats,
  onCardClick,
}) {

  const cards = [
    {
      title: "Fresh Calls",
      value: stats.freshCalls,
      key: "freshCalls",
      icon: "📞",
    },

    {
  title: "Name Calls",
  value: stats.nameCalls,
  key: "nameCalls",
  icon: "👤",
},


    {
      title: "Tickets",
      value: stats.freshTickets,
      key: "tickets",
      icon: "🎫",
    },
    {
  title: "MAC Calls",
  value: stats.macCalls,
  key: "macCalls",
  icon: "📞",
},
    {
      title: "Insurance",
      value: stats.insurance,
      key: "insurance",
      icon: "🛡",
    },
    {
      title: "Google",
      value: stats.google,
      key: "google",
      icon: "⭐",
    },
    {
      title: "Trustpilot",
      value: stats.trustpilot,
      key: "trustpilot",
      icon: "🌟",
    },
    {
      title: "TOA",
      value: `$${stats.toa}`,
      key: "toa",
      icon: "💰",
    },
    {
      title: "Conversion",
      value: `${stats.conversion}%`,
      key: "conversion",
      icon: "📈",
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className="kpi-card"
          onClick={() => onCardClick(card.key)}
        >
          <div className="kpi-icon">
            {card.icon}
          </div>

          <div className="kpi-title">
            {card.title}
          </div>

          <div className="kpi-value">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}