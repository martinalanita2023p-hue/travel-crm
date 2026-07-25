import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TicketsChart({ data }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 15,
        boxShadow: "0 5px 18px rgba(0,0,0,.08)"
      }}
    >
      <h2>🎫 Tickets Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}