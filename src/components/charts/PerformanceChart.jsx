import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PerformanceChart({ reports }) {

  const data = reports.map(r => ({
    name: r.agent_name,
    calls: Number(r.fresh_calls || 0),
  }));

  return (

    <div className="analytics-card">

      <h3>📞 Fresh Calls</h3>

      <ResponsiveContainer
        width="100%"
        height={220}
      >

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="calls"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#6366f1"
                stopOpacity={.9}
              />

              <stop
                offset="100%"
                stopColor="#6366f1"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>

          <Area
            dataKey="calls"
            stroke="#6366f1"
            fill="url(#calls)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

}