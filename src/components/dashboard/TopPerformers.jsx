import "./TopPerformers.css";

function topAgent(reports, field, money = false) {
  if (!reports.length) return [];

  return [...reports]
    .sort((a, b) => Number(b[field] || 0) - Number(a[field] || 0))
    .slice(0, 3);
}

export default function TopPerformers({ reports }) {
  const tickets = topAgent(reports, "fresh_tickets");
  const insurance = topAgent(reports, "insurance_sold");
  const toa = topAgent(reports, "token_appreciation");
  const reviews = topAgent(reports, "google_reviews");

  function Card(title, list, field, money = false) {
    const medals = ["🥇", "🥈", "🥉"];

    return (
      <div className="performer-card">

        <h3>{title}</h3>

        {list.length === 0 ? (
          <p>No Data</p>
        ) : (
          list.map((agent, index) => (
            <div
              key={agent.id}
              className="performer-row"
            >
              <span>
                {medals[index]} {agent.agent_name}
              </span>

              <strong>
                {money
                  ? `$${agent[field]}`
                  : agent[field]}
              </strong>
            </div>
          ))
        )}

      </div>
    );
  }

  return (
    <div className="top-container">

      {Card(
        "🎫 Tickets",
        tickets,
        "fresh_tickets"
      )}

      {Card(
        "🛡 Insurance",
        insurance,
        "insurance_sold"
      )}

      {Card(
        "💰 TOA",
        toa,
        "token_appreciation",
        true
      )}

      {Card(
        "⭐ Google Reviews",
        reviews,
        "google_reviews"
      )}

    </div>
  );
}