import "./Card.css";

export default function Card({
  children,
  className = "",
}) {
  return (
    <div className={`crm-card ${className}`}>
      {children}
    </div>
  );
}