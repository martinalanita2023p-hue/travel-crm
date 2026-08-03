import "./AttentionCenter.css";

export default function AttentionCenter({ alerts }) {
  return (
    <div className="attention-center">

      <h2>⚠️ Attention Center</h2>

      {alerts.length === 0 ? (
        <p>🟢 Everything looks good today.</p>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            className={`alert ${alert.type}`}
          >
            {alert.message}
          </div>
        ))
      )}

    </div>
  );
}