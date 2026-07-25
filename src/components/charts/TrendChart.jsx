import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./TrendChart.css";

export default function TrendChart({
  title,
  data,
  dataKey,
  color,
}) {
  return (
    <div className="trend-card">

      <h3>{title}</h3>

      <ResponsiveContainer
        width="100%"
        height={250}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="date"/>

          <YAxis/>

          <Tooltip/>

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}