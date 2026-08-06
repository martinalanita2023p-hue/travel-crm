import "./ExecutiveSummary.css";

export default function ExecutiveSummary({ stats }) {

  const messages = [];

  if (stats.freshCalls > 0) {
    messages.push(`📞 ${stats.freshCalls} fresh calls handled today.`);
  }

  if (stats.freshTickets > 0) {
    messages.push(`🎫 ${stats.freshTickets} fresh tickets issued.`);
  }

  if (stats.insurance > 0) {
    messages.push(`🛡 ${stats.insurance} insurance policies sold.`);
  }

  if (stats.toa > 0) {
    messages.push(`💰 $${stats.toa.toFixed(2)} TOA earned.`);
  }

  return (

    <div className="executive-summary">

      <h2>📋 Executive Summary</h2>

      {messages.map((msg, index) => (

        <p key={index}>{msg}</p>

      ))}

    </div>

  );

}