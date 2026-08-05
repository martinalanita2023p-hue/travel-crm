import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function TrendChart({
  title,
  data,
  dataKey,
}) {
  return (
    <div className="trend-chart">

      <h3>{title}</h3>

      <ResponsiveContainer
        width="100%"
        height={220}
      >

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#4f46e5"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}