import "./AgentSummary.css";

export default function AgentSummary({ report }) {
  const cards = [
    {
      title: "Fresh Calls",
      value: report.fresh_calls || 0,
      icon: "📞",
    },
    {
      title: "Tickets",
      value: report.fresh_tickets || 0,
      icon: "🎫",
    },
    {
      title: "Insurance",
      value: report.insurance_sold || 0,
      icon: "🛡️",
    },
    {
      title: "TOA",
      value: `$${Number(report.token_appreciation || 0).toFixed(2)}`,
      icon: "💰",
    },
  ];

  return (
    <div className="agent-summary-grid">
      {cards.map((card) => (
        <div className="agent-summary-card" key={card.title}>
          <div className="summary-icon">
            {card.icon}
          </div>

          <div className="summary-info">
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}