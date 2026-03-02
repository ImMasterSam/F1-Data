import { RechartsDevtools } from "@recharts/devtools";
import { useEffect } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPointsEvolution } from "../../../Lib/standingData";

function PointsDistribution() {

    const data = [
    { name: 'Race 1', uv: 1 },
    { name: 'Race 2', uv: 2 },
    { name: 'Race 3', uv: 3 },
    { name: 'Race 4', uv: 2 },
    { name: 'Race 5', uv: 1 },
  ];

  return (
    <div className="standing-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PointsDistribution