import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../../types/types";
import { formatToBRL } from "../../utils/utils";

interface ChartComponentProps {
  data: ChartDataPoint[];
}

// --- Chart Component ---
export const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const formatTooltip = (value: number, name: string) => [
    formatToBRL(value),
    name === "Total investido" ? "Total investido" : "Valor final",
  ];
  const formatYearAxisLabel = (value: number) => {
    if (value === 0) return "Início";
    return `Ano ${value}`;
  };

  const formatMonthAxisLabel = (value: number) => {
    if (value === 0) return "Início";
    return `Mês ${value}`;
  };
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return formatToBRL(value);
  };

  const isMonthlyView = data && data.length > 0 && data[0].month !== undefined;

  // Escolhe a chave e o formatador corretos
  const dataKey = isMonthlyView ? 'month' : 'year';
  const tickFormatter = isMonthlyView ? formatMonthAxisLabel : formatYearAxisLabel;
  const labelText = (label: string) => isMonthlyView ? `Mês ${label}` : `Ano ${label}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Crescimento do investimento ao longo do tempo
      </h3>
      <div className="h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={dataKey}
              tickFormatter={tickFormatter}
              stroke="#666"
              padding={{ left: 20, right: 20 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickFormatter={formatYAxisTick} stroke="#666" width={80} />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(value) => labelText(value)}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="totalInvested"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Total investido"
            />
            <Line
              type="monotone"
              dataKey="finalValue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Valor final"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
