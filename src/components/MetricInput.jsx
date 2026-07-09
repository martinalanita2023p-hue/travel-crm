function MetricInput({
  label,
  name,
  value,
  onChange,
  type = "number",
  placeholder = "0",
}) {
  return (
    <div className="metric-input">

      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        min="0"
      />

    </div>
  );
}

export default MetricInput;