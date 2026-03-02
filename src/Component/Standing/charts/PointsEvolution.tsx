import { RechartsDevtools } from "@recharts/devtools";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function PointsEvolution() {
  const data = [
      { name: 'Race 1', uv: 1 },
      { name: 'Race 2', uv: 2 },
      { name: 'Race 3', uv: 3 },
      { name: 'Race 4', uv: 2 },
      { name: 'Race 5', uv: 1 },
    ];
  
    return (
      <div className="standing-chart-container">
        <RechartsDevtools />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#0088ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}

export default PointsEvolution