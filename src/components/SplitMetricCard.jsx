import MetricInput from "./MetricInput";

function SplitMetricCard({
  title,
  icon,
  color,
  leftLabel,
  leftName,
  rightLabel,
  rightName,
  report,
  onChange,
}) {

  return (

    <div
      className="split-card"
      style={{ borderTop: `5px solid ${color}` }}
    >

      <h2>
        {icon} {title}
      </h2>

      <div className="split-content">

        <MetricInput
          label={leftLabel}
          name={leftName}
          value={report[leftName]}
          onChange={onChange}
        />

        <div className="vertical-divider"></div>

        <MetricInput
          label={rightLabel}
          name={rightName}
          value={report[rightName]}
          onChange={onChange}
        />

      </div>

    </div>

  );

}

export default SplitMetricCard;