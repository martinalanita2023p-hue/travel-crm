import "./Leaderboard.css";

export default function Leaderboard({ reports = [] }) {

  const leaders = {
    freshTickets: [...reports].sort(
      (a, b) => (b.fresh_tickets || 0) - (a.fresh_tickets || 0)
    )[0],

    freshCalls: [...reports].sort(
      (a, b) => (b.fresh_calls || 0) - (a.fresh_calls || 0)
    )[0],

    scCalls: [...reports].sort(
      (a, b) => (b.sc_calls || 0) - (a.sc_calls || 0)
    )[0],

    insurance: [...reports].sort(
      (a, b) => (b.insurance_sold || 0) - (a.insurance_sold || 0)
    )[0],

    toa: [...reports].sort(
      (a, b) =>
        (b.token_appreciation || 0) -
        (a.token_appreciation || 0)
    )[0],

    google: [...reports].sort(
      (a, b) =>
        (b.google_reviews || 0) -
        (a.google_reviews || 0)
    )[0],

    trustpilot: [...reports].sort(
      (a, b) =>
        (b.trustpilot_reviews || 0) -
        (a.trustpilot_reviews || 0)
    )[0],
  };

  const cards = [
    {
      title: "🎫 Fresh Tickets",
      value: leaders.freshTickets?.fresh_tickets || 0,
      agent: leaders.freshTickets?.agent_name || "-",
    },
    {
      title: "📞 Fresh Calls",
      value: leaders.freshCalls?.fresh_calls || 0,
      agent: leaders.freshCalls?.agent_name || "-",
    },
    {
      title: "📅 SC Calls",
      value: leaders.scCalls?.sc_calls || 0,
      agent: leaders.scCalls?.agent_name || "-",
    },
    {
      title: "🛡 Insurance",
      value: leaders.insurance?.insurance_sold || 0,
      agent: leaders.insurance?.agent_name || "-",
    },
    {
      title: "💰 TOA",
      value: `$${leaders.toa?.token_appreciation || 0}`,
      agent: leaders.toa?.agent_name || "-",
    },
    {
      title: "⭐ Google Reviews",
      value: leaders.google?.google_reviews || 0,
      agent: leaders.google?.agent_name || "-",
    },
    {
      title: "🌟 Trustpilot",
      value: leaders.trustpilot?.trustpilot_reviews || 0,
      agent: leaders.trustpilot?.agent_name || "-",
    },
  ];

  return (
    <div className="leaderboard-grid">

      {cards.map((card) => (

        <div
          key={card.title}
          className="leader-card"
        >

          <h4>{card.title}</h4>

          <h2>{card.value}</h2>

          <p>🏆 {card.agent}</p>

        </div>

      ))}

    </div>
  );
}