import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { fuelTrendData } from "../../data/fuelTrendData";

const FuelTrendChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">
        Fuel Consumption Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={fuelTrendData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="fuel"
            stroke="#16a34a"
            fill="#86efac"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelTrendChart;