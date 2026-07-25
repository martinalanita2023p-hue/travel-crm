import "./Leaderboard.css";

export default function Leaderboard({ reports }) {

  const sortBy = (field) =>
    [...reports]
      .sort((a, b) => Number(b[field] || 0) - Number(a[field] || 0))
      .slice(0, 3);

  const tickets = sortBy("fresh_tickets");
  const freshCalls = sortBy("fresh_calls");
  const nameCalls = sortBy("name_calls");
  const toa = sortBy("token_appreciation");

  return (
    <div className="leaderboard-card">

      <h2>🏆 Daily Leaderboard</h2>

      {/* Render each leaderboard here */}

    </div>
  );
}