import MetricInput from "./MetricInput";

function SectionCard({
  title,
  icon,
  color,
  fields,
  report,
  onChange,
}) {

  return (

    <div
      className="section-card"
      style={{ borderTop: `5px solid ${color}` }}
    >

      <h2>
        {icon} {title}
      </h2>

      {fields.map((field) => (

        <MetricInput
          key={field.name}
          label={field.label}
          name={field.name}
          value={report[field.name]}
          onChange={onChange}
        />

      ))}

    </div>

  );

}

export default SectionCard;