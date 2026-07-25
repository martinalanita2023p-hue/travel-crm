import TrendChart from "./TrendChart";

import "./ChartsGrid.css";

export default function ChartsGrid({ data }) {

  return (

    <div className="charts-grid">

      <TrendChart
        title="🎫 Tickets"
        data={data}
        dataKey="tickets"
        color="#2563eb"
      />

      <TrendChart
        title="📞 Fresh Calls"
        data={data}
        dataKey="freshCalls"
        color="#16a34a"
      />

      <TrendChart
        title="🛡 Insurance"
        data={data}
        dataKey="insurance"
        color="#ea580c"
      />

      <TrendChart
        title="💰 TOA"
        data={data}
        dataKey="toa"
        color="#9333ea"
      />

    </div>

  );

}