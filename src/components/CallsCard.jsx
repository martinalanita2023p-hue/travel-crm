import MetricInput from "./MetricInput";

function CallsCard({ report, handleChange }) {

  return (

    <div className="info-card calls-card">

      <h2>📞 Calls</h2>

      <MetricInput
        label="Fresh Calls"
        name="fresh_calls"
        value={report.fresh_calls}
        onChange={handleChange}
      />

      <MetricInput
        label="MAC Calls"
        name="mac_calls"
        value={report.mac_calls}
        onChange={handleChange}
      />

      <MetricInput
        label="Manager Calls"
        name="manager_calls"
        value={report.manager_calls}
        onChange={handleChange}
      />

      <MetricInput
        label="Airport Calls"
        name="airport_calls"
        value={report.airport_calls}
        onChange={handleChange}
      />

    </div>

  );

}

export default CallsCard;