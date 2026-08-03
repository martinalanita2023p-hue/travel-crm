import "./TopPerformers.css";

function topAgent(reports, field) {
  if (!reports.length) return null;

  return [...reports].sort(
    (a, b) => Number(b[field] || 0) - Number(a[field] || 0)
  )[0];
}

function bestConversion(reports) {
  if (!reports.length) return null;

  return [...reports]
    .map((agent) => ({
      ...agent,
      conversion:
        Number(agent.fresh_calls || 0) === 0
          ? 0
          : (
              (Number(agent.fresh_tickets || 0) /
                Number(agent.fresh_calls || 0)) *
              100
            ).toFixed(1),
    }))
    .sort((a, b) => b.conversion - a.conversion)[0];
}

export default function TopPerformers({ reports }) {
  const ticketChampion = topAgent(reports, "fresh_tickets");
  const toaChampion = topAgent(reports, "token_appreciation");
  const conversionChampion = bestConversion(reports);

  // Temporary until Performance Score is built
  const topPerformer = ticketChampion;

  const cards = [
    {
      title: "🏆 Top Performer",
      agent: topPerformer?.agent_name || "No Data",
      value: topPerformer
        ? `${topPerformer.fresh_tickets} Tickets`
        : "",
    },
    {
      title: "🥇 Best Conversion",
      agent: conversionChampion?.agent_name || "No Data",
      value: conversionChampion
        ? `${conversionChampion.conversion}%`
        : "",
    },
    {
      title: "💰 Highest TOA",
      agent: toaChampion?.agent_name || "No Data",
      value: toaChampion
        ? `$${toaChampion.token_appreciation}`
        : "",
    },
    {
      title: "🎫 Ticket Champion",
      agent: ticketChampion?.agent_name || "No Data",
      value: ticketChampion
        ? `${ticketChampion.fresh_tickets} Tickets`
        : "",
    },
  ];

  return (
    <div className="top-container">
      {cards.map((card) => (
        <div className="performer-card" key={card.title}>
          <h3>{card.title}</h3>

          <h2>{card.agent}</h2>

          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
}